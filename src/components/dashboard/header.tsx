"use client";

import type { TimingConfig, PeakHourConfig, SmsConfig } from "@/app/page";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import ConfigurationSheet from "@/components/dashboard/configuration-sheet";

interface HeaderProps {
  timingConfig: TimingConfig;
  peakHourConfig: PeakHourConfig;
  smsConfig: SmsConfig;
  onTimingConfigSave: (config: TimingConfig) => void;
  onPeakHourConfigSave: (config: PeakHourConfig) => void;
  onSmsNumberSave: (phoneNumber: string) => void;
}

export default function Header({ timingConfig, peakHourConfig, smsConfig, onTimingConfigSave, onPeakHourConfigSave, onSmsNumberSave }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <TrafficPilotIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tighter">
          TrafficPilot
        </h1>
      </div>
      <div className="ml-auto">
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
