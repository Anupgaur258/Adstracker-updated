"use client";

import { useProjectStore } from "@/stores/project-store";
import { useCreditsStore } from "@/stores/credits-store";
import { ctaTemplates } from "@/data/cta-templates";
import { subtitleStyles } from "@/data/subtitle-styles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Video, Type, AlignLeft, MousePointerClick, Subtitles, Sparkles, Coins, Play, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { PhonePreview } from "@/components/common/phone-preview";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const ctaPreviewStyle: Record<string, (c: string) => React.CSSProperties> = {
  solid: () => ({ background: "#3B82F6", borderRadius: 6, color: "#fff" }),
  outline: (c) => ({ border: `2px solid ${c}`, borderRadius: 6, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff" }),
};

interface Combo {
  videoName: string;
  videoUrl: string;
  hook: string;
  hookIdx: number;
  hookBody: string;
  bodyIdx: number;
  cta: string;
  ctaIdx: number;
  styleId: string;
  styleName: string;
  thumbUrl: string;
}

export function StepReview() {
  const { wizardState, createProject, updateProject } = useProjectStore();
  const { balance, deduct } = useCreditsStore();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const projectName = wizardState.projectName || "";
  const filledHooks = wizardState.hooks.map((h, i) => ({ text: h.trim(), i })).filter((x) => x.text);
  const filledHookBodies = wizardState.hookBodies.map((h, i) => ({ text: h.trim(), i })).filter((x) => x.text);
  const filledCtas = wizardState.ctas.map((c, i) => ({ text: c.trim(), i })).filter((x) => x.text);
  const videoCount = wizardState.videos.length;
  const hookCount = filledHooks.length;
  const hookBodyCount = filledHookBodies.length;
  const ctaCount = filledCtas.length;
  const subtitleCount = wizardState.selectedSubtitleStyles.length;
  const bodyCountForCalc = Math.max(hookBodyCount, 1);
  const totalVideos = videoCount * hookCount * bodyCountForCalc * ctaCount * subtitleCount;
  const creditCost = totalVideos;
  const selectedStyles = subtitleStyles.filter((s) => wizardState.selectedSubtitleStyles.includes(s.id));

  // Build combinations
  const combinations: Combo[] = [];
  const bodiesForCombo = filledHookBodies.length > 0 ? filledHookBodies : [{ text: "", i: 0 }];
  for (const video of wizardState.videos) {
    for (const h of filledHooks) {
      for (const b of bodiesForCombo) {
        for (const c of filledCtas) {
          for (const styleId of wizardState.selectedSubtitleStyles) {
            const style = subtitleStyles.find((s) => s.id === styleId);
            combinations.push({ videoName: video.name, videoUrl: video.objectUrl, hook: h.text, hookIdx: h.i, hookBody: b.text, bodyIdx: b.i, cta: c.text, ctaIdx: c.i, styleId, styleName: style?.name || styleId, thumbUrl: video.thumbnailUrl });
          }
        }
      }
    }
  }

  const active = combinations[selectedCombo] || null;

  // Phone preview data from active combo
  const hookColor = active ? (wizardState.hookColors[active.hookIdx] || "#FFF") : "#FFF";
  const hookFont = active ? (wizardState.hookFonts[active.hookIdx] || "Inter") : "Inter";
  const hookFontSize = active ? (wizardState.hookFontSizes[active.hookIdx] || 28) : 28;
  const hookBoxColor = active ? (wizardState.hookBoxColors[active.hookIdx] || "transparent") : "transparent";
  const hookBold = active ? (wizardState.hookBolds?.[active.hookIdx] || false) : false;
  const hookBodyText = active ? (active.hookBody || "") : "";
  const bIdx = active?.bodyIdx ?? 0;
  const hookBodyColor = active ? (wizardState.hookBodyColors?.[bIdx] || "#FFF") : "#FFF";
  const hookBodyFont = active ? (wizardState.hookBodyFonts?.[bIdx] || "Inter") : "Inter";
  const hookBodyFontSize = active ? (wizardState.hookBodyFontSizes?.[bIdx] || 22) : 22;
  const hookBodyBold = active ? (wizardState.hookBodyBolds?.[bIdx] || false) : false;
  const hookBodyBoxColor = active ? (wizardState.hookBodyBoxColors?.[bIdx] || "transparent") : "transparent";
  const hookOutlineColor = active ? (wizardState.hookOutlineColors?.[active.hookIdx] || "transparent") : "transparent";
  const hookOutlineWidth = active ? (wizardState.hookOutlineWidths?.[active.hookIdx] || 0) : 0;
  const hookBodyOutlineColor = active ? (wizardState.hookBodyOutlineColors?.[bIdx] || "transparent") : "transparent";
  const hookBodyOutlineWidth = active ? (wizardState.hookBodyOutlineWidths?.[bIdx] || 0) : 0;
  const ctaFontSize = active ? (wizardState.ctaFontSizes?.[active.ctaIdx] || 20) : 20;
  const ctaBold = active ? (wizardState.ctaBolds?.[active.ctaIdx] || false) : false;
  const ctaBoxColor = active ? (wizardState.ctaBoxColors?.[active.ctaIdx] || "transparent") : "transparent";
  const ctaOutlineColor = active ? (wizardState.ctaOutlineColors?.[active.ctaIdx] || "transparent") : "transparent";
  const ctaOutlineWidth = active ? (wizardState.ctaOutlineWidths?.[active.ctaIdx] || 0) : 0;
  const ctaColor = active ? (wizardState.ctaColors[active.ctaIdx] || "#FFF") : "#FFF";
  const ctaFont = active ? (wizardState.ctaFonts[active.ctaIdx] || "Inter") : "Inter";
  const ctaTmpl = active ? ctaTemplates.find((t) => t.id === wizardState.ctaTemplates[active.ctaIdx]) : null;
  const ctaStyleFn = ctaPreviewStyle[ctaTmpl?.style || "solid"] || ctaPreviewStyle.solid;
  const previewSub = active ? subtitleStyles.find((s) => s.id === active.styleId) : null;

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!projectName.trim()) errs.push("Project name is required (go back to Step 1)");
    if (videoCount === 0) errs.push("At least 1 video is required");
    if (hookCount === 0) errs.push("At least 1 hook is required");
    if (ctaCount === 0) errs.push("At least 1 CTA is required");
    if (subtitleCount === 0) errs.push("At least 1 subtitle style is required");
    if (creditCost > balance) errs.push(`Not enough credits (have ${balance}, need ${creditCost})`);
    setErrors(errs);
    return errs.length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) { errors.forEach((e) => toast.error(e)); return; }
    setCreating(true);
    setGenProgress(0);
    setGenStatus("Initializing...");

    const steps = [
      { at: 5, status: "Preparing video assets..." },
      { at: 15, status: "Applying hooks & styles..." },
      { at: 30, status: "Rendering CTAs..." },
      { at: 50, status: "Adding subtitles..." },
      { at: 65, status: "Compositing overlays..." },
      { at: 80, status: "Encoding videos..." },
      { at: 92, status: "Finalizing..." },
      { at: 100, status: "Complete!" },
    ];

    // 20 seconds total, update every 250ms
    const totalMs = 20000;
    const interval = 250;
    let elapsed = 0;

    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        elapsed += interval;
        const pct = Math.min(Math.round((elapsed / totalMs) * 100), 100);
        setGenProgress(pct);
        const step = [...steps].reverse().find((s) => pct >= s.at);
        if (step) setGenStatus(step.status);
        if (elapsed >= totalMs) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });

    const projectId = createProject(projectName.trim());
    deduct(creditCost);
    // Mark project as completed
    updateProject(projectId, { status: "completed", completedVideos: totalVideos });
    toast.success(`Project created! ${totalVideos} videos generated.`);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-black">Review & Create</h2>
        <p className="text-sm text-muted-foreground mt-1">Review selections, preview combinations, and create.</p>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 space-y-1">
          {errors.map((e, i) => <p key={i} className="text-[12px] text-red-400 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 shrink-0" />{e}</p>)}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-stretch md:gap-4 lg:gap-5 w-full">
        {/* LEFT */}
        <div className="w-full md:w-[45%] lg:w-[38%] md:flex-none min-w-0 space-y-3">
          <div className={cn("glass-card p-3", !projectName.trim() && errors.length > 0 && "ring-1 ring-red-500/30")}>
            <p className="text-xs text-muted-foreground mb-0.5">Project Name</p>
            <p className="text-white font-semibold text-sm">{projectName || <span className="text-red-400">Not set</span>}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className={cn("glass-card p-2.5", videoCount === 0 && errors.length > 0 && "ring-1 ring-red-500/30")}>
              <div className="flex items-center gap-1.5 mb-1.5"><Video className="h-3.5 w-3.5 text-brand-purple" /><span className="font-semibold text-white text-xs">Videos ({videoCount})</span></div>
              {wizardState.videos.map((v) => <p key={v.id} className="text-xs text-muted-foreground truncate">{v.name}</p>)}
              {videoCount === 0 && <p className="text-xs text-red-400">None</p>}
            </div>
            <div className={cn("glass-card p-2.5", hookCount === 0 && errors.length > 0 && "ring-1 ring-red-500/30")}>
              <div className="flex items-center gap-1.5 mb-1.5"><Type className="h-3.5 w-3.5 text-brand-blue" /><span className="font-semibold text-white text-xs">Hooks ({hookCount})</span></div>
              {filledHooks.map((h) => <p key={h.i} className="text-xs text-muted-foreground truncate">{h.text}</p>)}
              {hookCount === 0 && <p className="text-xs text-red-400">None</p>}
            </div>
            <div className="glass-card p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5"><AlignLeft className="h-3.5 w-3.5 text-brand-purple/70" /><span className="font-semibold text-white text-xs">Bodies ({hookBodyCount})</span></div>
              {filledHookBodies.map((h) => <p key={h.i} className="text-xs text-muted-foreground truncate">{h.text}</p>)}
              {hookBodyCount === 0 && <p className="text-xs text-muted-foreground">None</p>}
            </div>
            <div className={cn("glass-card p-2.5", ctaCount === 0 && errors.length > 0 && "ring-1 ring-red-500/30")}>
              <div className="flex items-center gap-1.5 mb-1.5"><MousePointerClick className="h-3.5 w-3.5 text-brand-cyan" /><span className="font-semibold text-white text-xs">CTAs ({ctaCount})</span></div>
              {filledCtas.map((c) => <p key={c.i} className="text-xs text-muted-foreground truncate">{c.text}</p>)}
              {ctaCount === 0 && <p className="text-xs text-red-400">None</p>}
            </div>
            <div className={cn("glass-card p-2.5", subtitleCount === 0 && errors.length > 0 && "ring-1 ring-red-500/30")}>
              <div className="flex items-center gap-1.5 mb-1.5"><Subtitles className="h-3.5 w-3.5 text-brand-teal" /><span className="font-semibold text-white text-xs">Subtitles ({subtitleCount})</span></div>
              {selectedStyles.map((s) => <p key={s.id} className="text-xs text-muted-foreground">{s.name}</p>)}
              {subtitleCount === 0 && <p className="text-xs text-red-400">None</p>}
            </div>
          </div>

          <Separator className="bg-border" />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 gradient-border">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-brand-purple" /><h3 className="text-sm sm:text-base font-bold text-black">Generation Summary</h3></div>
            <div className="text-center mb-2">
              <p className="text-xs text-muted-foreground">{videoCount} × {hookCount} × {bodyCountForCalc} × {ctaCount} × {subtitleCount}</p>
              <p className="text-xl sm:text-2xl font-bold gradient-text mt-1">Total {totalVideos} videos</p>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg mb-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" />Credits</span>
              <span className="font-semibold text-white text-sm">{creditCost}</span>
            </div>
            {creditCost > balance && <p className="text-xs text-red-400 mb-2">Insufficient credits ({balance} available).</p>}

            {creating ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{genStatus}</span>
                  <span className="font-mono text-brand-purple font-semibold">{genProgress}%</span>
                </div>
                <Progress value={genProgress} className="h-2.5" />
                <p className="text-xs text-muted-foreground text-center">Generating {totalVideos} videos...</p>
              </div>
            ) : (
              <Button onClick={handleCreate} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10 text-sm cursor-pointer">
                <Sparkles className="h-4 w-4" />Create Project
              </Button>
            )}
          </motion.div>
        </div>

        {/* RIGHT — Phone Preview + Horizontal Combination Slider */}
        <div className="w-full md:flex-1 min-w-0 mt-4 md:mt-0">
          <div className="rounded-xl border border-border bg-card/50 p-2 sm:p-3 space-y-3">
            {/* Phone Preview with autoplay video */}
            <PhonePreview screenColor="black">
              <div className="relative w-full h-full">
                {/* Video background */}
                {active?.videoUrl && (
                  <video
                    key={active.videoUrl + selectedCombo}
                    src={active.videoUrl}
                    poster={active.thumbUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                {/* Dark overlay for text readability */}
                {active && <div className="absolute inset-0 bg-black/30" />}

                {active ? (
                  <>
                    {/* Hook */}
                    <div className="absolute left-0 right-0 px-3 z-10" style={{ top: `${wizardState.hookYPositions?.[active.hookIdx] ?? 8}%`, transform: "translateY(-50%)", textAlign: (wizardState.hookXPositions?.[active.hookIdx] || "center") as React.CSSProperties["textAlign"] }}>
                      <p className="font-semibold leading-tight max-w-full break-words" style={{
                        color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.45, 16)}px`,
                        fontWeight: hookBold ? 800 : 600,
                        textShadow: "1px 2px 6px rgba(0,0,0,0.9)",
                        ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "4px 8px", borderRadius: 4 }),
                        ...(hookOutlineColor !== "transparent" && hookOutlineWidth > 0 && { WebkitTextStroke: `${hookOutlineWidth * 0.5}px ${hookOutlineColor}` }),
                      }}>{active.hook}</p>
                    </div>
                    {/* Hook Body */}
                    {hookBodyText && (
                      <div className="absolute left-0 right-0 px-3 z-10" style={{ top: `${wizardState.hookBodyYPositions?.[bIdx] ?? 30}%`, transform: "translateY(-50%)", textAlign: (wizardState.hookBodyXPositions?.[bIdx] || "center") as React.CSSProperties["textAlign"] }}>
                        <p className="leading-tight max-w-full break-words" style={{
                          color: hookBodyColor, fontFamily: hookBodyFont, fontSize: `${Math.min(hookBodyFontSize * 0.45, 16)}px`,
                          fontWeight: hookBodyBold ? 800 : 400,
                          textShadow: "1px 1px 4px rgba(0,0,0,0.9)",
                          ...(hookBodyBoxColor !== "transparent" && { backgroundColor: hookBodyBoxColor, padding: "4px 8px", borderRadius: 4 }),
                          ...(hookBodyOutlineColor !== "transparent" && hookBodyOutlineWidth > 0 && { WebkitTextStroke: `${hookBodyOutlineWidth * 0.5}px ${hookBodyOutlineColor}` }),
                        }}>{hookBodyText}</p>
                      </div>
                    )}
                    {/* Subtitle */}
                    {previewSub && (
                      <div className="absolute left-0 right-0 px-3 z-10" style={{ top: `${wizardState.styling.subtitleYPosition}%`, transform: "translateY(-50%)", textAlign: wizardState.styling.subtitleXPosition }}>
                        <p className="leading-tight inline-block" style={{
                          fontFamily: previewSub.fontFamily, fontSize: "10px", color: previewSub.color,
                          backgroundColor: previewSub.backgroundColor !== "transparent" ? previewSub.backgroundColor : undefined,
                          padding: previewSub.backgroundColor !== "transparent" ? "2px 6px" : undefined, borderRadius: 3,
                          textShadow: "1px 1px 4px rgba(0,0,0,0.9)",
                        }}>{previewSub.preview}</p>
                      </div>
                    )}
                    {/* CTA */}
                    <div className="absolute left-0 right-0 px-3 z-10" style={{ top: `${wizardState.ctaYPositions?.[active.ctaIdx] ?? 88}%`, transform: "translateY(-50%)", textAlign: (wizardState.ctaXPositions?.[active.ctaIdx] || "center") as React.CSSProperties["textAlign"] }}>
                      <span className="inline-block px-3 py-1 font-semibold" style={{
                        ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: `${Math.min(ctaFontSize * 0.55, 13)}px`,
                        fontWeight: ctaBold ? 800 : 600,
                        ...(ctaBoxColor !== "transparent" && { background: ctaBoxColor, borderRadius: 4 }),
                        ...(ctaOutlineColor !== "transparent" && ctaOutlineWidth > 0 && { WebkitTextStroke: `${ctaOutlineWidth * 0.5}px ${ctaOutlineColor}` }),
                      }}>{active.cta}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-white/30 text-center px-4">No combinations yet</p>
                  </div>
                )}
              </div>
            </PhonePreview>

            {/* Combo counter — below phone */}
            {combinations.length > 0 && (
              <div className="text-center">
                <span className="text-xs text-muted-foreground font-medium">{selectedCombo + 1} / {combinations.length}</span>
              </div>
            )}

            {/* Combination header + nav buttons */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Combinations</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{combinations.length}</Badge>
                {combinations.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { const el = scrollRef.current; if (el) el.scrollBy({ left: -160, behavior: "smooth" }); }}
                      className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => { const el = scrollRef.current; if (el) el.scrollBy({ left: 160, behavior: "smooth" }); }}
                      className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal scrollable combination list */}
            {combinations.length === 0 ? (
              <div className="text-center py-6">
                <Video className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">Complete all steps to see combinations</p>
              </div>
            ) : (
              <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {combinations.map((combo, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCombo(i)}
                    className={cn(
                      "shrink-0 w-[100px] sm:w-[110px] rounded-lg border p-1.5 text-left transition-all cursor-pointer",
                      selectedCombo === i
                        ? "border-brand-purple bg-brand-purple/10 ring-1 ring-brand-purple/50"
                        : "border-border hover:border-brand-purple/20"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-[9/12] rounded overflow-hidden bg-zinc-900 relative mb-1.5">
                      {combo.thumbUrl ? <img src={combo.thumbUrl} alt="" className="w-full h-full object-cover" /> : <Play className="h-4 w-4 text-muted-foreground absolute inset-0 m-auto" />}
                    </div>
                    {/* Info */}
                    <p className="text-[11px] font-medium text-white truncate">{combo.hook}</p>
                    {combo.hookBody && <p className="text-[10px] text-muted-foreground/70 truncate">{combo.hookBody}</p>}
                    <p className="text-[10px] text-brand-cyan truncate">{combo.cta}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{combo.styleName}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
