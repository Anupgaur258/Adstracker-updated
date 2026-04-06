"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { CreditsPopup } from "./credits-popup";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, FolderPlus, CreditCard, Coins } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects/new?new=1", icon: FolderPlus, label: "New Project" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { balance } = useCreditsStore();
  const hydrated = useHydration();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] bg-sidebar border-border p-0 flex flex-col">
          <div className="p-4 h-16 flex items-center border-b border-border">
            <Logo />
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border mt-auto">
            <CreditsPopup>
              <div className="glass-card p-3 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-brand-purple shrink-0" />
                  <span className="text-xs text-muted-foreground">Credits</span>
                </div>
                <p className="text-lg font-bold gradient-text mt-1">
                  {hydrated ? balance : "..."}
                </p>
              </div>
            </CreditsPopup>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
