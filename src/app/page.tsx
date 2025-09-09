"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SmsAlertsCard from "@/components/dashboard/sms-alerts-card";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { ref, onValue, set, update } from "firebase/database";

export interface Config {
  normalGreenTime: number;
  peakGreenTime: number; // Assuming this will be added to DB, using rain_green for now
  yellowTime: number; // Not in DB, using a default
  allRedTime: number;
}

export type LightColor = "green" | "yellow" | "red";

export default function DashboardPage() {
  const { toast } = useToast();

  const [config, setConfig] = React.useState<Config>({
    normalGreenTime: 20,
    peakGreenTime: 30,
    yellowTime: 3,
    allRedTime: 2,
  });

  const [isPeakHour, setIsPeakHour] = React.useState(false);
  const [isManualOverride, setIsManualOverride] = React.useState(false);
  
  const [systemStatus, setSystemStatus] = React.useState({
    rainDetected: false,
    vehiclePresence: true,
    systemOnline: true,
  });

  const [currentPhase, setCurrentPhase] = React.useState("R1_GREEN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");
  const [light1Timer, setLight1Timer] = React.useState(0);
  const [light2Timer, setLight2Timer] = React.useState(0);
  const [mode, setMode] = React.useState("AUTO");
  const [smsConfig, setSmsConfig] = React.useState({ enabled: false, phoneNumber: '' });


  React.useEffect(() => {
    const trafficRef = ref(database, 'traffic');
    const unsubscribe = onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Config
        const dbConfig = data.config.delays_s;
        setConfig({
          normalGreenTime: dbConfig.normal_green,
          peakGreenTime: dbConfig.rain_green, // Placeholder
          yellowTime: 3, // Placeholder
          allRedTime: dbConfig.all_red,
        });

        // State
        const state = data.state;
        setCurrentPhase(state.current_phase);
        setLight1Status(state.light1.status.toLowerCase());
        setLight2Status(state.light2.status.toLowerCase());
        setLight1Timer(state.light1.timer_s);
        setLight2Timer(state.light2.timer_s);
        setMode(state.mode);
        setIsPeakHour(state.peak_active);

        // System Status & Sensors
        setSystemStatus({
          rainDetected: data.sensors.rain.detected,
          vehiclePresence: data.sensors.ir1.present || data.sensors.ir2.present,
          systemOnline: data.system.online,
        });

        // Manual Override
        setIsManualOverride(data.commands.override);
        
        // SMS Alerts
        setSmsConfig(data.alerts.gsm);
      }
    }, (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the real-time database.",
      });
    });

    return () => unsubscribe();
  }, [toast]);


  const handleConfigSave = (newConfig: Config) => {
    const updates = {
      'traffic/config/delays_s/normal_green': newConfig.normalGreenTime,
      'traffic/config/delays_s/rain_green': newConfig.peakGreenTime, // Placeholder
      'traffic/config/delays_s/all_red': newConfig.allRedTime,
    };
    update(ref(database), updates)
      .then(() => {
        toast({
          title: "Configuration Saved",
          description: "Traffic light timings have been updated in Firebase.",
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
      const otherLight = light === 'light1' ? 'light2' : 'light1';
      const updates = {
        [`traffic/commands/manual/${light}`]: color.toUpperCase(),
        [`traffic/commands/manual/${otherLight}`]: 'RED',
      };
      update(ref(database), updates);
    }
  };

  const handleSetManualOverride = (manual: boolean) => {
    set(ref(database, 'traffic/commands/override'), manual);
  };
  
  const handleSetPeakHour = (peak: boolean) => {
    set(ref(database, 'traffic/config/peak_hour/manual_toggle'), peak);
  };

  const handleSmsConfigSave = (newSmsConfig: {phoneNumber: string, isEnabled: boolean}) => {
     const updates = {
      'traffic/alerts/gsm/enabled': newSmsConfig.isEnabled,
      'traffic/alerts/gsm/phone_number': newSmsConfig.phoneNumber,
    };
    update(ref(database), updates)
      .then(() => {
        toast({
          title: "SMS Alerts Updated",
          description: `Notifications preferences have been saved.`,
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
  
  const getPhaseState = () => {
    if (currentPhase.includes('YELLOW')) return 'yellow';
    if (currentPhase.includes('GREEN')) return 'green';
    return 'red';
  }

  const getTimerForPhase = () => {
    if (currentPhase.includes('R1')) return light1Timer;
    if (currentPhase.includes('R2')) return light2Timer;
    if (currentPhase === 'ALL_RED') return config.allRedTime;
    return 0;
  }
  
  const getProgress = () => {
    const phaseState = getPhaseState();
    const timer = getTimerForPhase();

    let maxTime = config.normalGreenTime;
    if(phaseState === 'green'){
      maxTime = isPeakHour ? config.peakGreenTime : config.normalGreenTime
    } else if (phaseState === 'yellow'){
      maxTime = config.yellowTime
    } else {
      maxTime = config.allRedTime;
    }
    
    if (maxTime === 0) return 0;
    return (timer / maxTime) * 100;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header config={config} setConfig={handleConfigSave} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SystemStatusCard 
            status={systemStatus} 
            setStatus={(statusUpdate) => set(ref(database, 'traffic/system/online'), statusUpdate.systemOnline)}
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
              isPeakHour={isPeakHour}
              setPeakHour={handleSetPeakHour}
              onManualLightChange={handleManualLightChange}
            />
          </div>
          <SmsAlertsCard
            phoneNumber={smsConfig.phoneNumber}
            isEnabled={smsConfig.enabled}
            onSave={handleSmsConfigSave}
          />
        </div>
      </main>
    </div>
  );
}
