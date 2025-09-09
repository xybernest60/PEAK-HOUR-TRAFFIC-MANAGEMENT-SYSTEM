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
import { useToast } from "@/hooks/use-toast";

export default function SmsAlertsCard() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isEnabled, setIsEnabled] = React.useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to a backend.
    console.log("Saving SMS alerts config:", { phoneNumber, isEnabled });
    toast({
      title: "SMS Alerts Updated",
      description: `Notifications will be sent to ${phoneNumber}.`,
    });
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
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="sms-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
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
