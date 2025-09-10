"use client";

import type { LightColor } from "@/app/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

const Light = ({ color, active }: { color: string; active: boolean }) => {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full transition-all duration-300 border-2 border-card",
        active ? "bg-opacity-100 shadow-[0_0_15px_3px_var(--light-color)]" : "bg-opacity-20",
        "dark:border-white/20"
      )}
      style={{ backgroundColor: color, "--light-color": color } as React.CSSProperties}
    />
  );
};

const TrafficLight = ({ activeColor }: { activeColor: LightColor }) => {
  const safeActiveColor = activeColor?.toLowerCase() || 'red';
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 dark:bg-background p-2 border">
      <Light color="#ef4444" active={safeActiveColor === "red"} />
      <Light color="#f59e0b" active={safeActiveColor === "amber" || safeActiveColor === "yellow"} />
      <Light color="#22c55e" active={safeActiveColor === "green"} />
    </div>
  );
};

interface TrafficControlCardProps {
  nsColor: LightColor;
  ewColor: LightColor;
  isManualOverride: boolean;
  onManualOverrideChange: (isManual: boolean) => void;
  isPeakHour: boolean;
  onPeakHourChange: (isPeak: boolean) => void;
  onManualLightChange: (lightId: 'light1' | 'light2', color: 'red' | 'green' | 'yellow') => void;
}

const ManualLightControls = ({ lightId, isDisabled, onSet }: { lightId: 'light1' | 'light2', isDisabled: boolean, onSet: (color: 'red' | 'green' | 'yellow') => void }) => {
    return (
        <div className={cn("flex justify-center gap-2 mt-4 transition-opacity", isDisabled && "opacity-50 pointer-events-none")}>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" disabled={isDisabled} onClick={() => onSet('green')}>Green</Button>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white" disabled={isDisabled} onClick={() => onSet('yellow')}>Yellow</Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" disabled={isDisabled} onClick={() => onSet('red')}>Red</Button>
        </div>
    )
}

export default function TrafficControlCard({
  nsColor,
  ewColor,
  isManualOverride,
  onManualOverrideChange,
  isPeakHour,
  onPeakHourChange,
  onManualLightChange,
}: TrafficControlCardProps) {

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Real-time Monitor</CardTitle>
                <CardDescription>
                Live intersection traffic status.
                </CardDescription>
            </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="peak-hour-mode"
                        checked={isPeakHour}
                        onCheckedChange={onPeakHourChange}
                    />
                    <Label htmlFor="peak-hour-mode">Peak Hour</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="manual-override"
                        checked={isManualOverride}
                        onCheckedChange={onManualOverrideChange}
                    />
                    <Label htmlFor="manual-override">Manual Override</Label>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Robert Mugabe Rd</h3>
            <TrafficLight activeColor={nsColor} />
            <ManualLightControls 
                lightId="light1" 
                isDisabled={!isManualOverride} 
                onSet={(color) => onManualLightChange('light1', color)} 
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Sam Munjoma St</h3>
            <TrafficLight activeColor={ewColor} />
            <ManualLightControls 
                lightId="light2" 
                isDisabled={!isManualOverride} 
                onSet={(color) => onManualLightChange('light2', color)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
