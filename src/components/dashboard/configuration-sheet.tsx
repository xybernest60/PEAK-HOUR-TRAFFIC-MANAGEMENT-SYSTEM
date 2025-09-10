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

export interface TimingConfiguration {
  normalGreenTime: number;
  peakGreenTime: number;
  rainGreenTime: number;
  yellowTime: number;
  allRedTime: number;
}

interface ConfigurationSheetProps {
  config: TimingConfiguration;
  onSave: (newConfig: TimingConfiguration) => void;
}

export default function ConfigurationSheet({
  config,
  onSave,
}: ConfigurationSheetProps) {
  const [localConfig, setLocalConfig] = React.useState<TimingConfiguration>(config);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleSave = () => {
    onSave(localConfig);
    setIsOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({...prev, [name]: Number(value) }));
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>System Configuration</SheetTitle>
          <SheetDescription>
            Adjust system parameters. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4 rounded-md border p-4">
             <h4 className="text-lg font-semibold">Timing Delays (seconds)</h4>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="normalGreenTime">Normal Green</Label>
                <Input id="normalGreenTime" name="normalGreenTime" type="number" value={localConfig.normalGreenTime} onChange={handleInputChange} className="col-span-1" />
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="peakGreenTime">Peak Green</Label>
                <Input id="peakGreenTime" name="peakGreenTime" type="number" value={localConfig.peakGreenTime} onChange={handleInputChange} className="col-span-1" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="rainGreenTime">Rain Green</Label>
                <Input id="rainGreenTime" name="rainGreenTime" type="number" value={localConfig.rainGreenTime} onChange={handleInputChange} className="col-span-1" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="yellowTime">Yellow Time</Label>
                <Input id="yellowTime" name="yellowTime" type="number" value={localConfig.yellowTime} onChange={handleInputChange} className="col-span-1" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="allRedTime">All-Red Time</Label>
                <Input id="allRedTime" name="allRedTime" type="number" value={localConfig.allRedTime} onChange={handleInputChange} className="col-span-1" />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
