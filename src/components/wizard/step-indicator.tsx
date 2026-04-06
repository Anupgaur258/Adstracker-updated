"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { label: "Videos", short: "1" },
  { label: "Hooks", short: "2" },
  { label: "CTAs", short: "3" },
  { label: "Subtitles", short: "4" },
  { label: "Review", short: "5" },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full overflow-x-auto pb-2 pt-3 mt-1 scrollbar-hide">
      <div className="flex items-center justify-between min-w-[320px] sm:min-w-[450px] px-2 sm:px-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300",
                    isCompleted && "gradient-bg text-white",
                    isCurrent && "ring-2 ring-brand-purple bg-brand-purple/20 text-brand-purple",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm whitespace-nowrap",
                    isCurrent ? "text-white font-medium" : "text-muted-foreground"
                  )}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.label}</span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-1.5 sm:mx-3 mt-[-16px]">
                  <div className="h-full bg-border relative">
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 gradient-bg"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
