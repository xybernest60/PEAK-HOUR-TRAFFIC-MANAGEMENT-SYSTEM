"use client";

import type { TimingConfig, PeakHourConfig } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import * as React from "react";

interface ConfigurationSheetProps {
  timingConfig: TimingConfig;
  peakHourConfig: PeakHourConfig;
  onTimingConfigSave: (config: TimingConfig) => void;
  onPeakHourConfigSave: (config: PeakHourConfig) => void;
}

export default function ConfigurationSheet({
  timingConfig,
  peakHourConfig,
  onTimingConfigSave,
  onPeakHourConfigSave,
}: ConfigurationSheetProps) {
  const [localTimingConfig, setLocalTimingConfig] = React.useState(timingConfig);
  const [localPeakHourConfig, setLocalPeakHourConfig] = React.useState(peakHourConfig);

  React.useEffect(() => {
    setLocalTimingConfig(timingConfig);
  }, [timingConfig]);

  React.useEffect(() => {
    setLocalPeakHourConfig(peakHourConfig);
  }, [peakHourConfig]);

  const handleSave = () => {
    onTimingConfigSave(localTimingConfig);
    onPeakHourConfigSave(localPeakHourConfig);
  };

  const handleTimingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalTimingConfig((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handlePeakHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalPeakHourConfig((prev) => ({...prev, [name]: value}));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configuration</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>System Configuration</SheetTitle>
          <SheetDescription>
            Adjust system parameters for the traffic light controller.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Timing (seconds)</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="normalGreenTime" className="text-right col-span-2">
                  Normal Green Time
                </Label>
                <Input
                  id="normalGreenTime"
                  name="normalGreenTime"
                  type="number"
                  value={localTimingConfig.normalGreenTime}
                  onChange={handleTimingChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rainGreenTime" className="text-right col-span-2">
                  Rain Green Time
                </Label>
                <Input
                  id="rainGreenTime"
                  name="rainGreenTime"
                  type="number"
                  value={localTimingConfig.rainGreenTime}
                  onChange={handleTimingChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minGreenTime" className="text-right col-span-2">
                  Min Green Time
                </Label>
                <Input
                  id="minGreenTime"
                  name="minGreenTime"
                  type="number"
                  value={localTimingConfig.minGreenTime}
                  onChange={handleTimingChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="allRedTime" className="text-right col-span-2">
                  All-Red Time
                </Label>
                <Input
                  id="allRedTime"
                  name="allRedTime"
                  type="number"
                  value={localTimingConfig.allRedTime}
                  onChange={handleTimingChange}
                  className="col-span-2"
                />
              </div>
            </div>
          </div>
          <Separator />
           <div>
            <h3 className="text-lg font-medium mb-4">Peak Hours</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right col-span-2">
                  Start Time
                </Label>
                <Input
                  id="start"
                  name="start"
                  type="time"
                  value={localPeakHourConfig.start}
                  onChange={handlePeakHourChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right col-span-2">
                  End Time
                </Label>
                <Input
                  id="end"
                  name="end"
                  type="time"
                  value={localPeakHourConfig.end}
                  onChange={handlePeakHourChange}
                  className="col-span-2"
                />
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSave}>Save Changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
