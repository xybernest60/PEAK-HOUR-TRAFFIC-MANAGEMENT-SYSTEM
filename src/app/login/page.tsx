"use client";

import * as React from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await signInWithEmailAndPassword(email, password);
      if (!success) {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: error?.message || "Please check your credentials.",
        });
      }
    } catch (err) {
       console.error(err);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
        await signInWithGoogle();
    } catch (err) {
        console.error(err);
        toast({
            variant: "destructive",
            title: "Google Sign-In Failed",
            description: googleError?.message || "Could not sign in with Google.",
        });
    }
  }

  React.useEffect(() => {
    if (user || googleUser) {
      router.push("/dashboard");
    }
    if (error) {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
     if (googleError) {
       toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: googleError.message,
      });
    }
  }, [user, googleUser, error, googleError, router, toast]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <TrafficPilotIcon className="h-12 w-12 text-primary" />
            </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
           <div className="my-4 flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
                 {googleLoading ? "Redirecting..." : "Sign In with Google"}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
