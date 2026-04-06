"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { WizardShell } from "@/components/wizard/wizard-shell";

function NewProjectInner() {
  const resetWizard = useProjectStore((s) => s.resetWizard);
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    if (searchParams.get("new") === "1") {
      resetWizard();
      router.replace("/projects/new", { scroll: false });
    }
  }, [searchParams, resetWizard, router]);

  return <WizardShell />;
}

export default function NewProjectPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <Suspense fallback={<div className="glass-card h-96 animate-pulse" />}>
        <NewProjectInner />
      </Suspense>
    </div>
  );
}
