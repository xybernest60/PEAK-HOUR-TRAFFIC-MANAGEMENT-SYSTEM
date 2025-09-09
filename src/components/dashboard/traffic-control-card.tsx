"use client";

import type { LightColor } from "@/app/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Light = ({ color, active }: { color: string; active: boolean }) => {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full transition-all duration-300",
        active ? "bg-opacity-100 shadow-[0_0_15px_3px_var(--light-color)]" : "bg-opacity-20",
      )}
      style={{ backgroundColor: color, "--light-color": color } as React.CSSProperties}
    />
  );
};

const TrafficLight = ({ activeColor, onManualChange, isManual, lightId }: { activeColor: LightColor, onManualChange: (color: LightColor) => void, isManual: boolean, lightId: 'light1' | 'light2' }) => {
  const colors: LightColor[] = ["red", "yellow", "green"];
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-background p-2 border">
       <div className={cn("flex flex-col items-center gap-2 rounded-lg bg-background p-2", isManual && "cursor-pointer")}>
        <div onClick={() => isManual && onManualChange('red')} className="p-1"><Light color="#ef4444" active={activeColor === "red"} /></div>
        <div onClick={() => isManual && onManualChange('yellow')} className="p-1"><Light color="#f59e0b" active={activeColor === "yellow"} /></div>
        <div onClick={() => isManual && onManualChange('green')} className="p-1"><Light color="#22c55e" active={activeColor === "green"} /></div>
    </div>
    </div>
  );
};

interface TrafficControlCardProps {
  nsColor: LightColor;
  ewColor: LightColor;
  timer: number;
  progress: number;
  isManualOverride: boolean;
  setManualOverride: (value: boolean) => void;
  isPeakHour: boolean;
  setPeakHour: (value: boolean) => void;
  onManualLightChange: (light: 'light1' | 'light2', color: LightColor) => void;
}

export default function TrafficControlCard({
  nsColor,
  ewColor,
  timer,
  progress,
  isManualOverride,
  setManualOverride,
  isPeakHour,
  setPeakHour,
  onManualLightChange,
}: TrafficControlCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Real-time Control</CardTitle>
        <CardDescription>
          Monitor and control intersection traffic flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Robert Mugabe Rd</h3>
            <TrafficLight 
              activeColor={nsColor}
              onManualChange={(color) => onManualLightChange('light1', color)}
              isManual={isManualOverride}
              lightId="light1"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Sam Munjoma St</h3>
            <TrafficLight 
              activeColor={ewColor} 
              onManualChange={(color) => onManualLightChange('light2', color)}
              isManual={isManualOverride}
              lightId="light2"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Label>Timer</Label>
            <span className="font-mono text-4xl font-bold text-primary">
              {Math.max(0, timer).toString().padStart(2, "0")}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch
              id="manual-override"
              checked={isManualOverride}
              onCheckedChange={setManualOverride}
            />
            <Label htmlFor="manual-override">Manual Override</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="peak-hour"
              checked={isPeakHour}
              onCheckedChange={setPeakHour}
              disabled={isManualOverride}
            />
            <Label htmlFor="peak-hour">Peak Hour Mode</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
