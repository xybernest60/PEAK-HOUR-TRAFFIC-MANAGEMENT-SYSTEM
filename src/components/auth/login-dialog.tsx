"use client";

import * as React from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TrafficPilotIcon } from "@/components/icons/traffic-pilot-icon";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";

export default function LoginDialog() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  React.useEffect(() => {
    if (user || googleUser) {
      toast({
        title: `Welcome back, Nigel!`,
        description: "You have been successfully signed in.",
        action: <ToastAction altText="Go to Dashboard" onClick={() => router.push('/dashboard')}>Go to Dashboard</ToastAction>
      });
      setIsOpen(false);
      // router.push("/dashboard"); // We now use the toast action
    }
  }, [user, googleUser, router, toast]);

  React.useEffect(() => {
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
  }, [error, googleError, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-8" size="lg">
          Go to Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <TrafficPilotIcon className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access the dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
