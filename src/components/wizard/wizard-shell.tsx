"use client";

import { useProjectStore } from "@/stores/project-store";
import { useHydration } from "@/hooks/use-hydration";
import { StepIndicator } from "./step-indicator";
import { StepVideos } from "./step-videos";
import { StepHooks } from "./step-hooks";
import { StepCtas } from "./step-ctas";
import { StepSubtitles } from "./step-subtitles";
import { StepReview } from "./step-review";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { LIMITS } from "@/lib/constants";

const TOTAL_STEPS = 5;

export function WizardShell() {
  const { wizardState, setWizardStep } = useProjectStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const { currentStep } = wizardState;

  const getValidationErrors = (): string[] => {
    const errors: string[] = [];
    switch (currentStep) {
      case 0: {
        const name = wizardState.projectName?.trim() || "";
        if (!name) errors.push("Please enter a project name");
        else if (name.length < 2) errors.push("Project name must be at least 2 characters");
        if (wizardState.videos.length === 0) errors.push("Please upload at least 1 video");
        break;
      }
      case 1: {
        const filled = wizardState.hooks.filter((h) => h.trim().length > 0).length;
        if (filled < 1) errors.push("Please write at least 1 hook (min 1, max 5)");
        const hasTemplate = wizardState.hookTemplates.some((t) => t);
        if (!hasTemplate) errors.push("Please select a template for your hooks");
        const { hookStart, hookDuration, hookBodyStart, hookBodyDuration } = wizardState.styling;
        if (!hookDuration || hookDuration <= hookStart) errors.push("Please set hook start and end duration");
        const hasBody = wizardState.hookBodies?.some((b) => b.trim().length > 0);
        if (hasBody) {
          if (!hookBodyDuration || hookBodyDuration <= hookBodyStart) errors.push("Please set hook body start and end duration");
          if (hookBodyStart < hookDuration) errors.push("Hook body start must be after hook end duration");
        }
        break;
      }
      case 2: {
        const filled = wizardState.ctas.filter((c) => c.trim().length > 0).length;
        if (filled < 1) errors.push("Please write at least 1 CTA (min 1, max 3)");
        const hasTemplate = wizardState.ctaTemplates.some((t) => t);
        if (!hasTemplate) errors.push("Please select a template for your CTAs");
        break;
      }
      case 3: {
        if (wizardState.selectedSubtitleStyles.length === 0)
          errors.push("Please select at least 1 subtitle style");
        break;
      }
    }
    return errors;
  };

  const canGoNext = () => getValidationErrors().length === 0;

  const handleNext = () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      toast.error(errors[0]);
      window.dispatchEvent(new CustomEvent("wizard-validate"));
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setWizardStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setWizardStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepVideos />;
      case 1: return <StepHooks />;
      case 2: return <StepCtas />;
      case 3: return <StepSubtitles />;
      case 4: return <StepReview />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)]  w-full">
      {/* Scrollable step content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 sm:space-y-6 pb-4 w-full">
        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — always visible, no scroll needed */}
      <div className="shrink-0 z-30 bg-background/95 backdrop-blur-md border-t border-border py-3 sm:py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleNext}
              className="gradient-bg text-white border-0 hover:opacity-90 gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="w-16 sm:w-20" />
          )}
        </div>
      </div>
    </div>
  );
}
