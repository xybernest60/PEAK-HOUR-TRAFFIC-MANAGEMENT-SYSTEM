"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  CloudRain,
  ToggleLeft,
  Waypoints,
} from "lucide-react";
import StatusCard from "./status-card";


interface SystemStatusCardProps {
  status: {
    rainDetected: boolean;
    vehiclePresence1: boolean;
    vehiclePresence2: boolean;
    systemOnline: boolean;
  };
  currentPhase: string;
  phaseState: "green" | "yellow" | "red";
  isManualOverride: boolean;
}

export default function SystemStatusCard({
  status,
  currentPhase,
  phaseState,
  isManualOverride,
}: SystemStatusCardProps) {
  const getPhaseText = () => {
    if (currentPhase === 'ALL_RED') return 'All Red';
    if (currentPhase.includes('R1')) {
       return `R. Mugabe Rd ${phaseState.charAt(0).toUpperCase() + phaseState.slice(1)}`
    }
     if (currentPhase.includes('R2')) {
       return `S. Munjoma St ${phaseState.charAt(0).toUpperCase() + phaseState.slice(1)}`
    }
    return currentPhase;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusCard
            icon={CloudRain}
            title="Rain Detection"
            value={status.rainDetected ? "Active" : "Clear"}
            valueClass={status.rainDetected ? "text-cyan-400 after:bg-cyan-400/50" : "text-green-400"}
            hasGlow={status.rainDetected}
        />
         <StatusCard
          icon={ToggleLeft}
          title="Operation Mode"
          value={isManualOverride ? "Manual" : "Automatic"}
          valueClass={isManualOverride ? "text-amber-400" : "text-green-400"}
        />
        <StatusCard
            icon={Car}
            title="R. Mugabe Presence"
            value={status.vehiclePresence1 ? "Detected" : "None"}
            valueClass={status.vehiclePresence1 ? "text-primary after:bg-primary/50" : "text-muted-foreground"}
            hasGlow={status.vehiclePresence1}
        />
        <StatusCard
            icon={Car}
            title="S. Munjoma Presence"
            value={status.vehiclePresence2 ? "Detected" : "None"}
            valueClass={status.vehiclePresence2 ? "text-primary after:bg-primary/50" : "text-muted-foreground"}
            hasGlow={status.vehiclePresence2}
        />
         <StatusCard
          icon={Waypoints}
          title="Current Phase"
          value={getPhaseText()}
        />
      </CardContent>
    </Card>
  );
}
