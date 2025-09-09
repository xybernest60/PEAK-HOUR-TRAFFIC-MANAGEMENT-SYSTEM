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
  onSave: (config: { phoneNumber: string; isEnabled: boolean }) => void;
}

export default function SmsAlertsCard({
  phoneNumber,
  isEnabled,
  onSave,
}: SmsAlertsCardProps) {
  const [localPhoneNumber, setLocalPhoneNumber] = React.useState(phoneNumber);
  const [localIsEnabled, setLocalIsEnabled] = React.useState(isEnabled);

  React.useEffect(() => {
    setLocalPhoneNumber(phoneNumber);
    setLocalIsEnabled(isEnabled);
  }, [phoneNumber, isEnabled]);


  const handleSave = () => {
    onSave({ phoneNumber: localPhoneNumber, isEnabled: localIsEnabled });
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
            placeholder="+1 (555) 123-4567"
            type="tel"
            value={localPhoneNumber}
            onChange={(e) => setLocalPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="sms-enabled"
            checked={localIsEnabled}
            onCheckedChange={setLocalIsEnabled}
          />
          <Label htmlFor="sms-enabled">Enable SMS Alerts</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
