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
  const [systemOnline, setSystemOnline] = React.useState(false);

  const [systemStatus, setSystemStatus] = React.useState({
    rainDetected: false,
    vehiclePresence1: false,
    vehiclePresence2: false,
  });

  const [currentPhase, setCurrentPhase] = React.useState("UNKNOWN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");

  // Subscribe to all state changes from Firebase
  React.useEffect(() => {
    const stateRef = ref(database, 'traffic/state');
    
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSystemOnline(true);
        setIsManualOverride(data.mode === 'manual');
        setIsPeakHour(data.peak_active === true);
        setCurrentPhase(data.current_phase || "UNKNOWN");
        setLight1Status(data.light1 || "red");
        setLight2Status(data.light2 || "red");
        setSystemStatus({
          rainDetected: data.rain === true,
          vehiclePresence1: data.ir1 === true,
          vehiclePresence2: data.ir2 === true,
        });
        setTimingConfig({
            normalGreenTime: data.normal_green_delay || 5,
            peakGreenTime: data.peak_green_delay || 10,
            rainGreenTime: data.rain_green_delay || 7,
            yellowTime: data.yellow_delay || 2,
            allRedTime: data.all_red_delay || 1,
        });
      } else {
        setSystemOnline(false);
      }
    }, (error) => {
        console.error("Firebase read failed:", error);
        setSystemOnline(false);
        toast({ title: "Failed to connect to system", description: "Could not read real-time data from Firebase.", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [toast]);


  const handleConfigSave = async (newConfig: TimingConfiguration) => {
    try {
      await Promise.all([
          set(ref(database, 'traffic/state/normal_green_delay'), newConfig.normalGreenTime),
          set(ref(database, 'traffic/state/peak_green_delay'), newConfig.peakGreenTime),
          set(ref(database, 'traffic/state/rain_green_delay'), newConfig.rainGreenTime),
          set(ref(database, 'traffic/state/yellow_delay'), newConfig.yellowTime),
          set(ref(database, 'traffic/state/all_red_delay'), newConfig.allRedTime),
      ]);
      toast({ title: "Configuration saved successfully!" });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({ title: "Error saving configuration", variant: "destructive" });
    }
  };

  const handleManualOverrideToggle = async (isManual: boolean) => {
    try {
      await set(ref(database, 'traffic/state/mode'), isManual ? 'manual' : 'auto');
      toast({ title: `Manual override ${isManual ? 'enabled' : 'disabled'}.` });
    } catch (error) {
       console.error("Failed to set manual override:", error);
       toast({ title: "Error setting manual override", variant: "destructive" });
    }
  };

  const handlePeakHourToggle = async (isPeak: boolean) => {
    try {
      await set(ref(database, 'traffic/state/peak_active'), isPeak);
      toast({ title: `Peak hour ${isPeak ? 'activated' : 'deactivated'}.` });
    } catch (error) {
       console.error("Failed to set peak hour:", error);
       toast({ title: "Error setting peak hour", variant: "destructive" });
    }
  };
  
  const handleManualLightChange = async (lightId: 'light1' | 'light2', color: 'red' | 'green' | 'yellow') => {
    if (!isManualOverride) {
      toast({ title: "Enable manual override to change lights.", variant: "destructive" });
      return;
    }
    
    const path = lightId === 'light1' ? 'traffic/state/manualLight1' : 'traffic/state/manualLight2';

    try {
      await set(ref(database, path), color);
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
      <Header systemOnline={systemOnline}>
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
