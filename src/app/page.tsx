"use client";

import * as React from "react";
import { Car, TrafficCone, Waypoints } from "lucide-react";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const FloatingIcon = ({ icon: Icon, className }: { icon: React.ElementType, className?: string }) => {
    const [animationClass, setAnimationClass] = React.useState("");

    React.useEffect(() => {
        // This useEffect hook will only run on the client-side after hydration is complete.
        // This prevents a mismatch between the server-rendered and client-rendered HTML.
        const animations = [
            "animate-[float_10s_ease-in-out_infinite]",
            "animate-[float_12s_ease-in-out_infinite_1s]",
            "animate-[float_15s_ease-in-out_infinite_2s]",
            "animate-[float_8s_ease-in-out_infinite_0.5s]",
        ];
        setAnimationClass(animations[Math.floor(Math.random() * 4)]);
    }, []);

    if (!animationClass) {
        // Return a static version of the component on the server and during the initial client render.
        return (
            <div className={`absolute ${className}`}>
                <Icon className={`relative text-primary/50`} />
            </div>
        );
    }
    
    return (
        <div className={`absolute ${className}`}>
            <Icon className={`relative text-primary/50 ${animationClass}`} />
        </div>
    );
};


export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            <div className="absolute inset-0 z-0">
                <FloatingIcon icon={Car} className="top-[10%] left-[15%] text-4xl" />
                <FloatingIcon icon={TrafficPilotIcon} className="top-[20%] right-[20%] text-5xl" />
                <FloatingIcon icon={Waypoints} className="bottom-[15%] left-[25%] text-6xl" />
                <FloatingIcon icon={TrafficCone} className="bottom-[20%] right-[15%] text-4xl" />
                <FloatingIcon icon={Car} className="top-[60%] left-[30%] text-5xl" />
                <FloatingIcon icon={TrafficPilotIcon} className="top-[70%] right-[40%] text-3xl" />
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
            `}</style>
            
            <div className="z-10 flex flex-col items-center text-center backdrop-blur-sm p-8 rounded-lg">
                 <TrafficPilotIcon className="h-24 w-24 text-primary mb-4" />
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                    PEAK HOUR TRAFFIC MANAGEMENT SYSTEM
                </h1>
                <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                   Real-time monitoring and control of urban traffic flow.
                </p>
                <Button asChild className="mt-8" size="lg">
                    <Link href="/dashboard">Continue to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
