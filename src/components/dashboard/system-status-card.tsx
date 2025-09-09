"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  CloudRain,
  ToggleLeft,
  Waypoints,
  Zap,
  ZapOff,
} from "lucide-react";

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

const StatusItem = ({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-background p-3">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </div>
    <span className={`font-mono text-sm font-bold ${valueClass}`}>
      {value}
    </span>
  </div>
);

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
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
         <div className="flex items-center justify-between rounded-lg bg-background p-3">
            <div className="flex items-center gap-3">
                {status.systemOnline ? (
                <Zap className="h-5 w-5 text-green-400" />
                ) : (
                <ZapOff className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">System Status</span>
            </div>
             <span className={`font-mono text-sm font-bold ${status.systemOnline ? "text-green-400" : "text-red-500"}`}>
                {status.systemOnline ? "Online" : "Offline"}
            </span>
        </div>

        <StatusItem
          icon={CloudRain}
          label="Rain Detection"
          value={status.rainDetected ? "Active" : "Clear"}
          valueClass={status.rainDetected ? "text-accent" : "text-green-400"}
        />
        <StatusItem
          icon={Car}
          label="R. Mugabe Presence"
          value={status.vehiclePresence1 ? "Detected" : "None"}
          valueClass={status.vehiclePresence1 ? "text-primary" : "text-muted-foreground"}
        />
         <StatusItem
          icon={Car}
          label="S. Munjoma Presence"
          value={status.vehiclePresence2 ? "Detected" : "None"}
          valueClass={status.vehiclePresence2 ? "text-primary" : "text-muted-foreground"}
        />
        <StatusItem
          icon={Waypoints}
          label="Current Phase"
          value={getPhaseText()}
        />
        <StatusItem
          icon={ToggleLeft}
          label="Operation Mode"
          value={isManualOverride ? "Manual" : "Automatic"}
          valueClass={isManualOverride ? "text-amber-400" : "text-green-400"}
        />
      </CardContent>
    </Card>
  );
}
