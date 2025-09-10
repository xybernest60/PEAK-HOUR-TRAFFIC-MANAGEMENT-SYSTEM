"use client";

import * as React from "react";
import Header from "@/components/dashboard/header";
import TrafficControlCard from "@/components/dashboard/traffic-control-card";
import SystemStatusCard from "@/components/dashboard/system-status-card";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export type LightColor = "green" | "yellow" | "red" | "amber";

export default function DashboardPage() {
  const { toast } = useToast();

  const [isManualOverride, setIsManualOverride] = React.useState(false);
  
  const [systemStatus, setSystemStatus] = React.useState({
    rainDetected: false,
    vehiclePresence1: false,
    vehiclePresence2: false,
    systemOnline: false,
  });

  const [currentPhase, setCurrentPhase] = React.useState("R1_GREEN");
  const [light1Status, setLight1Status] = React.useState<LightColor>("red");
  const [light2Status, setLight2Status] = React.useState<LightColor>("red");
  
  const lastHeartbeat = React.useRef<number>(0);

  React.useEffect(() => {
    const trafficRef = ref(database, 'traffic');
    const unsubscribe = onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // State & Mode
        const state = data.state;
        const mode = state.mode;
        
        setCurrentPhase(state.current_phase);
        setLight1Status(state.light1.toLowerCase());
        setLight2Status(state.light2.toLowerCase());
        setIsManualOverride(mode === "MANUAL");

        // System Status & Sensors
        setSystemStatus({
          rainDetected: state.rain,
          vehiclePresence1: state.ir1,
          vehiclePresence2: state.ir2,
          systemOnline: true, // Assume online if we get data
        });

        // System Heartbeat
        if(data.system && data.system.heartbeat_ms) {
            lastHeartbeat.current = data.system.heartbeat_ms;
        }

      }
    }, (error) => {
      console.error(error);
      setSystemStatus(prev => ({...prev, systemOnline: false, rainDetected: false, vehiclePresence1: false, vehiclePresence2: false}));
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the real-time database.",
      });
    });
    
     // Check for heartbeat every 10 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceHeartbeat = now - lastHeartbeat.current;
      
      if (timeSinceHeartbeat > 15000) { // 15 seconds threshold
        if (systemStatus.systemOnline) {
          setSystemStatus(prev => ({ ...prev, systemOnline: false }));
          toast({
            variant: "destructive",
            title: "Controller Offline",
            description: "No heartbeat received from the controller.",
          });
        }
      } else {
         if (!systemStatus.systemOnline) {
           setSystemStatus(prev => ({ ...prev, systemOnline: true }));
         }
      }
    }, 10000);


    return () => {
        unsubscribe();
        clearInterval(interval);
    }
  }, [toast, systemStatus.systemOnline]);


  const getPhaseState = (phase: string) => {
    if (phase.includes('AMBER')) return 'amber';
    if (phase.includes('GREEN')) return 'green';
    return 'red';
  }
  

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header systemOnline={systemStatus.systemOnline} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:grid lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <TrafficControlCard
              nsColor={light1Status}
              ewColor={light2Status}
            />
        </div>
         <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
           <SystemStatusCard 
             status={systemStatus}
             currentPhase={currentPhase}
             phaseState={getPhaseState(currentPhase)}
             isManualOverride={isManualOverride}
           />
        </div>
      </main>
    </div>
  );
}
