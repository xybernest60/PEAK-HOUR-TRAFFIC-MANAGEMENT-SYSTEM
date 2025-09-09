"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as React from "react";

interface SmsAlertsCardProps {
  phoneNumber: string;
  isEnabled: boolean;
  onNumberSave: (phoneNumber: string) => void;
  onEnabledChange: (isEnabled: boolean) => void;
}

export default function SmsAlertsCard({
  phoneNumber,
  isEnabled,
  onNumberSave,
  onEnabledChange,
}: SmsAlertsCardProps) {
  const [localPhoneNumber, setLocalPhoneNumber] = React.useState(phoneNumber || "");

  React.useEffect(() => {
    setLocalPhoneNumber(phoneNumber || "");
  }, [phoneNumber]);


  const handleSave = () => {
    onNumberSave(localPhoneNumber);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GSM Alerts</CardTitle>
        <CardDescription>
          Receive SMS alerts for system errors and critical traffic updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input
            id="phone-number"
            placeholder="+263 7..."
            type="tel"
            value={localPhoneNumber}
            onChange={(e) => setLocalPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="sms-enabled"
            checked={isEnabled}
            onCheckedChange={onEnabledChange}
          />
          <Label htmlFor="sms-enabled">Enable SMS Alerts</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          Save Phone Number
        </Button>
      </CardFooter>
    </Card>
  );
}
