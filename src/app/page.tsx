"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SmsAlertsCard from "@/components/dashboard/sms-alerts-card";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { ref, onValue, set, update } from "firebase/database";

export interface TimingConfig {
  normalGreenTime: number;
  rainGreenTime: number;
  yellowTime: number;
  allRedTime: number;
  minGreenTime: number;
}

export interface PeakHourConfig {
  start: string;
  end: string;
}

export type LightColor = "green" | "yellow" | "red";

export default function DashboardPage() {
  const { toast } = useToast();

  const [timingConfig, setTimingConfig] = React.useState<TimingConfig>({
    normalGreenTime: 20,
    rainGreenTime: 30,
    yellowTime: 3,
    allRedTime: 2,
    minGreenTime: 5,
  });

  const [peakHourConfig, setPeakHourConfig] = React.useState<PeakHourConfig>({
    start: '06:30',
    end: '10:00'
  });

  const [isPeakHourActive, setIsPeakHourActive] = React.useState(false);
  const [isManualPeakHour, setIsManualPeakHour] = React.useState(false);
  const [isManualOverride, setIsManualOverride] = React.useState(false);
  
  const [systemStatus, setSystemStatus] = React.useState({
    rainDetected: false,
    vehiclePresence1: false,
    vehiclePresence2: false,
    systemOnline: false, // Start as offline
  });

  const [currentPhase, setCurrentPhase] = React.useState("R1_GREEN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");
  const [light1Timer, setLight1Timer] = React.useState(0);
  const [light2Timer, setLight2Timer] = React.useState(0);
  const [mode, setMode] = React.useState("AUTO");
  const [smsConfig, setSmsConfig] = React.useState({ enabled: false, phoneNumber: '' });

  const lastHeartbeatRef = React.useRef<number>(Date.now());


  React.useEffect(() => {
    const trafficRef = ref(database, 'traffic');
    const unsubscribe = onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Config
        const dbTimingConfig = data.config.delays_s;
        setTimingConfig({
          normalGreenTime: dbTimingConfig.normal_green,
          rainGreenTime: dbTimingConfig.rain_green,
          yellowTime: 3, // This seems to be static
          allRedTime: dbTimingConfig.all_red,
          minGreenTime: dbTimingConfig.min_green,
        });

        const dbPeakConfig = data.config.peak_hour;
        setPeakHourConfig({
            start: dbPeakConfig.start,
            end: dbPeakConfig.end,
        });
        setIsManualPeakHour(dbPeakConfig.manual_toggle);


        // State & Manual Override
        const state = data.state;
        const commands = data.commands;
        const manualOverride = commands.override;
        
        setCurrentPhase(state.current_phase);
        setLight1Timer(state.light1.timer_s);
        setLight2Timer(state.light2.timer_s);
        setMode(state.mode);
        setIsPeakHourActive(state.peak_active);
        setIsManualOverride(manualOverride);

        if (manualOverride) {
            setLight1Status(commands.manual.light1.toLowerCase());
            setLight2Status(commands.manual.light2.toLowerCase());
        } else {
            setLight1Status(state.light1.status.toLowerCase());
            setLight2Status(state.light2.status.toLowerCase());
        }

        // System Status & Sensors
        setSystemStatus(prevStatus => ({
          ...prevStatus,
          rainDetected: data.sensors.rain.detected,
          vehiclePresence1: data.sensors.ir1.present,
          vehiclePresence2: data.sensors.ir2.present,
        }));
        
        // SMS Alerts
        setSmsConfig(data.alerts.gsm);

        // Heartbeat
        if(data.system.heartbeat_ms) {
            lastHeartbeatRef.current = Date.now();
            setSystemStatus(prev => ({...prev, systemOnline: true}));
        }
      }
    }, (error) => {
      console.error(error);
      setSystemStatus(prev => ({...prev, systemOnline: false}));
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the real-time database.",
      });
    });

    const interval = setInterval(() => {
        if (Date.now() - lastHeartbeatRef.current > 5000) {
            setSystemStatus(prev => ({...prev, systemOnline: false}));
        }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    }
  }, [toast]);


  const handleTimingConfigSave = (newConfig: TimingConfig) => {
    const updates = {
      'traffic/config/delays_s/normal_green': newConfig.normalGreenTime,
      'traffic/config/delays_s/rain_green': newConfig.rainGreenTime,
      'traffic/config/delays_s/all_red': newConfig.allRedTime,
      'traffic/config/delays_s/min_green': newConfig.minGreenTime,
    };
    update(ref(database), updates)
      .then(() => {
        toast({
          title: "Configuration Saved",
          description: "Traffic light timings have been updated.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message,
        });
      });
  };

  const handlePeakHourConfigSave = (newConfig: PeakHourConfig) => {
    const updates = {
        'traffic/config/peak_hour/start': newConfig.start,
        'traffic/config/peak_hour/end': newConfig.end,
    };
    update(ref(database), updates)
      .then(() => {
        toast({
          title: "Configuration Saved",
          description: "Peak hour schedule has been updated.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message,
        });
      });
  };

  const handleManualLightChange = (light: 'light1' | 'light2', color: LightColor) => {
    if (isManualOverride) {
      update(ref(database), {
          [`traffic/commands/manual/${light}`]: color.toUpperCase()
      });
    }
  };

  const handleSetManualOverride = (manual: boolean) => {
    set(ref(database, 'traffic/commands/override'), manual);
  };
  
  const handleSetManualPeakHour = (peak: boolean) => {
    set(ref(database, 'traffic/config/peak_hour/manual_toggle'), peak);
  };

  const handleSmsNumberSave = (newPhoneNumber: string) => {
     update(ref(database), {'traffic/alerts/gsm/phone_number': newPhoneNumber})
      .then(() => {
        toast({
          title: "SMS Number Saved",
          description: `The phone number has been updated.`,
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message,
        });
      });
  }
  
  const handleSmsEnabledChange = (isEnabled: boolean) => {
    set(ref(database, 'traffic/alerts/gsm/enabled'), isEnabled);
  }

  const getPhaseState = () => {
    if (currentPhase.includes('YELLOW')) return 'yellow';
    if (currentPhase.includes('GREEN')) return 'green';
    return 'red';
  }

  const getTimerForPhase = () => {
    if (currentPhase.includes('R1')) return light1Timer;
    if (currentPhase.includes('R2')) return light2Timer;
    if (currentPhase === 'ALL_RED') return timingConfig.allRedTime;
    return 0;
  }
  
  const getProgress = () => {
    const phaseState = getPhaseState();
    const timer = getTimerForPhase();

    let maxTime = timingConfig.normalGreenTime;
    if(phaseState === 'green'){
      maxTime = isPeakHourActive ? timingConfig.rainGreenTime : timingConfig.normalGreenTime
    } else if (phaseState === 'yellow'){
      maxTime = timingConfig.yellowTime
    } else {
      maxTime = timingConfig.allRedTime;
    }
    
    if (maxTime === 0) return 0;
    return (timer / maxTime) * 100;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header 
        timingConfig={timingConfig} 
        peakHourConfig={peakHourConfig}
        onTimingConfigSave={handleTimingConfigSave}
        onPeakHourConfigSave={handlePeakHourConfigSave}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SystemStatusCard 
            status={systemStatus} 
            currentPhase={currentPhase} 
            phaseState={getPhaseState()}
            isManualOverride={isManualOverride} 
          />
          <div className="lg:col-span-2 xl:col-span-2">
            <TrafficControlCard
              nsColor={light1Status}
              ewColor={light2Status}
              timer={getTimerForPhase()}
              progress={getProgress()}
              isManualOverride={isManualOverride}
              setManualOverride={handleSetManualOverride}
              isPeakHour={isManualPeakHour}
              setPeakHour={handleSetManualPeakHour}
              onManualLightChange={handleManualLightChange}
            />
          </div>
          <SmsAlertsCard
            phoneNumber={smsConfig.phoneNumber}
            isEnabled={smsConfig.enabled}
            onNumberSave={handleSmsNumberSave}
            onEnabledChange={handleSmsEnabledChange}
          />
        </div>
      </main>
    </div>
  );
}
