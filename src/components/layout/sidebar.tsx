"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { CreditsPopup } from "./credits-popup";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import {
  LayoutDashboard,
  FolderPlus,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects/new?new=1", icon: FolderPlus, label: "New Project" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { balance } = useCreditsStore();
  const hydrated = useHydration();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className={cn(
        "flex items-center h-16",
        collapsed ? "flex-col justify-center gap-1 py-2 px-1" : "justify-between p-4"
      )}>
        <Logo iconOnly={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-white shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border mt-auto">
        <CreditsPopup>
          <div className="glass-card p-3 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-brand-purple shrink-0" />
              {!collapsed && (
                <span className="text-xs text-muted-foreground">Credits</span>
              )}
            </div>
            {!collapsed && (
              <p className="text-lg font-bold gradient-text mt-1">
                {hydrated ? balance : "..."}
              </p>
            )}
            {collapsed && (
              <p className="text-xs font-bold gradient-text mt-1 text-center">
                {hydrated ? balance : "..."}
              </p>
            )}
          </div>
        </CreditsPopup>
      </div>
    </aside>
  );
}
