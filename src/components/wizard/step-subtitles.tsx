"use client";

import { useProjectStore } from "@/stores/project-store";
import { subtitleStyles } from "@/data/subtitle-styles";
import { LIMITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PreviewPanel } from "./preview-panel";

const animClass: Record<string, string> = {
  "word-by-word": "overlay-anim-fade",
  "line-by-line": "overlay-anim-slide-up",
  karaoke: "overlay-anim-fade",
  pop: "overlay-anim-scale",
  fade: "overlay-anim-fade",
  none: "",
};

export function StepSubtitles() {
  const { wizardState, updateWizardState } = useProjectStore();
  const selected = wizardState.selectedSubtitleStyles;

  const toggleStyle = (styleId: string) => {
    const isSelected = selected.includes(styleId);
    if (isSelected) {
      updateWizardState({ selectedSubtitleStyles: selected.filter((id) => id !== styleId) });
    } else {
      if (selected.length >= LIMITS.maxSubtitleStyles) {
        toast.error(`Maximum ${LIMITS.maxSubtitleStyles} subtitle styles allowed`);
        return;
      }
      updateWizardState({ selectedSubtitleStyles: [...selected, styleId] });
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">Choose Subtitle Styles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select at least 1 style (up to {LIMITS.maxSubtitleStyles}).{" "}
          <span className="text-brand-purple font-medium">{selected.length}/{LIMITS.maxSubtitleStyles}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-5 w-full">
        {/* LEFT — Subtitle cards */}
        <div className="w-full lg:w-[38%] lg:flex-none min-w-0 px-1">
          <Label className="text-sm font-bold text-white mb-3 block">Choose Style <span className="text-red-400">*</span></Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subtitleStyles.map((style, index) => {
              const isSelected = selected.includes(style.id);
              return (
                <motion.button key={style.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  onClick={() => toggleStyle(style.id)}
                  className={cn("glass-card-hover text-left relative overflow-hidden cursor-pointer", isSelected && "ring-2 ring-brand-purple")}>
                  <div className="h-28 sm:h-32 bg-black flex flex-col items-center justify-center px-4 rounded-t-[12px] relative overflow-hidden">
                    <p className={cn("text-center font-semibold relative z-10 leading-tight", animClass[style.animation], style.id === "hormozi" && "tracking-wide uppercase", style.id === "mrbeast" && "tracking-wider uppercase")}
                      style={{ fontFamily: style.fontFamily, fontSize: `${Math.max(14, Math.min(style.fontSize, 20))}px`, color: style.color, backgroundColor: style.backgroundColor !== "transparent" ? style.backgroundColor : undefined, padding: style.backgroundColor !== "transparent" ? "4px 10px" : undefined, borderRadius: style.backgroundColor !== "transparent" ? "4px" : undefined, textShadow: style.backgroundColor === "transparent" ? "1px 1px 4px rgba(0,0,0,0.8)" : undefined }}>
                      {style.id === "hormozi" && (<><span style={{ color: "#FFD700" }}>STOP </span><span>making excuses</span></>)}
                      {style.id === "tiktok-viral" && (<><span style={{ color: "#22D3EE" }}>This </span><span>changed my life</span></>)}
                      {style.id !== "hormozi" && style.id !== "tiktok-viral" && style.preview}
                    </p>
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm">{style.name}</h3>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">{style.font || style.fontFamily}</Badge>
                    </div>
                    {style.animationLabel && <Badge variant="outline" className="bg-brand-purple/10 border-brand-purple/20 text-brand-purple text-xs px-1.5 py-0">{style.animationLabel}</Badge>}
                  </div>
                  {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full gradient-bg flex items-center justify-center"><Check className="h-3.5 w-3.5 text-white" /></motion.div>)}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div className="hidden lg:flex items-stretch shrink-0 mx-0">
          <div className="w-px bg-border" />
        </div>
        <div className="lg:hidden my-4 h-px bg-border" />

        {/* RIGHT — Preview */}
        <div className="w-full lg:flex-1 min-w-0 mt-4 lg:mt-0 space-y-4 lg:sticky lg:top-0 h-fit">
          <PreviewPanel activeLayer="subtitle">
            {selected.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Selected Styles</h4>
                {selected.map((id) => {
                  const style = subtitleStyles.find((s) => s.id === id);
                  if (!style) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                      <span className="text-xs text-white font-medium">{style.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{style.font || style.fontFamily}</Badge>
                        <button onClick={() => toggleStyle(id)} className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
