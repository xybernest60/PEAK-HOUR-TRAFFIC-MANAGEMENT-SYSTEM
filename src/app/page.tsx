"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SmsAlertsCard from "@/components/dashboard/sms-alerts-card";
import { useToast } from "@/hooks/use-toast";

export interface Config {
  normalGreenTime: number;
  peakGreenTime: number;
  yellowTime: number;
  allRedTime: number;
}

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

  const [currentPhase, setCurrentPhase] = React.useState<"NS" | "EW" | "ALL_RED">("NS");
  const [phaseState, setPhaseState] = React.useState<"green" | "yellow">("green");
  const [timer, setTimer] = React.useState(config.normalGreenTime);

  const handleSystemStatusChange = (status: Partial<typeof systemStatus>) => {
    const newStatus = { ...systemStatus, ...status };
    if (systemStatus.systemOnline && !newStatus.systemOnline) {
      toast({
        variant: "destructive",
        title: "System Alert",
        description: "The traffic system has gone offline. Please check connections.",
      });
    }
    setSystemStatus(newStatus);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isManualOverride && systemStatus.systemOnline) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isManualOverride, systemStatus.systemOnline]);

  React.useEffect(() => {
    if (timer < 0) {
      if (phaseState === "green") {
        setPhaseState("yellow");
        setTimer(config.yellowTime);
      } else if (phaseState === "yellow") {
        const nextPhase = currentPhase === "NS" ? "EW" : "NS";
        setCurrentPhase("ALL_RED");
        setTimeout(() => {
            setCurrentPhase(nextPhase);
            setPhaseState("green");
            setTimer(isPeakHour ? config.peakGreenTime : config.normalGreenTime);
        }, config.allRedTime * 1000);
      }
    }
  }, [timer, phaseState, currentPhase, config, isPeakHour]);

  const handleManualLightChange = (direction: 'NS' | 'EW') => {
    if (isManualOverride) {
      setCurrentPhase(direction);
      setPhaseState('green');
      setTimer(99); // Manual timer
    }
  };

  const getLightColors = () => {
    let nsColor: "green" | "yellow" | "red" = "red";
    let ewColor: "green" | "yellow" | "red" = "red";

    if (currentPhase === 'NS') {
      nsColor = phaseState;
    } else if (currentPhase === 'EW') {
      ewColor = phaseState;
    }
    return { nsColor, ewColor };
  };

  const { nsColor, ewColor } = getLightColors();

  const maxTime = phaseState === 'green' 
    ? (isPeakHour ? config.peakGreenTime : config.normalGreenTime)
    : config.yellowTime;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header config={config} setConfig={setConfig} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SystemStatusCard 
            status={systemStatus} 
            setStatus={handleSystemStatusChange}
            currentPhase={currentPhase} 
            phaseState={phaseState} 
            isManualOverride={isManualOverride} 
          />
          <div className="lg:col-span-2 xl:col-span-2">
            <TrafficControlCard
              nsColor={nsColor}
              ewColor={ewColor}
              timer={currentPhase !== 'ALL_RED' ? timer : config.allRedTime}
              progress={(timer / maxTime) * 100}
              isManualOverride={isManualOverride}
              setManualOverride={setIsManualOverride}
              isPeakHour={isPeakHour}
              setPeakHour={setIsPeakHour}
              onManualLightChange={handleManualLightChange}
            />
          </div>
          <SmsAlertsCard />
        </div>
      </main>
    </div>
  );
}
