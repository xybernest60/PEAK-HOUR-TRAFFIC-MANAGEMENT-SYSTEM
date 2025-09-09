"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as React from "react";

interface SmsAlertsCardProps {
  isEnabled: boolean;
  onEnabledChange: (isEnabled: boolean) => void;
}

export default function SmsAlertsCard({
  isEnabled,
  onEnabledChange,
}: SmsAlertsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GSM Alerts</CardTitle>
        <CardDescription>
          Enable or disable SMS alerts for system events.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between rounded-lg bg-background p-4">
        <Label htmlFor="sms-enabled" className="font-medium">Enable SMS Alerts</Label>
        <Switch
          id="sms-enabled"
          checked={isEnabled}
          onCheckedChange={onEnabledChange}
        />
      </CardContent>
    </Card>
  );
}
