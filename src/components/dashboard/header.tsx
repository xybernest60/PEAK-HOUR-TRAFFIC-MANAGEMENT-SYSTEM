"use client";

import type { TimingConfig, PeakHourConfig, SmsConfig } from "@/app/page";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import ConfigurationSheet from "@/components/dashboard/configuration-sheet";
import { ThemeToggle } from "../theme-toggle";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  timingConfig: TimingConfig;
  peakHourConfig: PeakHourConfig;
  smsConfig: SmsConfig;
  systemOnline: boolean;
  onTimingConfigSave: (config: TimingConfig) => void;
  onPeakHourConfigSave: (config: PeakHourConfig) => void;
  onSmsNumberSave: (phoneNumber: string) => void;
}

export default function Header({ 
    timingConfig, 
    peakHourConfig, 
    smsConfig, 
    systemOnline,
    onTimingConfigSave, 
    onPeakHourConfigSave, 
    onSmsNumberSave 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <TrafficPilotIcon className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tighter sm:text-xl">
          PEAK HOUR TRAFFIC MANAGEMENT SYSTEM
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
         <Badge variant={systemOnline ? "default" : "destructive"} className={cn("transition-all", systemOnline && "animate-pulse")}>
            {systemOnline ? "Online" : "Offline"}
         </Badge>
         <ThemeToggle />
        <ConfigurationSheet 
          timingConfig={timingConfig} 
          peakHourConfig={peakHourConfig}
          smsConfig={smsConfig}
          onTimingConfigSave={onTimingConfigSave}
          onPeakHourConfigSave={onPeakHourConfigSave} 
          onSmsNumberSave={onSmsNumberSave}
        />
      </div>
    </header>
  );
}
