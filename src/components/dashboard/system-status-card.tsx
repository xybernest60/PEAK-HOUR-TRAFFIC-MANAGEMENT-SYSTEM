"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  CloudRain,
  Clock,
  Waypoints,
  ToggleLeft,
} from "lucide-react";
import StatusCard from "./status-card";


interface SystemStatusCardProps {
  status: {
    rainDetected: boolean;
    vehiclePresence1: boolean;
    vehiclePresence2: boolean;
  };
  currentPhase: string;
  phaseState: "green" | "yellow" | "red" | "amber";
  isManualOverride: boolean;
  isPeakHour: boolean;
}

export default function SystemStatusCard({
  status,
  currentPhase,
  phaseState,
  isManualOverride,
  isPeakHour
}: SystemStatusCardProps) {
  const getPhaseText = () => {
    if (currentPhase.includes('R1')) {
       return `R. Mugabe Rd ${phaseState.charAt(0).toUpperCase() + phaseState.slice(1)}`
    }
     if (currentPhase.includes('R2')) {
       return `S. Munjoma St ${phaseState.charAt(0).toUpperCase() + phaseState.slice(1)}`
    }
    return currentPhase.replace('_', ' ');
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
            valueClass={status.rainDetected ? "text-cyan-400 after:bg-cyan-400/50" : ""}
            hasGlow={status.rainDetected}
        />
         <StatusCard
          icon={ToggleLeft}
          title="Operation Mode"
          value={isManualOverride ? "Manual" : "Automatic"}
          valueClass={isManualOverride ? "text-amber-400 after:bg-amber-400/50" : ""}
          hasGlow={isManualOverride}
        />
        <StatusCard
            icon={Car}
            title="R. Mugabe Presence"
            value={status.vehiclePresence1 ? "Detected" : "None"}
            valueClass={status.vehiclePresence1 ? "text-primary after:bg-primary/50" : ""}
            hasGlow={status.vehiclePresence1}
        />
        <StatusCard
            icon={Car}
            title="S. Munjoma Presence"
            value={status.vehiclePresence2 ? "Detected" : "None"}
            valueClass={status.vehiclePresence2 ? "text-primary after:bg-primary/50" : ""}
            hasGlow={status.vehiclePresence2}
        />
        <StatusCard
            icon={Clock}
            title="Peak Hour"
            value={isPeakHour ? "Active" : "Inactive"}
            valueClass={isPeakHour ? "text-rose-400 after:bg-rose-400/50" : ""}
            hasGlow={isPeakHour}
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
