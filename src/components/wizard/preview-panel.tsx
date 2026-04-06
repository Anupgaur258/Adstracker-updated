"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ctaIndex?: number;
  topContent?: React.ReactNode;
  hookStyleTarget?: "hook" | "body";
  children?: React.ReactNode;
}

export function PreviewPanel({ activeLayer = "all", hookIndex, ctaIndex, topContent, hookStyleTarget = "hook", children }: PreviewPanelProps) {
  const { wizardState } = useProjectStore();

  const hookStart = wizardState.styling.hookStart;
  const hookEnd = wizardState.styling.hookDuration;
  const bodyStart = wizardState.styling.hookBodyStart;
  const bodyEnd = wizardState.styling.hookBodyDuration;
  const hIdxTimer = hookIndex ?? 0;
  const bodyText = wizardState.hookBodies?.[hIdxTimer]?.trim() || "";

  const hookHasDuration = hookEnd > hookStart && hookEnd > 0;
  const bodyHasDuration = bodyEnd > bodyStart && bodyEnd > 0;

  const [timerHook, setTimerHook] = useState(false);
  const [timerBody, setTimerBody] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // When durations are set, auto-play the sequence in a loop
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!hookHasDuration) {
      setTimerHook(false);
      setTimerBody(false);
      return;
    }

    const totalDuration = Math.max(hookEnd, bodyHasDuration && bodyText ? bodyEnd : hookEnd) + 1;

    const runCycle = () => {
      setTimerHook(false);
      setTimerBody(false);

      timersRef.current.push(setTimeout(() => setTimerHook(true), hookStart * 1000));
      timersRef.current.push(setTimeout(() => setTimerHook(false), hookEnd * 1000));

      if (bodyText && bodyHasDuration) {
        timersRef.current.push(setTimeout(() => setTimerBody(true), bodyStart * 1000));
        timersRef.current.push(setTimeout(() => setTimerBody(false), bodyEnd * 1000));
      }

      timersRef.current.push(setTimeout(runCycle, totalDuration * 1000));
    };

    runCycle();
    return () => { timersRef.current.forEach(clearTimeout); };
  }, [hookStart, hookEnd, bodyStart, bodyEnd, bodyText, hIdxTimer, hookHasDuration, bodyHasDuration]);

  // When durations are set, use timers (sequenced). Otherwise, show based on which tab user selected.
  const showHookText = hookHasDuration ? timerHook : (hookStyleTarget === "hook");
  const showHookBody = hookHasDuration ? (bodyHasDuration && bodyText ? timerBody : false) : (hookStyleTarget === "body" && !!bodyText);

  const filledHooks = wizardState.hooks.map((h, i) => ({ text: h.trim(), i })).filter((x) => x.text);
  const hIdx = hookIndex ?? (filledHooks[0]?.i ?? 0);
  const hookText = wizardState.hooks[hIdx]?.trim() || "Hook Text";
  const hookColor = wizardState.hookColors[hIdx] || "#FFFFFF";
  const hookFont = wizardState.hookFonts[hIdx] || "Inter";
  const hookFontSize = wizardState.hookFontSizes[hIdx] || 28;
  const hookBoxColor = wizardState.hookBoxColors[hIdx] || "transparent";
  const hookOutlineColor = wizardState.hookOutlineColors[hIdx] || "transparent";
  const hookOutlineWidth = wizardState.hookOutlineWidths[hIdx] || 0;
  const hookBold = wizardState.hookBolds?.[hIdx] || false;
  const hookBody = wizardState.hookBodies?.[hIdx]?.trim() || "";
  const hookBodyColor = wizardState.hookBodyColors?.[hIdx] || "#FFFFFF";
  const hookBodyFont = wizardState.hookBodyFonts?.[hIdx] || "Inter";
  const hookBodyFontSize = wizardState.hookBodyFontSizes?.[hIdx] || 22;
  const hookBodyBold = wizardState.hookBodyBolds?.[hIdx] || false;
  const hookBodyBoxColor = wizardState.hookBodyBoxColors?.[hIdx] || "transparent";
  const hookBodyOutlineColor = wizardState.hookBodyOutlineColors?.[hIdx] || "transparent";
  const hookBodyOutlineWidth = wizardState.hookBodyOutlineWidths?.[hIdx] || 0;
  const hookTmpl = hookTemplates.find((t) => t.id === wizardState.hookTemplates[hIdx]) || hookTemplates[0];
  const hookBodyTmpl = hookTemplates.find((t) => t.id === wizardState.hookBodyTemplates?.[hIdx]) || hookTemplates[0];

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

  const hookOpacity = activeLayer === "all" || activeLayer === "hook" ? 1 : 0.4;
  const ctaOpacity = activeLayer === "all" || activeLayer === "cta" ? 1 : 0.4;
  const subOpacity = activeLayer === "all" || activeLayer === "subtitle" ? 1 : 0.4;

  return (
    <div className="rounded-xl border border-border p-4 space-y-4 bg-card/50 w-full mt-[-70px]">
      {topContent}
      <PhonePreview screenColor="black">
        <div className="relative w-full h-full">
          {showHook && showHookText && (
            <div className="absolute left-0 right-0 px-3" style={{ top: `${wizardState.styling.hookYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.hookXPosition, opacity: hookOpacity }}>
              <p className={cn("font-semibold leading-tight inline-block max-w-full break-words", activeLayer === "hook" && `overlay-anim-${hookTmpl.animation}`)} style={{ color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.45, 16)}px`, fontWeight: hookBold ? 800 : 600, textShadow: "1px 1px 4px rgba(0,0,0,0.9)", ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "4px 8px", borderRadius: 4 }), ...(hookOutlineColor !== "transparent" && hookOutlineWidth > 0 && { WebkitTextStroke: `${hookOutlineWidth * 0.5}px ${hookOutlineColor}` }) }}>{hookText}</p>
            </div>
          )}

          {showHookBody && hookBody && (
            <div className="absolute left-0 right-0 px-3" style={{ top: `${wizardState.styling.hookBodyYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.hookBodyXPosition, opacity: hookOpacity }}>
              <p className={cn("leading-tight inline-block max-w-full break-words", activeLayer === "hook" && `overlay-anim-${hookBodyTmpl.animation}`)} style={{ color: hookBodyColor, fontFamily: hookBodyFont, fontSize: `${Math.min(hookBodyFontSize * 0.45, 16)}px`, fontWeight: hookBodyBold ? 800 : 400, textShadow: "1px 1px 3px rgba(0,0,0,0.8)", ...(hookBodyBoxColor !== "transparent" && { backgroundColor: hookBodyBoxColor, padding: "4px 8px", borderRadius: 4 }), ...(hookBodyOutlineColor !== "transparent" && hookBodyOutlineWidth > 0 && { WebkitTextStroke: `${hookBodyOutlineWidth * 0.5}px ${hookBodyOutlineColor}` }) }}>{hookBody}</p>
            </div>
          )}

          {showSub && (
            <div className="absolute left-0 right-0 px-3 transition-opacity" style={{ top: `${wizardState.styling.subtitleYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.subtitleXPosition, opacity: subOpacity }}>
              <p className={cn("leading-tight inline-block", activeLayer === "subtitle" && animClass[previewSubtitle!.animation])} style={{ fontFamily: previewSubtitle!.fontFamily, fontSize: "10px", color: previewSubtitle!.color, backgroundColor: previewSubtitle!.backgroundColor !== "transparent" ? previewSubtitle!.backgroundColor : undefined, padding: previewSubtitle!.backgroundColor !== "transparent" ? "2px 6px" : undefined, borderRadius: 3, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{previewSubtitle!.preview}</p>
            </div>
          )}

          {showCta && (
            <div className="absolute left-0 right-0 px-3 transition-opacity" style={{ top: `${wizardState.styling.ctaYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.ctaXPosition, opacity: ctaOpacity }}>
              <span className={cn("inline-block px-3 py-1 font-semibold", activeLayer === "cta" && `overlay-anim-${ctaTmpl.animation}`)} style={{ ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: `${Math.min(ctaFontSize * 0.55, 13)}px`, fontWeight: ctaBold ? 800 : 600, ...(ctaBoxColor !== "transparent" && { backgroundColor: ctaBoxColor, borderRadius: 4 }), ...(ctaOutlineColor !== "transparent" && ctaOutlineWidth > 0 && { WebkitTextStroke: `${ctaOutlineWidth * 0.5}px ${ctaOutlineColor}` }) }}>{ctaText}</span>
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
