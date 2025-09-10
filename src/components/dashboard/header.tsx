"use client";

import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import { ThemeToggle } from "../theme-toggle";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { User } from "firebase/auth";
import UserMenu from "./user-menu";

interface HeaderProps {
  systemOnline: boolean;
  user: User | null;
  children?: React.ReactNode;
}

export default function Header({ systemOnline, user, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <TrafficPilotIcon className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tighter sm:text-xl">
          Dashboard
        </h1>
      </div>
       <div className="ml-auto flex items-center gap-4">
         <Badge variant={systemOnline ? "default" : "destructive"} className={cn("transition-all", systemOnline ? "animate-pulse" : "opacity-50")}>
            {systemOnline ? "Online" : "Offline"}
         </Badge>
         {children}
         <ThemeToggle />
         <UserMenu user={user} />
      </div>
    </header>
  );
}
