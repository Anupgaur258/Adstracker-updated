"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", { closeButton: true });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email, "auto-generated");
    toast.success("Welcome back!", { closeButton: true });
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
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email to sign in
        </p>
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              className={`pl-10 ${emailError ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
            />
          </div>
          {emailError && (
            <p className="text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {emailError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gradient-bg text-white border-0 hover:opacity-90 h-11"
        >
          {loading ? "Signing in..." : "Sign In with Email"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-purple hover:text-brand-purple/80 font-medium">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
