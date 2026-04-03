"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Coins, CreditCard, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

const yearlyPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 10,
    features: ["10 credits/month", "720p export", "3 subtitle styles", "Watermarked"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 290,
    credits: 500,
    popular: true,
    features: ["500 credits/month", "1080p export", "All templates", "No watermark", "Priority rendering"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 990,
    credits: "Unlimited",
    features: ["Unlimited credits", "4K export", "All templates", "API access", "Dedicated support", "Team collab"],
  },
];

export default function BillingPage() {
  const { user } = useAuthStore();
  const { balance, used, limit } = useCreditsStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and credits.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card p-6 gradient-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Current Plan</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="gradient-bg text-white border-0 capitalize">
                {user?.plan ?? "free"}
              </Badge>
              <span className="text-xs text-muted-foreground">Yearly billing</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/[0.06] my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Credits Used
            </span>
            <span className="text-sm text-white font-mono">{used} / {limit}</span>
          </div>
          <Progress value={usagePercent} className="h-2 bg-white/5" />
          <p className="text-xs text-muted-foreground">
            {balance} credits remaining this month. Resets on the 1st.
          </p>
        </div>
      </div>

      {/* Yearly Plans */}
      <div>
        <h2 className="font-semibold text-white mb-4">Yearly Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {yearlyPlans.map((plan) => {
            const isCurrent = user?.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`glass-card p-5 relative ${plan.popular ? "ring-2 ring-brand-purple" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 gradient-bg text-white border-0 text-[10px]">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-2xl font-bold text-white">${plan.price}</span>
                  <span className="text-xs text-muted-foreground">/year</span>
                </div>
                <p className="text-xs text-brand-purple font-medium mb-3">
                  {typeof plan.credits === "number" ? `${plan.credits} credits/mo` : "Unlimited credits"}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-brand-teal shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "outline" : "default"}
                  size="sm"
                  disabled={isCurrent}
                  className={isCurrent ? "w-full bg-white/5 border-white/10" : "w-full gradient-bg text-white border-0 hover:opacity-90"}
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-4">Payment Method</h2>
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-white">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/27</p>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-4">Recent Usage</h2>
        <div className="space-y-3">
          {[
            { project: "Summer Sale Campaign", credits: 60, date: "Mar 15" },
            { project: "Fitness App Launch", credits: 45, date: "Mar 28" },
            { project: "Welcome Credits", credits: -500, date: "Mar 1" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">{item.project}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className={`text-sm font-mono ${item.credits < 0 ? "text-brand-teal" : "text-muted-foreground"}`}>
                {item.credits > 0 ? `-${item.credits}` : `+${Math.abs(item.credits)}`} credits
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
