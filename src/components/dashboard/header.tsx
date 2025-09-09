"use client";

import type { Config } from "@/app/page";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import ConfigurationSheet from "@/components/dashboard/configuration-sheet";

interface HeaderProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function Header({ config, setConfig }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <TrafficPilotIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tighter">
          TrafficPilot
        </h1>
      </div>
      <div className="ml-auto">
        <ConfigurationSheet config={config} setConfig={setConfig} />
      </div>
    </header>
  );
}
