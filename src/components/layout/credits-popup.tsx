"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Coins, CreditCard, Check, Zap } from "lucide-react";

const usageHistory = [
  { project: "Summer Sale Campaign", credits: 60, date: "Mar 15, 2026", type: "spent" as const },
  { project: "Fitness App Launch", credits: 45, date: "Mar 28, 2026", type: "spent" as const },
  { project: "Welcome Credits", credits: 500, date: "Mar 1, 2026", type: "received" as const },
];

export function CreditsPopup({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { balance, used, limit } = useCreditsStore();
  const hydrated = useHydration();

  const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10 sm:max-w-[440px] max-w-[calc(100vw-2rem)] p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-0">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-brand-purple" />
              Credits Overview
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Active Plan */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-brand-purple/5 border border-brand-purple/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white capitalize">{hydrated ? user?.plan || "Free" : "..."} Plan</p>
                <p className="text-xs text-muted-foreground">Yearly billing</p>
              </div>
            </div>
            <Badge className="gradient-bg text-white border-0 text-xs">Active</Badge>
          </div>

          {/* Credits remaining */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits Used</span>
              <span className="text-sm font-mono text-white">{hydrated ? used : "..."} / {limit}</span>
            </div>
            <Progress value={hydrated ? usagePercent : 0} className="h-2.5 bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Remaining</span>
              <span className="text-sm font-bold gradient-text">{hydrated ? balance : "..."} credits</span>
            </div>
            <p className="text-xs text-muted-foreground">Resets on the 1st of each month</p>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Payment Method */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment Method</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/[0.06]">
              <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-mono">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
                <p className="text-xs text-muted-foreground">Visa &middot; Expires 12/27</p>
              </div>
              <Check className="h-4 w-4 text-brand-teal" />
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Usage History */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent History</p>
            <div className="space-y-0">
              {usageHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm text-white">{item.project}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={`text-sm font-mono ${item.type === "received" ? "text-brand-teal" : "text-muted-foreground"}`}>
                    {item.type === "spent" ? `-${item.credits}` : `+${item.credits}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
