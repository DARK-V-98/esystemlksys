'use client';
import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/firebase/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("A password reset link has been sent to your email.");
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between gradient-dark p-12 lg:flex">
         <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
            <Cpu className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">ESYSTEMLK</h1>
            <p className="text-sm font-medium text-primary-foreground/70">Multipurpose System</p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-black leading-tight text-primary-foreground">
            Forgot Your
            <br />
            <span className="text-primary neon-text">Password?</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            No problem. Enter your email address and we'll send you a link to reset it.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/50">
          © 2024 ESYSTEMLK. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-black text-foreground">
              Reset Password
            </h2>
            <p className="mt-2 text-muted-foreground">
              Enter your email to receive a reset link.
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-success/10 border border-success/30 p-6 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4"/>
                <h3 className="text-lg font-bold text-success-foreground">Email Sent!</h3>
                <p className="text-sm text-success-foreground/80 mt-2">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                    <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12"
                        disabled={loading}
                    />
                    </div>
                </div>

                {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
                )}

                <Button type="submit" variant="gradient" size="xl" className="w-full font-bold" disabled={loading}>
                 {loading ? <Cpu className="h-6 w-6 animate-spin" /> : 'Send Reset Link'}
                </Button>
            </form>
          )}

          <div className="text-center">
            <Link href="/auth" passHref>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Return to Sign In
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
