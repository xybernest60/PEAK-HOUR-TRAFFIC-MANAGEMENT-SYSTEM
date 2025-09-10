"use client";

import type { LightColor } from "@/app/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

const Light = ({ color, active }: { color: string; active: boolean }) => {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full transition-all duration-300 border-2 border-card",
        active ? "bg-opacity-100 shadow-[0_0_15px_3px_var(--light-color)]" : "bg-opacity-20",
      )}
      style={{ backgroundColor: color, "--light-color": color } as React.CSSProperties}
    />
  );
};

const TrafficLight = ({ activeColor }: { activeColor: LightColor }) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 dark:bg-background p-2 border">
       <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 dark:bg-background p-2">
        <Light color="#ef4444" active={activeColor === "red"} />
        <Light color="#f59e0b" active={activeColor === "amber" || activeColor === "yellow"} />
        <Light color="#22c55e" active={activeColor === "green"} />
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
  isSmsEnabled: boolean;
  setSmsEnabled: (value: boolean) => void;
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
  isSmsEnabled,
  setSmsEnabled,
}: TrafficControlCardProps) {
    const [showManualModeAlert, setShowManualModeAlert] = React.useState(false);

    const handleButtonClick = (light: 'light1' | 'light2', color: LightColor) => {
        if (isManualOverride) {
            onManualLightChange(light, color);
        } else {
            setShowManualModeAlert(true);
        }
    }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Real-time Control</CardTitle>
        <CardDescription>
          Monitor and control intersection traffic flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Robert Mugabe Rd</h3>
            <TrafficLight activeColor={nsColor} />
            <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light1', 'green')} disabled={!isManualOverride} className="dark:bg-green-500/20 bg-green-500/80 hover:bg-green-500/90 dark:hover:bg-green-500/40 text-white dark:text-green-200 disabled:opacity-40 disabled:cursor-not-allowed">Green</Button>
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light1', 'amber')} disabled={!isManualOverride} className="dark:bg-yellow-500/20 bg-yellow-500/80 hover:bg-yellow-500/90 dark:hover:bg-yellow-500/40 text-white dark:text-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed">Amber</Button>
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light1', 'red')} disabled={!isManualOverride} className="dark:bg-red-500/20 bg-red-500/80 hover:bg-red-500/90 dark:hover:bg-red-500/40 text-white dark:text-red-200 disabled:opacity-40 disabled:cursor-not-allowed">Red</Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Sam Munjoma St</h3>
            <TrafficLight activeColor={ewColor} />
             <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light2', 'green')} disabled={!isManualOverride} className="dark:bg-green-500/20 bg-green-500/80 hover:bg-green-500/90 dark:hover:bg-green-500/40 text-white dark:text-green-200 disabled:opacity-40 disabled:cursor-not-allowed">Green</Button>
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light2', 'amber')} disabled={!isManualOverride} className="dark:bg-yellow-500/20 bg-yellow-500/80 hover:bg-yellow-500/90 dark:hover:bg-yellow-500/40 text-white dark:text-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed">Amber</Button>
                <Button variant="outline" size="sm" onClick={() => handleButtonClick('light2', 'red')} disabled={!isManualOverride} className="dark:bg-red-500/20 bg-red-500/80 hover:bg-red-500/90 dark:hover:bg-red-500/40 text-white dark:text-red-200 disabled:opacity-40 disabled:cursor-not-allowed">Red</Button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Label>Timer</Label>
            <span className="font-mono text-4xl font-bold text-primary">
              {Math.max(0, Math.ceil(timer)).toString().padStart(2, "0")}
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
           <div className="flex items-center space-x-2">
            <Switch
              id="sms-enabled"
              checked={isSmsEnabled}
              onCheckedChange={setSmsEnabled}
            />
            <Label htmlFor="sms-enabled">SMS Alerts</Label>
          </div>
        </div>
      </CardContent>
       <AlertDialog open={showManualModeAlert} onOpenChange={setShowManualModeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Automatic Mode Active</AlertDialogTitle>
            <AlertDialogDescription>
              To manually control the lights, please enable "Manual Override" mode first using the toggle switch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowManualModeAlert(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
