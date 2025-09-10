"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export interface TimingConfig {
  normalGreenTime: number;
  peakGreenTime: number;
  rainGreenTime: number;
  yellowTime: number;
  allRedTime: number;
}

export interface PeakHourConfig {
  peakStartTime: string;
  peakEndTime: string;
}

interface ConfigurationSheetProps {
  timingConfig: TimingConfig;
  peakHourConfig: PeakHourConfig;
  onTimingConfigSave: (newConfig: TimingConfig) => void;
  onPeakHourConfigSave: (newConfig: PeakHourConfig) => void;
}

export default function ConfigurationSheet({
  timingConfig,
  peakHourConfig,
  onTimingConfigSave,
  onPeakHourConfigSave,
}: ConfigurationSheetProps) {
  const [localTimingConfig, setLocalTimingConfig] = React.useState<TimingConfig>(timingConfig);
  const [localPeakHourConfig, setLocalPeakHourConfig] = React.useState<PeakHourConfig>(peakHourConfig);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
        setLocalTimingConfig(timingConfig);
        setLocalPeakHourConfig(peakHourConfig);
    }
  }, [timingConfig, peakHourConfig, isOpen]);
  
  const handleTimingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setLocalTimingConfig(prev => ({...prev, [name]: type === 'number' ? Number(value) : value }));
  }

  const handlePeakHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalPeakHourConfig(prev => ({...prev, [name]: value }));
  }

  const handleTimingSave = () => {
    onTimingConfigSave(localTimingConfig);
    // Maybe close the sheet? For now, we keep it open.
  };

  const handlePeakHourSave = () => {
    onPeakHourConfigSave(localPeakHourConfig);
    // Maybe close the sheet? For now, we keep it open.
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>System Configuration</SheetTitle>
          <SheetDescription>
            Adjust system parameters. Click save on a section to apply changes.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-4">
            <div className="space-y-6 py-4">
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold">Timing Delays (seconds)</h4>
                        <Button onClick={handleTimingSave} size="sm">Save Delays</Button>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="normalGreenTime">Normal Green</Label>
                        <Input id="normalGreenTime" name="normalGreenTime" type="number" value={localTimingConfig.normalGreenTime} onChange={handleTimingInputChange} className="col-span-1" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="peakGreenTime">Peak Green</Label>
                        <Input id="peakGreenTime" name="peakGreenTime" type="number" value={localTimingConfig.peakGreenTime} onChange={handleTimingInputChange} className="col-span-1" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="rainGreenTime">Rain Green</Label>
                        <Input id="rainGreenTime" name="rainGreenTime" type="number" value={localTimingConfig.rainGreenTime} onChange={handleTimingInputChange} className="col-span-1" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="yellowTime">Yellow Time</Label>
                        <Input id="yellowTime" name="yellowTime" type="number" value={localTimingConfig.yellowTime} onChange={handleTimingInputChange} className="col-span-1" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="allRedTime">All-Red Time</Label>
                        <Input id="allRedTime" name="allRedTime" type="number" value={localTimingConfig.allRedTime} onChange={handleTimingInputChange} className="col-span-1" />
                    </div>
                </div>
                
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-lg font-semibold">Peak Hour Schedule</h4>
                            <p className="text-sm text-muted-foreground">Automatically enable Peak Hour mode.</p>
                        </div>
                        <Button onClick={handlePeakHourSave} size="sm">Save Schedule</Button>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="peakStartTime">Start Time</Label>
                        <Input id="peakStartTime" name="peakStartTime" type="time" value={localPeakHourConfig.peakStartTime} onChange={handlePeakHourInputChange} className="col-span-1" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="peakEndTime">End Time</Label>
                        <Input id="peakEndTime" name="peakEndTime" type="time" value={localPeakHourConfig.peakEndTime} onChange={handlePeakHourInputChange} className="col-span-1" />
                    </div>
                </div>
            </div>
        </ScrollArea>
        <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
