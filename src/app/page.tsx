"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { ref, onValue, set, update } from "firebase/database";

export interface TimingConfig {
  normalGreenTime: number;
  rainGreenTime: number;
  peakGreenTime: number;
  amber: number;
  red: number;
}

export interface PeakHourConfig {
  start: string;
  end: string;
}

export interface SmsConfig {
  enabled: boolean;
  phoneNumber: string;
}

export type LightColor = "green" | "yellow" | "red" | "amber";

export default function DashboardPage() {
  const { toast } = useToast();

  const [timingConfig, setTimingConfig] = React.useState<TimingConfig>({
    normalGreenTime: 20,
    rainGreenTime: 30,
    peakGreenTime: 40,
    amber: 3,
    red: 2,
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
    rainActive: false,
    vehiclePresence1: false,
    vehiclePresence2: false,
    systemOnline: false, // Start as offline
  });

  const [currentPhase, setCurrentPhase] = React.useState("R1_GREEN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");
  const [timer, setTimer] = React.useState(0);
  const [mode, setMode] = React.useState("AUTO");
  const [smsConfig, setSmsConfig] = React.useState<SmsConfig>({ enabled: false, phoneNumber: '' });
  

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
          peakGreenTime: dbTimingConfig.peak_green,
          amber: dbTimingConfig.amber,
          red: dbTimingConfig.red,
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

        // Determine timer based on phase
        const phaseState = getPhaseState(state.current_phase);
        if (phaseState === 'green') {
            const isR1 = state.current_phase.includes('R1');
            const activeLightTimer = isR1 ? state.light1.timer_s : state.light2.timer_s;
            const greenTime = state.peak_active ? dbTimingConfig.peak_green : (state.rain_active ? dbTimingConfig.rain_green : dbTimingConfig.normal_green);
            setTimer(greenTime - (activeLightTimer || 0));
        } else if (phaseState === 'amber') {
            const isR1 = state.current_phase.includes('R1');
            const activeLightTimer = isR1 ? state.light1.timer_s : state.light2.timer_s;
            setTimer(dbTimingConfig.amber - (activeLightTimer || 0));
        } else {
             const isR1 = state.current_phase.includes('R1');
            const activeLightTimer = isR1 ? state.light1.timer_s : state.light2.timer_s;
            setTimer(dbTimingConfig.red - (activeLightTimer || 0));
        }


        // System Status & Sensors
        setSystemStatus({
          rainDetected: data.sensors.rain.detected,
          rainActive: data.state.rain_active,
          vehiclePresence1: data.sensors.ir1.present,
          vehiclePresence2: data.sensors.ir2.present,
          systemOnline: data.system.online,
        });
        
        // SMS Alerts
        setSmsConfig(data.alerts.gsm);
      }
    }, (error) => {
      console.error(error);
      setSystemStatus(prev => ({...prev, systemOnline: false, rainActive: false}));
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the real-time database.",
      });
    });

    return () => unsubscribe();
  }, [toast]);


  const handleTimingConfigSave = (newConfig: TimingConfig) => {
    const updates = {
      'traffic/config/delays_s/normal_green': newConfig.normalGreenTime,
      'traffic/config/delays_s/rain_green': newConfig.rainGreenTime,
      'traffic/config/delays_s/peak_green': newConfig.peakGreenTime,
      'traffic/config/delays_s/red': newConfig.red,
      'traffic/config/delays_s/amber': newConfig.amber,
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
          title: "Phone Number Saved",
          description: `The phone number for alerts has been updated.`,
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

  const getPhaseState = (phase: string) => {
    if (phase.includes('AMBER')) return 'amber';
    if (phase.includes('GREEN')) return 'green';
    return 'red';
  }
  
  const getProgress = () => {
    const phaseState = getPhaseState(currentPhase);
    
    let maxTime = timingConfig.normalGreenTime;
    if(phaseState === 'green'){
      maxTime = isPeakHourActive ? timingConfig.peakGreenTime : (systemStatus.rainActive ? timingConfig.rainGreenTime : timingConfig.normalGreenTime);
    } else if (phaseState === 'amber'){
      maxTime = timingConfig.amber
    } else {
      maxTime = timingConfig.red;
    }
    
    if (maxTime === 0) return 0;
    const progressValue = (timer / maxTime) * 100;
    return 100 - progressValue;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header 
        timingConfig={timingConfig} 
        peakHourConfig={peakHourConfig}
        smsConfig={smsConfig}
        systemOnline={systemStatus.systemOnline}
        onTimingConfigSave={handleTimingConfigSave}
        onPeakHourConfigSave={handlePeakHourConfigSave}
        onSmsNumberSave={handleSmsNumberSave}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:grid lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <TrafficControlCard
              nsColor={light1Status}
              ewColor={light2Status}
              timer={timer}
              progress={getProgress()}
              isManualOverride={isManualOverride}
              setManualOverride={handleSetManualOverride}
              isPeakHour={isManualPeakHour}
              setPeakHour={handleSetManualPeakHour}
              onManualLightChange={handleManualLightChange}
              isSmsEnabled={smsConfig.enabled}
              setSmsEnabled={handleSmsEnabledChange}
            />
        </div>
         <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
           <SystemStatusCard 
             status={systemStatus}
             currentPhase={currentPhase}
             phaseState={getPhaseState(currentPhase) as "green" | "red" | "amber"}
             isManualOverride={isManualOverride}
           />
        </div>
      </main>
    </div>
  );
}
