"use client";

import type { LightColor } from "@/app/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
}

export default function TrafficControlCard({
  nsColor,
  ewColor,
}: TrafficControlCardProps) {

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Real-time Monitor</CardTitle>
        <CardDescription>
          Live intersection traffic status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Robert Mugabe Rd</h3>
            <TrafficLight activeColor={nsColor} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Sam Munjoma St</h3>
            <TrafficLight activeColor={ewColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
