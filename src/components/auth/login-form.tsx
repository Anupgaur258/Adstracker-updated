"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const validate = (): boolean => {
    let valid = true;
    if (!email.trim()) { setEmailError("Email is required"); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email"); valid = false; }
    else setEmailError("");

    if (!password) { setPasswordError("Password is required"); valid = false; }
    else if (password.length < 6) { setPasswordError("Password must be at least 6 characters"); valid = false; }
    else setPasswordError("");

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email, password);
    toast.success("Welcome back!");
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 sm:p-8 gradient-border"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
              className={`pl-10 ${emailError ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
            />
          </div>
          {emailError && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }}
              className={`pl-10 pr-10 ${passwordError ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{passwordError}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full gradient-bg text-white border-0 hover:opacity-90 h-11 cursor-pointer">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-purple hover:text-brand-purple/80 font-medium">Sign up</Link>
      </p>
    </motion.div>
  );
}
