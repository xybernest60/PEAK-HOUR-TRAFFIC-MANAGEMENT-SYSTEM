"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface StatusCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    valueClass?: string;
    hasGlow?: boolean;
}

export default function StatusCard({ icon: Icon, title, value, valueClass, hasGlow }: StatusCardProps) {
    return (
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                 <div className={cn("relative", hasGlow && "after:absolute after:inset-0 after:animate-pulse after:rounded-full after:blur-sm", valueClass)}>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                 </div>
            </CardHeader>
            <CardContent>
                <Badge 
                    variant="outline" 
                    className={cn(
                        "text-lg font-bold border-border/50",
                         valueClass,
                         hasGlow && "shadow-[0_0_15px_3px_var(--glow-color)]"
                    )}
                    style={{'--glow-color': 'hsl(var(--primary))'} as React.CSSProperties}
                >
                    {value}
                </Badge>
            </CardContent>
        </Card>
    );
}
