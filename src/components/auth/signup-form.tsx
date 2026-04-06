"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};
    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signup(name.trim(), email.trim(), "auto-generated");
    toast.success("Account created successfully!");
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
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start creating video ads in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              className={`pl-10 bg-white/5 border-white/10 focus:border-brand-purple ${errors.name ? "border-red-500/50" : ""}`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </p>
          )}
        </div>

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
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              className={`pl-10 bg-white/5 border-white/10 focus:border-brand-purple ${errors.email ? "border-red-500/50" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gradient-bg text-white border-0 hover:opacity-90"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-purple hover:text-brand-purple/80 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
