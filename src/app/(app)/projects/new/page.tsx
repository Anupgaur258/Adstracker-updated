"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { WizardShell } from "@/components/wizard/wizard-shell";

export default function NewProjectPage() {
  const resetWizard = useProjectStore((s) => s.resetWizard);

  useEffect(() => {
    resetWizard();
  }, [resetWizard]);

  return (
    <div className="max-w-5xl mx-auto">
      <WizardShell />
    </div>
  );
}
