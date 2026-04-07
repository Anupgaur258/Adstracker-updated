"use client";

import React from "react";
import { useProjectStore } from "@/stores/project-store";
import { hookTemplates } from "@/data/hook-templates";
import { ctaTemplates } from "@/data/cta-templates";
import { subtitleStyles } from "@/data/subtitle-styles";
import { PhonePreview } from "@/components/common/phone-preview";
import { cn } from "@/lib/utils";

const ctaPreviewStyle: Record<string, (color: string) => React.CSSProperties> = {
  solid: () => ({ background: "#3B82F6", borderRadius: 6, color: "#fff" }),
  outline: (c) => ({ border: `2px solid ${c}`, borderRadius: 6, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #3B82F6, #3B82F6)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff" }),
};

const animClass: Record<string, string> = {
  "word-by-word": "overlay-anim-fade",
  "line-by-line": "overlay-anim-slide-up",
  karaoke: "overlay-anim-fade",
  pop: "overlay-anim-scale",
  fade: "overlay-anim-fade",
  none: "",
};

interface PreviewPanelProps {
  activeLayer?: "hook" | "cta" | "subtitle" | "all";
  hookIndex?: number;
  bodyIndex?: number;
  ctaIndex?: number;
  topContent?: React.ReactNode;
  hookStyleTarget?: "hook" | "body";
  children?: React.ReactNode;
}

export function PreviewPanel({ activeLayer = "all", hookIndex, bodyIndex, ctaIndex, topContent, hookStyleTarget = "hook", children }: PreviewPanelProps) {
  const { wizardState } = useProjectStore();

  // Hook index
  const filledHooks = wizardState.hooks.map((h, i) => ({ text: h.trim(), i })).filter((x) => x.text);
  const hIdx = hookIndex ?? (filledHooks[0]?.i ?? 0);

  // Body index — separate from hook index
  const bIdx = bodyIndex ?? hIdx;
  const bodyText = wizardState.hookBodies?.[bIdx]?.trim() || "";

  // Always show layers if content exists — opacity controls emphasis
  const showHookText = true;
  const showHookBody = !!bodyText;

  // Hook styles
  const hookText = wizardState.hooks[hIdx]?.trim() || "Hook Text";
  const hookColor = wizardState.hookColors[hIdx] || "#FFFFFF";
  const hookFont = wizardState.hookFonts[hIdx] || "Inter";
  const hookFontSize = wizardState.hookFontSizes[hIdx] || 28;
  const hookBoxColor = wizardState.hookBoxColors[hIdx] || "transparent";
  const hookOutlineColor = wizardState.hookOutlineColors[hIdx] || "transparent";
  const hookOutlineWidth = wizardState.hookOutlineWidths[hIdx] || 0;
  const hookBold = wizardState.hookBolds?.[hIdx] || false;
  const hookTmpl = hookTemplates.find((t) => t.id === wizardState.hookTemplates[hIdx]) || hookTemplates[0];

  // Body styles — use bIdx
  const hookBody = wizardState.hookBodies?.[bIdx]?.trim() || "";
  const hookBodyColor = wizardState.hookBodyColors?.[bIdx] || "#FFFFFF";
  const hookBodyFont = wizardState.hookBodyFonts?.[bIdx] || "Inter";
  const hookBodyFontSize = wizardState.hookBodyFontSizes?.[bIdx] || 22;
  const hookBodyBold = wizardState.hookBodyBolds?.[bIdx] || false;
  const hookBodyBoxColor = wizardState.hookBodyBoxColors?.[bIdx] || "transparent";
  const hookBodyOutlineColor = wizardState.hookBodyOutlineColors?.[bIdx] || "transparent";
  const hookBodyOutlineWidth = wizardState.hookBodyOutlineWidths?.[bIdx] || 0;


  const filledCtas = wizardState.ctas.map((c, i) => ({ text: c.trim(), i })).filter((x) => x.text);
  const cIdx = ctaIndex ?? (filledCtas[0]?.i ?? 0);
  const ctaText = wizardState.ctas[cIdx]?.trim() || "CTA";
  const ctaColor = wizardState.ctaColors[cIdx] || "#FFFFFF";
  const ctaFont = wizardState.ctaFonts[cIdx] || "Inter";
  const ctaFontSize = wizardState.ctaFontSizes[cIdx] || 20;
  const ctaBoxColor = wizardState.ctaBoxColors[cIdx] || "transparent";
  const ctaOutlineColor = wizardState.ctaOutlineColors[cIdx] || "transparent";
  const ctaOutlineWidth = wizardState.ctaOutlineWidths[cIdx] || 0;
  const ctaBold = wizardState.ctaBolds?.[cIdx] || false;
  const ctaTmpl = ctaTemplates.find((t) => t.id === wizardState.ctaTemplates[cIdx]) || ctaTemplates[0];
  const ctaStyleFn = ctaPreviewStyle[ctaTmpl.style] || ctaPreviewStyle.solid;

  const previewSubtitle = subtitleStyles.find((s) => wizardState.selectedSubtitleStyles.includes(s.id));

  const showHook = filledHooks.length > 0;
  const showCta = filledCtas.length > 0;
  const showSub = !!previewSubtitle;

  const hookTextOpacity = activeLayer === "all" ? 1 : (activeLayer === "hook" && hookStyleTarget === "hook") ? 1 : 0.4;
  const bodyTextOpacity = activeLayer === "all" ? 1 : (activeLayer === "hook" && hookStyleTarget === "body") ? 1 : 0.4;
  const ctaOpacity = activeLayer === "all" || activeLayer === "cta" ? 1 : 0.4;
  const subOpacity = activeLayer === "all" || activeLayer === "subtitle" ? 1 : 0.4;

  return (
    <div className="rounded-xl border border-border p-3 sm:p-4 space-y-3 sm:space-y-4 bg-card/50 w-full md:mt-[-40px] lg:mt-[-70px]">
      {topContent}
      <PhonePreview screenColor="black">
        <div className="relative w-full h-full">
          {showHook && showHookText && (
            <div className="absolute left-0 right-0 px-3" style={{ top: `${wizardState.hookYPositions?.[hIdx] ?? 8}%`, transform: "translateY(-50%)", textAlign: (wizardState.hookXPositions?.[hIdx] || "center") as React.CSSProperties["textAlign"], opacity: hookTextOpacity }}>
              <p className={cn("font-semibold leading-tight max-w-full break-words", activeLayer === "hook" && `overlay-anim-${hookTmpl.animation}`)} style={{ color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.45, 16)}px`, fontWeight: hookBold ? 800 : 600, textShadow: "1px 1px 4px rgba(0,0,0,0.9)", ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "4px 8px", borderRadius: 4 }), ...(hookOutlineColor !== "transparent" && hookOutlineWidth > 0 && { WebkitTextStroke: `${hookOutlineWidth * 0.5}px ${hookOutlineColor}` }) }}>{hookText}</p>
            </div>
          )}

          {showHookBody && hookBody && (
            <div className="absolute left-0 right-0 px-3" style={{ top: `${wizardState.hookBodyYPositions?.[bIdx] ?? 30}%`, transform: "translateY(-50%)", textAlign: (wizardState.hookBodyXPositions?.[bIdx] || "center") as React.CSSProperties["textAlign"], opacity: bodyTextOpacity }}>
              <p className="leading-tight max-w-full break-words" style={{ color: hookBodyColor, fontFamily: hookBodyFont, fontSize: `${Math.min(hookBodyFontSize * 0.45, 16)}px`, fontWeight: hookBodyBold ? 800 : 400, textShadow: "1px 1px 3px rgba(0,0,0,0.8)", ...(hookBodyBoxColor !== "transparent" && { backgroundColor: hookBodyBoxColor, padding: "4px 8px", borderRadius: 4 }), ...(hookBodyOutlineColor !== "transparent" && hookBodyOutlineWidth > 0 && { WebkitTextStroke: `${hookBodyOutlineWidth * 0.5}px ${hookBodyOutlineColor}` }) }}>{hookBody}</p>
            </div>
          )}

          {showSub && (
            <div className="absolute left-0 right-0 px-3 transition-opacity" style={{ top: `${wizardState.styling.subtitleYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.subtitleXPosition, opacity: subOpacity }}>
              <p className={cn("leading-tight", activeLayer === "subtitle" && animClass[previewSubtitle!.animation])} style={{ fontFamily: previewSubtitle!.fontFamily, fontSize: "10px", color: previewSubtitle!.color, backgroundColor: previewSubtitle!.backgroundColor !== "transparent" ? previewSubtitle!.backgroundColor : undefined, padding: previewSubtitle!.backgroundColor !== "transparent" ? "2px 6px" : undefined, borderRadius: 3, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{previewSubtitle!.preview}</p>
            </div>
          )}

          {showCta && (
            <div className="absolute left-0 right-0 px-3 transition-opacity" style={{ top: `${wizardState.ctaYPositions?.[cIdx] ?? 88}%`, transform: "translateY(-50%)", textAlign: (wizardState.ctaXPositions?.[cIdx] || "center") as React.CSSProperties["textAlign"], opacity: ctaOpacity }}>
              <span className={cn("px-3 py-1 font-semibold", activeLayer === "cta" && `overlay-anim-${ctaTmpl.animation}`)} style={{ ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: `${Math.min(ctaFontSize * 0.55, 13)}px`, fontWeight: ctaBold ? 800 : 600, ...(ctaBoxColor !== "transparent" && { background: ctaBoxColor, borderRadius: 4 }), ...(ctaOutlineColor !== "transparent" && ctaOutlineWidth > 0 && { WebkitTextStroke: `${ctaOutlineWidth * 0.5}px ${ctaOutlineColor}` }) }}>{ctaText}</span>
            </div>
          )}

          {!showHook && !showCta && !showSub && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-white/30 text-center px-4">Applied styles will appear here</p>
            </div>
          )}
        </div>
      </PhonePreview>
      {children}
    </div>
  );
}
