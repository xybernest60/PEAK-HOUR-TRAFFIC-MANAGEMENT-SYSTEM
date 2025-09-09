"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Car,
  CloudRain,
  Server,
  ToggleLeft,
  Waypoints,
  Zap,
  ZapOff,
} from "lucide-react";
import type { ComponentProps } from "react";

interface SystemStatusCardProps {
  status: {
    rainDetected: boolean;
    vehiclePresence: boolean;
    systemOnline: boolean;
  };
  setStatus: (status: Partial<typeof status>) => void;
  currentPhase: "NS" | "EW" | "ALL_RED";
  phaseState: "green" | "yellow";
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
  setStatus,
  currentPhase,
  phaseState,
  isManualOverride,
}: SystemStatusCardProps) {
  const getPhaseText = () => {
    if (currentPhase === 'ALL_RED') return 'All Red';
    const direction = currentPhase === 'NS' ? 'North-South' : 'East-West';
    const color = phaseState.charAt(0).toUpperCase() + phaseState.slice(1);
    return `${direction} ${color}`;
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
            <span className="font-medium">System Power</span>
          </div>
          <Switch
            checked={status.systemOnline}
            onCheckedChange={(checked) => setStatus({ systemOnline: checked })}
            aria-label="Toggle system power"
          />
        </div>

        <StatusItem
          icon={CloudRain}
          label="Rain Detection"
          value={status.rainDetected ? "Active" : "Clear"}
          valueClass={status.rainDetected ? "text-accent" : "text-green-400"}
        />
        <StatusItem
          icon={Car}
          label="Vehicle Presence"
          value={status.vehiclePresence ? "Detected" : "None"}
          valueClass={status.vehiclePresence ? "text-primary" : "text-muted-foreground"}
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
