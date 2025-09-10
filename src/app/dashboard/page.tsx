"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import { useToast } from "@/hooks/use-toast";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import ConfigurationSheet, { TimingConfiguration } from "@/components/dashboard/configuration-sheet";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";

export type LightColor = "green" | "yellow" | "red" | "amber";

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

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

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const stateRef = ref(database, 'traffic/state');
    const systemRef = ref(database, 'traffic/system');

    const unsubscribeState = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentPhase(data.current_phase || "UNKNOWN");
        setLight1Status((data.light1 || "RED").toLowerCase());
        setLight2Status((data.light2 || "RED").toLowerCase());
        setIsManualOverride(data.mode === "MANUAL");
        setIsPeakHour(data.peak_active || false);

        setSystemStatus(prev => ({
          ...prev,
          rainDetected: data.rain || false,
          vehiclePresence1: data.ir1 || false,
          vehiclePresence2: data.ir2 || false,
        }));
        
        setTimingConfig({
            normalGreenTime: data.normal_green_delay || 0,
            peakGreenTime: data.peak_green_delay || 0,
            rainGreenTime: data.rain_green_delay || 0,
            yellowTime: data.yellow_delay || 0,
            allRedTime: data.all_red_delay || 0,
        });
      }
    }, (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the real-time database.",
      });
    });

    const unsubscribeSystem = onValue(systemRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.heartbeat_ms) {
            lastHeartbeat.current = data.heartbeat_ms;
        }
    });

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceHeartbeat = now - lastHeartbeat.current;
      const isOnline = lastHeartbeat.current > 0 && timeSinceHeartbeat < 15000;

      setSystemStatus(prev => {
        if (prev.systemOnline !== isOnline) {
          toast({
            variant: isOnline ? "default" : "destructive",
            title: isOnline ? "Controller Online" : "Controller Offline",
            description: isOnline ? "Connection restored." : "No heartbeat received.",
          });
          return { ...prev, systemOnline: isOnline };
        }
        return prev;
      });
    }, 10000);


    return () => {
      unsubscribeState();
      unsubscribeSystem();
      clearInterval(interval);
    }
  }, [user, loading, router, toast]);

  const handleConfigSave = async (newConfig: TimingConfiguration) => {
    try {
        await set(ref(database, 'traffic/state/normal_green_delay'), newConfig.normalGreenTime);
        await set(ref(database, 'traffic/state/peak_green_delay'), newConfig.peakGreenTime);
        await set(ref(database, 'traffic/state/rain_green_delay'), newConfig.rainGreenTime);
        await set(ref(database, 'traffic/state/yellow_delay'), newConfig.yellowTime);
        await set(ref(database, 'traffic/state/all_red_delay'), newConfig.allRedTime);
        toast({
            title: "Configuration Saved",
            description: "Timing delays have been updated.",
        });
    } catch (error) {
        console.error("Failed to save timing configuration:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save timing configuration.",
        });
    }
  };

  const handleManualOverrideToggle = async (isManual: boolean) => {
    try {
      await set(ref(database, 'traffic/state/mode'), isManual ? "MANUAL" : "AUTO");
    } catch (error) {
      console.error("Failed to toggle manual override:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not toggle manual override.",
      });
    }
  };

  const handlePeakHourToggle = async (isPeak: boolean) => {
    try {
      await set(ref(database, 'traffic/state/peak_active'), isPeak);
    } catch (error) {
      console.error("Failed to toggle peak hour:", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not toggle peak hour mode.",
        });
    }
  };
  
  const handleManualLightChange = async (lightId: 'light1' | 'light2', color: Omit<LightColor, 'amber'>) => {
     if (!isManualOverride) {
        toast({
            variant: "destructive",
            title: "Action Disabled",
            description: "Enable Manual Override to control lights.",
        });
        return;
    }
    const manualLightPath = lightId === 'light1' ? 'manualLight1' : 'manualLight2';
    const lightPath = lightId === 'light1' ? 'light1' : 'light2';

    try {
      const upperCaseColor = color.toUpperCase();
      await Promise.all([
        set(ref(database, `traffic/state/${manualLightPath}`), upperCaseColor),
        set(ref(database, `traffic/state/${lightPath}`), upperCaseColor)
      ]);
    } catch (error) {
      console.error(`Failed to set ${lightId} to ${color}:`, error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: `Could not change ${lightId} state.`,
      });
    }
  };


  const getPhaseState = (phase: string) => {
    if (!phase) return 'red';
    if (phase.includes('AMBER') || phase.includes('YELLOW')) return 'amber';
    if (phase.includes('GREEN')) return 'green';
    return 'red';
  }
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
  };

  if (loading || !user) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <div className="text-2xl">Loading Dashboard...</div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header systemOnline={systemStatus.systemOnline}>
         <ConfigurationSheet config={timingConfig} onSave={handleConfigSave} />
         <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
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
