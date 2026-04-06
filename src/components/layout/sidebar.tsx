"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import {
  LayoutDashboard,
  FolderPlus,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Crown,
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
  const { user } = useAuthStore();
  const hydrated = useHydration();
  const planName = user?.plan || "free";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 border-b border-border",
        collapsed ? "flex-col justify-center gap-1 py-1 px-1" : "justify-between px-4"
      )}>
        <Logo iconOnly={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-muted-foreground hover:text-white shrink-0", collapsed ? "h-5 w-5" : "h-7 w-7")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const hrefPath = item.href.split("?")[0];
          const isActive = pathname.startsWith(hrefPath);
          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          return <div key={item.href} title={collapsed ? item.label : undefined}>{linkContent}</div>;
        })}
      </nav>

      {/* Plan */}
      <div className={cn("border-t border-border mt-auto", collapsed ? "p-2" : "p-3")}>
        <div className={cn("glass-card", collapsed ? "p-2 flex flex-col items-center" : "p-3")}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}>
            <Crown className="h-4 w-4 text-brand-purple shrink-0" />
            {!collapsed && (
              <span className="text-xs text-muted-foreground">Active Plan</span>
            )}
          </div>
          <p className={cn(
            "font-bold gradient-text capitalize",
            collapsed ? "text-[9px] mt-0.5 text-center" : "text-sm mt-1"
          )}>
            {hydrated ? (collapsed ? planName : `${planName} Plan`) : "..."}
          </p>
        </div>
      </div>
    </aside>
  );
}
