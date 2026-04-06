"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import { Menu, X } from "lucide-react";

export function MarketingNavbar() {
  const { isLoggedIn } = useAuthStore();
  const hydrated = useHydration();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0F1221]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-6">
        <Logo dark />

        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm transition-colors" style={{ color: "#ffffff" }}>
            Pricing
          </Link>
          <Link href="#features" className="text-sm transition-colors" style={{ color: "#ffffff" }}>
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm transition-colors" style={{ color: "#ffffff" }}>
            How It Works
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {hydrated && isLoggedIn ? (
            <Button render={<Link href="/dashboard" />} className="gradient-bg text-white border-0 hover:opacity-90">
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} className="text-muted-foreground hover:text-white">
                Log in
              </Button>
              <Button render={<Link href="/signup" />} className="gradient-bg text-white border-0 hover:opacity-90">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0F1221]/95 backdrop-blur-md px-4 pb-4 pt-3 space-y-3">
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-white py-2">
            Pricing
          </Link>
          <Link href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-white py-2">
            Features
          </Link>
          <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm text-white py-2">
            How It Works
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            {hydrated && isLoggedIn ? (
              <Button render={<Link href="/dashboard" />} className="w-full gradient-bg text-white border-0 hover:opacity-90">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" render={<Link href="/login" />} className="w-full text-muted-foreground hover:text-white">
                  Log in
                </Button>
                <Button render={<Link href="/signup" />} className="w-full gradient-bg text-white border-0 hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
