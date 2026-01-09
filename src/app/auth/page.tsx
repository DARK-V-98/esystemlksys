'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Eye, EyeOff, Mail, Lock, User, Zap, Shield, Layers } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/firebase/config";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already logged in, redirect to dashboard
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router, auth]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("isAuthenticated", "true");
        const user = userCredential.user;
        localStorage.setItem("userName", user?.displayName || user?.email?.split("@")[0] || "User");
        router.push("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        // Save user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        });

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", name);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between gradient-dark p-12 lg:flex overflow-hidden relative">
        <div className="absolute top-8 right-8">
            <ThemeSwitcher />
        </div>
        <div>
            <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow p-2">
                <Image src="/logo.png" alt="ESYSTEMLK Logo" width={48} height={48} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-primary-foreground">ESYSTEMLK</h1>
                <p className="text-sm font-medium text-primary-foreground/70">Multipurpose System</p>
            </div>
            </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-5xl font-black leading-tight text-primary-foreground">
            Your Ultimate
            <br />
            <span className="text-primary neon-text">PC Powerhouse</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            100+ powerful tools for file management, system optimization,
            web utilities, and complete PC control. All in one platform.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "Fast Tools", desc: "100+ utilities" },
              { icon: Shield, label: "Secure", desc: "Safe & private" },
              { icon: Layers, label: "Complete", desc: "All-in-one" },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="rounded-xl border border-primary/30 bg-primary/10 p-4 backdrop-blur"
              >
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <p className="font-bold text-primary-foreground">{feature.label}</p>
                <p className="text-xs text-primary-foreground/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/50">
          © 2024 ESYSTEMLK. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2 relative">
        <div className="absolute top-8 right-8 lg:hidden">
            <ThemeSwitcher />
        </div>
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow p-2">
              <Image src="/logo.png" alt="ESYSTEMLK Logo" width={48} height={48} />
            </div>
            <h1 className="text-2xl font-black text-gradient">ESYSTEMLK</h1>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-black text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Sign in to access your system"
                : "Create your free account to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

             {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 h-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="text-right">
                <Link href="/forgot-password" passHref>
                  <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </Link>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <div>
                <Button type="submit" variant="gradient" size="xl" className="w-full font-bold" disabled={loading}>
                {loading ? (
                    <Cpu className="h-6 w-6 animate-spin" />
                ) : (isLogin ? "Sign In" : "Create Account")
                }
                </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-2 font-bold text-primary hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
