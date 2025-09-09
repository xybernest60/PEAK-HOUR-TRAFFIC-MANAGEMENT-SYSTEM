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
import { cn } from "@/lib/utils";


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
  hasGlow,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
  hasGlow?: boolean;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-card p-3 transition-all hover:bg-muted/50">
    <div className="flex items-center gap-3">
      <div className={cn("relative", hasGlow && "after:absolute after:inset-0 after:animate-pulse after:rounded-full after:blur-sm", valueClass)}>
         <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <span className="font-medium">{label}</span>
    </div>
    <span className={cn("font-mono text-sm font-bold", valueClass)}>
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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
         <div className="flex items-center justify-between rounded-lg bg-card p-3 transition-all hover:bg-muted/50">
            <div className="flex items-center gap-3">
                {status.systemOnline ? (
                <Zap className="h-5 w-5 text-green-400 animate-pulse" />
                ) : (
                <ZapOff className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">System Status</span>
            </div>
             <span className={cn("font-mono text-sm font-bold", status.systemOnline ? "text-green-400" : "text-red-500")}>
                {status.systemOnline ? "Online" : "Offline"}
            </span>
        </div>

        <StatusItem
          icon={CloudRain}
          label="Rain Detection"
          value={status.rainDetected ? "Active" : "Clear"}
          valueClass={status.rainDetected ? "text-cyan-400 after:bg-cyan-400/50" : "text-green-400"}
          hasGlow={status.rainDetected}
        />
        <StatusItem
          icon={Car}
          label="R. Mugabe Presence"
          value={status.vehiclePresence1 ? "Detected" : "None"}
          valueClass={status.vehiclePresence1 ? "text-primary after:bg-primary/50" : "text-muted-foreground"}
          hasGlow={status.vehiclePresence1}
        />
         <StatusItem
          icon={Car}
          label="S. Munjoma Presence"
          value={status.vehiclePresence2 ? "Detected" : "None"}
          valueClass={status.vehiclePresence2 ? "text-primary after:bg-primary/50" : "text-muted-foreground"}
          hasGlow={status.vehiclePresence2}
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
