"use client";

import type { Config } from "@/app/page";
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
import { Settings } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

interface ConfigurationSheetProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function ConfigurationSheet({
  config,
  setConfig,
}: ConfigurationSheetProps) {
  const [localConfig, setLocalConfig] = React.useState(config);
  const { toast } = useToast();

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = () => {
    setConfig(localConfig);
    toast({
      title: "Configuration Saved",
      description: "Traffic light timings have been updated.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({ ...prev, [name]: Number(value) }));
  };

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
          <SheetTitle>Timing Configuration</SheetTitle>
          <SheetDescription>
            Adjust timing parameters for the traffic light system. All times are
            in seconds.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="normalGreenTime" className="text-right col-span-2">
              Normal Green Time
            </Label>
            <Input
              id="normalGreenTime"
              name="normalGreenTime"
              type="number"
              value={localConfig.normalGreenTime}
              onChange={handleChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="peakGreenTime" className="text-right col-span-2">
              Peak Green Time
            </Label>
            <Input
              id="peakGreenTime"
              name="peakGreenTime"
              type="number"
              value={localConfig.peakGreenTime}
              onChange={handleChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="yellowTime" className="text-right col-span-2">
              Yellow Time
            </Label>
            <Input
              id="yellowTime"
              name="yellowTime"
              type="number"
              value={localConfig.yellowTime}
              onChange={handleChange}
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
              value={localConfig.allRedTime}
              onChange={handleChange}
              className="col-span-2"
            />
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
