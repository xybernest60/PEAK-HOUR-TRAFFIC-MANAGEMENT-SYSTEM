"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import ConfigurationSheet, { TimingConfiguration } from "@/components/dashboard/configuration-sheet";

export type LightColor = "green" | "yellow" | "red" | "amber";

export default function DashboardPage() {
  const { toast } = useToast();

  const [timingConfig, setTimingConfig] = React.useState<TimingConfiguration>({
    normalGreenTime: 5,
    peakGreenTime: 10,
    rainGreenTime: 7,
    yellowTime: 2,
    allRedTime: 1,
  });

  const [isManualOverride, setIsManualOverride] = React.useState(false);
  const [isPeakHour, setIsPeakHour] = React.useState(false);

  const [systemStatus, setSystemStatus] = React.useState({
    rainDetected: false,
    vehiclePresence1: false,
    vehiclePresence2: false,
    systemOnline: false,
  });

  const [currentPhase, setCurrentPhase] = React.useState("UNKNOWN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");

  const lastHeartbeat = React.useRef<number>(0);

  const handleConfigSave = async (newConfig: TimingConfiguration) => {
    try {
      await set(ref(database, 'config'), newConfig);
      toast({ title: "Configuration saved successfully!" });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({ title: "Error saving configuration", variant: "destructive" });
    }
  };

  const handleManualOverrideToggle = async (isManual: boolean) => {
    try {
      await set(ref(database, 'state/manualOverride'), isManual);
      setIsManualOverride(isManual);
      toast({ title: `Manual override ${isManual ? 'enabled' : 'disabled'}.` });
    } catch (error) {
       console.error("Failed to set manual override:", error);
       toast({ title: "Error setting manual override", variant: "destructive" });
    }
  };

  const handlePeakHourToggle = async (isPeak: boolean) => {
    try {
      await set(ref(database, 'state/peakHour'), isPeak);
      setIsPeakHour(isPeak);
      toast({ title: `Peak hour ${isPeak ? 'activated' : 'deactivated'}.` });
    } catch (error) {
       console.error("Failed to set peak hour:", error);
       toast({ title: "Error setting peak hour", variant: "destructive" });
    }
  };
  
  const handleManualLightChange = async (lightId: 'light1' | 'light2', color: Omit<LightColor, 'amber' | 'yellow'>) => {
    if (!isManualOverride) {
      toast({ title: "Enable manual override to change lights.", variant: "destructive" });
      return;
    }
    try {
      await set(ref(database, `state/manualControl/${lightId}`), color);
      toast({ title: `Set ${lightId} to ${color}` });
    } catch (error) {
      console.error("Failed to manually change light:", error);
      toast({ title: "Error changing light", variant: "destructive" });
    }
  };


  const getPhaseState = (phase: string): LightColor => {
    if (!phase) return 'red';
    if (phase.includes('AMBER') || phase.includes('YELLOW')) return 'yellow';
    if (phase.includes('GREEN')) return 'green';
    return 'red';
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header systemOnline={systemStatus.systemOnline}>
         <ConfigurationSheet config={timingConfig} onSave={handleConfigSave} />
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:grid lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <TrafficControlCard
            nsColor={light1Status}
            ewColor={light2Status}
            isManualOverride={isManualOverride}
            onManualOverrideChange={handleManualOverrideToggle}
            isPeakHour={isPeakHour}
            onPeakHourChange={handlePeakHourToggle}
            onManualLightChange={handleManualLightChange}
          />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <SystemStatusCard
            status={systemStatus}
            currentPhase={currentPhase}
            phaseState={getPhaseState(currentPhase)}
            isManualOverride={isManualOverride}
            isPeakHour={isPeakHour}
          />
        </div>
      </main>
    </div>
  );
}
