"use client";

import { cn } from "@/lib/utils";

interface PhonePreviewProps {
  children: React.ReactNode;
  className?: string;
  screenColor?: "black" | "blue";
}

export function PhonePreview({ children, className, screenColor = "black" }: PhonePreviewProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Phone frame */}
      <div className="relative w-full max-w-[220px] xs:max-w-[240px] sm:max-w-[260px] md:max-w-[240px] lg:max-w-[280px] mx-auto">
        {/* Outer frame */}
        <div className="rounded-[2rem] border-[3px] border-zinc-700 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center">
            <div className="w-10 h-2.5 bg-zinc-800 rounded-full" />
          </div>

          {/* Screen */}
          <div
            className={cn(
              "relative rounded-[1.5rem] overflow-hidden",
              screenColor === "black"
                ? "bg-gradient-to-b from-zinc-950 to-black"
                : "bg-gradient-to-b from-[#0a1628] to-[#0d2847]"
            )}
            style={{ aspectRatio: "9/16" }}
          >
            {children}
          </div>

          {/* Bottom bar */}
          <div className="flex justify-center py-1.5">
            <div className="w-24 h-1 bg-zinc-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
