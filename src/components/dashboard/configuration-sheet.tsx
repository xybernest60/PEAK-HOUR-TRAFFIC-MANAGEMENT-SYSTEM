"use client";

import type { TimingConfig, PeakHourConfig, SmsConfig } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
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
  const [localTimingConfig, setLocalTimingConfig] = React.useState(timingConfig);
  const [localPeakHourConfig, setLocalPeakHourConfig] = React.useState(peakHourConfig);
  const [localSmsPhoneNumber, setLocalSmsPhoneNumber] = React.useState(smsConfig.phoneNumber);

  React.useEffect(() => {
    setLocalTimingConfig(timingConfig);
  }, [timingConfig]);

  React.useEffect(() => {
    setLocalPeakHourConfig(peakHourConfig);
  }, [peakHourConfig]);
  
  React.useEffect(() => {
    setLocalSmsPhoneNumber(smsConfig.phoneNumber || "");
  }, [smsConfig.phoneNumber]);


  const handleSave = () => {
    onTimingConfigSave(localTimingConfig);
    onPeakHourConfigSave(localPeakHourConfig);
    onSmsNumberSave(localSmsPhoneNumber);
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
      <SheetContent className="w-full max-w-sm sm:max-w-md">
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
                <Label htmlFor="minGreenTime" className="text-right">
                  Min Green
                </Label>
                <Input
                  id="minGreenTime"
                  name="minGreenTime"
                  type="number"
                  value={localTimingConfig.minGreenTime}
                  onChange={handleTimingChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="allRedTime" className="text-right">
                  All-Red
                </Label>
                <Input
                  id="allRedTime"
                  name="allRedTime"
                  type="number"
                  value={localTimingConfig.allRedTime}
                  onChange={handleTimingChange}
                />
              </div>
            </div>
          </div>
          <Separator />
           <div>
            <h3 className="text-lg font-medium mb-4">Peak Hours</h3>
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
           <div>
            <h3 className="text-lg font-medium mb-4">GSM Alerts</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="phone-number" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phone-number"
                  placeholder="+263 7..."
                  type="tel"
                  value={localSmsPhoneNumber}
                  onChange={(e) => setLocalSmsPhoneNumber(e.target.value)}
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
