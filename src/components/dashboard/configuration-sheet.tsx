"use client";

import type { TimingConfig, PeakHourConfig, SmsConfig } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import * as React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ConfigurationSheetProps {
  timingConfig: TimingConfig;
  peakHourConfig: PeakHourConfig;
  smsConfig: SmsConfig;
  onTimingConfigSave: (config: TimingConfig) => void;
  onPeakHourConfigSave: (config: PeakHourConfig) => void;
  onSmsNumberSave: (phoneNumber: string) => void;
}

export default function ConfigurationSheet({
  timingConfig,
  peakHourConfig,
  smsConfig,
  onTimingConfigSave,
  onPeakHourConfigSave,
  onSmsNumberSave,
}: ConfigurationSheetProps) {
  const { toast } = useToast();
  const [localTimingConfig, setLocalTimingConfig] =
    React.useState(timingConfig);
  const [localPeakHourConfig, setLocalPeakHourConfig] =
    React.useState(peakHourConfig);
  const [localSmsPhoneNumber, setLocalSmsPhoneNumber] = React.useState(
    smsConfig.phoneNumber
  );

  React.useEffect(() => {
    setLocalTimingConfig(timingConfig);
  }, [timingConfig]);

  React.useEffect(() => {
    setLocalPeakHourConfig(peakHourConfig);
  }, [peakHourConfig]);

  React.useEffect(() => {
    setLocalSmsPhoneNumber(smsConfig.phoneNumber || "");
  }, [smsConfig.phoneNumber]);

  const handleTimingSave = () => {
    onTimingConfigSave(localTimingConfig);
  };

  const handlePeakHourSave = () => {
    onPeakHourConfigSave(localPeakHourConfig);
  };

  const handleSmsSave = () => {
    onSmsNumberSave(localSmsPhoneNumber);
  };

  const handleTimingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalTimingConfig((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handlePeakHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalPeakHourConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configuration</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-sm sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>System Configuration</SheetTitle>
          <SheetDescription>
            Adjust system parameters for the traffic light controller.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-6 py-6 pr-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Timing (seconds)</h3>
                <Button onClick={handleTimingSave}>Save</Button>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="normalGreenTime" className="text-right">
                    Normal Green
                  </Label>
                  <Input
                    id="normalGreenTime"
                    name="normalGreenTime"
                    type="number"
                    value={localTimingConfig.normalGreenTime}
                    onChange={handleTimingChange}
                  />
                </div>
                 <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="peakGreenTime" className="text-right">
                    Peak Green
                  </Label>
                  <Input
                    id="peakGreenTime"
                    name="peakGreenTime"
                    type="number"
                    value={localTimingConfig.peakGreenTime}
                    onChange={handleTimingChange}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="rainGreenTime" className="text-right">
                    Rain Green
                  </Label>
                  <Input
                    id="rainGreenTime"
                    name="rainGreenTime"
                    type="number"
                    value={localTimingConfig.rainGreenTime}
                    onChange={handleTimingChange}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="amber" className="text-right">
                    Amber
                  </Label>
                  <Input
                    id="amber"
                    name="amber"
                    type="number"
                    value={localTimingConfig.amber}
                    onChange={handleTimingChange}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="red" className="text-right">
                    Red Delay
                  </Label>
                  <Input
                    id="red"
                    name="red"
                    type="number"
                    value={localTimingConfig.red}
                    onChange={handleTimingChange}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Peak Hours</h3>
                <Button onClick={handlePeakHourSave}>Save</Button>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="start" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="start"
                    name="start"
                    type="time"
                    value={localPeakHourConfig.start}
                    onChange={handlePeakHourChange}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="end" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="end"
                    name="end"
                    type="time"
                    value={localPeakHourConfig.end}
                    onChange={handlePeakHourChange}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">GSM Alerts</h3>
                 <Button onClick={handleSmsSave}>Save</Button>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="phone-number" className="text-right">
                    Phone Number
                  </Label>
                  <Input
                    id="phone-number"
                    placeholder="+263..."
                    type="tel"
                    value={localSmsPhoneNumber || ""}
                    onChange={(e) => setLocalSmsPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter>
            {/* Footer can be empty or have a close button */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
