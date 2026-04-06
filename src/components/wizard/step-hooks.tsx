"use client";

import { useState, useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { hookTemplates } from "@/data/hook-templates";
import { LIMITS, FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Type, Check, AlertCircle, Clock, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";
import { PreviewPanel } from "./preview-panel";
import { toast } from "react-toastify";

type XPos = "left" | "center" | "right";
const xPosOptions: { value: XPos; icon: typeof AlignLeft }[] = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

export function StepHooks() {
  const { wizardState, updateWizardState } = useProjectStore();
  const hooks = wizardState.hooks;
  const templates = wizardState.hookTemplates;
  const hookColors = wizardState.hookColors;
  const hookFonts = wizardState.hookFonts;
  const hookFontSizes = wizardState.hookFontSizes;
  const hookBoxColors = wizardState.hookBoxColors;
  const hookOutlineColors = wizardState.hookOutlineColors;
  const hookOutlineWidths = wizardState.hookOutlineWidths;
  const hookBolds = wizardState.hookBolds;
  const hookBodies = wizardState.hookBodies;
  const hookBodyTemplates = wizardState.hookBodyTemplates;
  const hookBodyColors = wizardState.hookBodyColors;
  const hookBodyFonts = wizardState.hookBodyFonts;
  const hookBodyFontSizes = wizardState.hookBodyFontSizes;
  const hookBodyBolds = wizardState.hookBodyBolds;
  const hookBodyBoxColors = wizardState.hookBodyBoxColors;
  const hookBodyOutlineColors = wizardState.hookBodyOutlineColors;
  const hookBodyOutlineWidths = wizardState.hookBodyOutlineWidths;
  const [activeIndex, setActiveIndex] = useState(0);
  const [styleTarget, setStyleTarget] = useState<"hook" | "body">("hook");
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Listen for validation trigger
  useEffect(() => {
    const handler = () => {
      const filled = hooks.filter((h) => h.trim().length > 0).length;
      if (filled < 1) setValidationErrors({ 0: "At least 1 hook is required" });
    };
    window.addEventListener("wizard-validate", handler);
    return () => window.removeEventListener("wizard-validate", handler);
  }, [hooks]);

  const updateHook = (i: number, v: string) => {
    if (v.length > LIMITS.hookMaxChars) return;
    const n = [...hooks]; n[i] = v; updateWizardState({ hooks: n });
    if (v.trim()) setValidationErrors((p) => { const x = { ...p }; delete x[i]; return x; });
  };

  const clearHook = (i: number) => {
    const n = [...hooks]; n[i] = ""; updateWizardState({ hooks: n });
  };

  const removeHook = (i: number) => {
    if (hooks.length <= 1) { toast.error("At least 1 hook is required"); return; }
    const rm = (arr: string[]) => arr.filter((_, idx) => idx !== i);
    const rmN = (arr: number[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      hooks: rm(hooks), hookTemplates: rm(templates), hookColors: rm(hookColors),
      hookFonts: rm(hookFonts), hookFontSizes: rmN(hookFontSizes), hookBoxColors: rm(hookBoxColors),
      hookOutlineColors: rm(hookOutlineColors), hookOutlineWidths: rmN(hookOutlineWidths),
      hookBolds: hookBolds.filter((_, idx) => idx !== i),
      hookBodies: hookBodies.filter((_, idx) => idx !== i),
      hookBodyTemplates: hookBodyTemplates.filter((_, idx) => idx !== i),
      hookBodyColors: hookBodyColors.filter((_, idx) => idx !== i),
      hookBodyFonts: hookBodyFonts.filter((_, idx) => idx !== i),
      hookBodyFontSizes: hookBodyFontSizes.filter((_, idx) => idx !== i),
      hookBodyBolds: hookBodyBolds.filter((_, idx) => idx !== i),
      hookBodyBoxColors: hookBodyBoxColors.filter((_, idx) => idx !== i),
      hookBodyOutlineColors: hookBodyOutlineColors.filter((_, idx) => idx !== i),
      hookBodyOutlineWidths: hookBodyOutlineWidths.filter((_, idx) => idx !== i),
    });
    if (activeIndex >= hooks.length - 1) setActiveIndex(Math.max(0, hooks.length - 2));
    toast.success("Hook removed");
  };

  const addHook = () => {
    if (hooks.length >= LIMITS.maxHooks) { toast.error(`Maximum ${LIMITS.maxHooks} hooks allowed`); return; }
    updateWizardState({
      hooks: [...hooks, ""], hookTemplates: [...templates, "ht1"], hookColors: [...hookColors, "#FFFFFF"],
      hookFonts: [...hookFonts, "Inter"], hookFontSizes: [...hookFontSizes, 28], hookBoxColors: [...hookBoxColors, "transparent"],
      hookOutlineColors: [...hookOutlineColors, "transparent"], hookOutlineWidths: [...hookOutlineWidths, 0],
      hookBolds: [...hookBolds, false],
      hookBodies: [...hookBodies, ""],
      hookBodyTemplates: [...hookBodyTemplates, "ht1"],
      hookBodyColors: [...hookBodyColors, "#FFFFFF"],
      hookBodyFonts: [...hookBodyFonts, "Inter"],
      hookBodyFontSizes: [...hookBodyFontSizes, 22],
      hookBodyBolds: [...hookBodyBolds, false],
      hookBodyBoxColors: [...hookBodyBoxColors, "transparent"],
      hookBodyOutlineColors: [...hookBodyOutlineColors, "transparent"],
      hookBodyOutlineWidths: [...hookBodyOutlineWidths, 0],
    });
    setActiveIndex(hooks.length);
  };

  const updateHookTemplate = (id: string) => { const n = [...templates]; n[activeIndex] = id; updateWizardState({ hookTemplates: n }); };
  const updateHookColor = (c: string) => { const n = [...hookColors]; n[activeIndex] = c; updateWizardState({ hookColors: n }); };
  const updateHookFont = (f: string) => { const n = [...hookFonts]; n[activeIndex] = f; updateWizardState({ hookFonts: n }); };
  const updateHookFontSize = (s: number) => { const n = [...hookFontSizes]; n[activeIndex] = s; updateWizardState({ hookFontSizes: n }); };
  const updateHookBoxColor = (c: string) => { const n = [...hookBoxColors]; n[activeIndex] = c; updateWizardState({ hookBoxColors: n }); };
  const updateHookOutlineColor = (c: string) => { const n = [...hookOutlineColors]; n[activeIndex] = c; updateWizardState({ hookOutlineColors: n }); };
  const updateHookOutlineWidth = (w: number) => { const n = [...hookOutlineWidths]; n[activeIndex] = w; updateWizardState({ hookOutlineWidths: n }); };
  const toggleHookBold = () => { const n = [...hookBolds]; n[activeIndex] = !n[activeIndex]; updateWizardState({ hookBolds: n }); };
  const updateHookBody = (i: number, v: string) => { const n = [...hookBodies]; n[i] = v; updateWizardState({ hookBodies: n }); };
  const updateHookBodyTemplate = (id: string) => { const n = [...hookBodyTemplates]; n[activeIndex] = id; updateWizardState({ hookBodyTemplates: n }); };
  // Hook body style updaters
  const updateBodyColor = (c: string) => { const n = [...hookBodyColors]; n[activeIndex] = c; updateWizardState({ hookBodyColors: n }); };
  const updateBodyFont = (f: string) => { const n = [...hookBodyFonts]; n[activeIndex] = f; updateWizardState({ hookBodyFonts: n }); };
  const updateBodyFontSize = (s: number) => { const n = [...hookBodyFontSizes]; n[activeIndex] = s; updateWizardState({ hookBodyFontSizes: n }); };
  const toggleBodyBold = () => { const n = [...hookBodyBolds]; n[activeIndex] = !n[activeIndex]; updateWizardState({ hookBodyBolds: n }); };
  const updateBodyBoxColor = (c: string) => { const n = [...hookBodyBoxColors]; n[activeIndex] = c; updateWizardState({ hookBodyBoxColors: n }); };
  const updateBodyOutlineColor = (c: string) => { const n = [...hookBodyOutlineColors]; n[activeIndex] = c; updateWizardState({ hookBodyOutlineColors: n }); };
  const updateBodyOutlineWidth = (w: number) => { const n = [...hookBodyOutlineWidths]; n[activeIndex] = w; updateWizardState({ hookBodyOutlineWidths: n }); };

  const applyToAll = () => {
    // Hook styles
    const color = hookColors[activeIndex] || "#FFFFFF";
    const font = hookFonts[activeIndex] || "Inter";
    const size = hookFontSizes[activeIndex] || 28;
    const box = hookBoxColors[activeIndex] || "transparent";
    const outline = hookOutlineColors[activeIndex] || "transparent";
    const outlineW = hookOutlineWidths[activeIndex] || 0;
    const tmpl = templates[activeIndex] || "ht1";
    const bold = hookBolds[activeIndex] || false;
    // Hook body styles
    const bColor = hookBodyColors[activeIndex] || "#FFFFFF";
    const bFont = hookBodyFonts[activeIndex] || "Inter";
    const bSize = hookBodyFontSizes[activeIndex] || 22;
    const bBox = hookBodyBoxColors[activeIndex] || "transparent";
    const bOutline = hookBodyOutlineColors[activeIndex] || "transparent";
    const bOutlineW = hookBodyOutlineWidths[activeIndex] || 0;
    const bTmpl = hookBodyTemplates[activeIndex] || "ht1";
    const bBold = hookBodyBolds[activeIndex] || false;
    updateWizardState({
      hookColors: hooks.map(() => color), hookFonts: hooks.map(() => font), hookFontSizes: hooks.map(() => size),
      hookBoxColors: hooks.map(() => box), hookOutlineColors: hooks.map(() => outline), hookOutlineWidths: hooks.map(() => outlineW),
      hookTemplates: hooks.map(() => tmpl), hookBolds: hooks.map(() => bold),
      hookBodyColors: hooks.map(() => bColor), hookBodyFonts: hooks.map(() => bFont), hookBodyFontSizes: hooks.map(() => bSize),
      hookBodyBoxColors: hooks.map(() => bBox), hookBodyOutlineColors: hooks.map(() => bOutline), hookBodyOutlineWidths: hooks.map(() => bOutlineW),
      hookBodyTemplates: hooks.map(() => bTmpl), hookBodyBolds: hooks.map(() => bBold),
    });
    toast.success("Style applied to all hooks & hook bodies");
  };

  const filledCount = hooks.filter((h) => h.trim().length > 0).length;

  // Dynamic style values based on styleTarget
  const isBody = styleTarget === "body";
  const activeColor = isBody ? (hookBodyColors[activeIndex] || "#FFFFFF") : (hookColors[activeIndex] || "#FFFFFF");
  const activeFont = isBody ? (hookBodyFonts[activeIndex] || "Inter") : (hookFonts[activeIndex] || "Inter");
  const activeFontSize = isBody ? (hookBodyFontSizes[activeIndex] || 22) : (hookFontSizes[activeIndex] || 28);
  const activeBoxColor = isBody ? (hookBodyBoxColors[activeIndex] || "transparent") : (hookBoxColors[activeIndex] || "transparent");
  const activeOutlineColor = isBody ? (hookBodyOutlineColors[activeIndex] || "transparent") : (hookOutlineColors[activeIndex] || "transparent");
  const activeBold = isBody ? (hookBodyBolds[activeIndex] || false) : (hookBolds[activeIndex] || false);
  const activeOutlineWidth = isBody ? (hookBodyOutlineWidths[activeIndex] || 0) : (hookOutlineWidths[activeIndex] || 0);

  // Dynamic updaters
  const setColor = isBody ? updateBodyColor : updateHookColor;
  const setFont = isBody ? updateBodyFont : updateHookFont;
  const setFontSize = isBody ? updateBodyFontSize : updateHookFontSize;
  const setBold = isBody ? toggleBodyBold : toggleHookBold;
  const setBoxColor = isBody ? updateBodyBoxColor : updateHookBoxColor;
  const setOutlineColor = isBody ? updateBodyOutlineColor : updateHookOutlineColor;
  const setOutlineWidth = isBody ? updateBodyOutlineWidth : updateHookOutlineWidth;

  return (
    <div className="space-y-3 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">Write Your Hooks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {LIMITS.maxHooks} hooks (min 1).{" "}
          <span className="text-brand-purple font-medium">{filledCount}/{hooks.length}</span>
        </p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-5 w-full">
        {/* LEFT — Hook inputs */}
        <div className="w-full lg:w-[38%] lg:flex-none min-w-0 space-y-3 mt-3 lg:mt-0">
          {hooks.map((hook, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                <span className="text-xs text-muted-foreground flex-1">Hook {index + 1}</span>
                {hook.trim() && <Check className="h-3 w-3 text-brand-teal shrink-0" />}
                {hooks.length > 1 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeHook(index); }}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors shrink-0" title="Remove hook">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={hook} onChange={(e) => updateHook(index, e.target.value)} onFocus={() => { setActiveIndex(index); setStyleTarget("hook"); }}
                  placeholder={`Enter hook ${index + 1}...`} maxLength={LIMITS.hookMaxChars}
                  className={cn("h-9 pl-9 pr-14 text-sm rounded-lg bg-white border-white/20 text-black placeholder:text-gray-400", validationErrors[index] && "border-red-500/50 ring-1 ring-red-500/20")} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{hook.length}/{LIMITS.hookMaxChars}</span>
              </div>
              {validationErrors[index] && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-muted-foreground mb-1 block">Hook Body <span className="text-muted-foreground/60">(optional)</span></span>
                <Textarea
                  value={hookBodies[index] || ""}
                  onChange={(e) => updateHookBody(index, e.target.value)}
                  onFocus={() => { setActiveIndex(index); setStyleTarget("body"); }}
                  placeholder="Enter the main content or explanation of your video…"
                  rows={3}
                  className={cn("text-sm rounded-lg resize-none bg-white border-white/20 text-black placeholder:text-gray-400", validationErrors[index] ? "border-red-500/50" : "")}
                />
              </div>
            </div>
          ))}

          {/* Add Hook button */}
          {hooks.length < LIMITS.maxHooks && (
            <Button onClick={addHook} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10">
              <Plus className="h-4 w-4" /> Add Hook ({hooks.length}/{LIMITS.maxHooks})
            </Button>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full lg:flex-1 min-w-0 lg:sticky lg:top-0">
          <PreviewPanel activeLayer="hook" hookIndex={activeIndex} hookStyleTarget={styleTarget}
            topContent={
              <div className="flex justify-end">
                <Button onClick={applyToAll} size="sm" className="gradient-bg text-white border-0 hover:opacity-90 text-sm h-9 px-4">
                  Apply to All
                </Button>
              </div>
            }>
            {/* Templates */}
            <div className="glass-card p-5 w-full">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{isBody ? "Hook Body" : "Hook"} Templates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {hookTemplates.map((tmpl) => {
                  const sel = isBody ? (hookBodyTemplates[activeIndex] === tmpl.id) : (templates[activeIndex] === tmpl.id);
                  return (
                    <button key={tmpl.id} onClick={() => isBody ? updateHookBodyTemplate(tmpl.id) : updateHookTemplate(tmpl.id)}
                      className={cn("relative rounded-xl border p-5 text-center transition-all cursor-pointer w-full", sel ? "border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple" : "border-border hover:border-border/80 hover:bg-white/[0.02]")}>
                      <div className="h-32 sm:h-36 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg flex items-center justify-center mb-3 overflow-hidden w-full">
                        <span className={cn("text-base font-bold", `overlay-anim-${tmpl.animation}`)} style={{ color: activeColor, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{tmpl.animation}</span>
                      </div>
                      <span className="text-sm font-bold text-white leading-tight block">{tmpl.name}</span>
                      {sel && <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full gradient-bg flex items-center justify-center"><Check className="h-3.5 w-3.5 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Style Target Toggle */}
            <div className="glass-card p-4 w-full">
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button onClick={() => setStyleTarget("hook")} className={cn("flex-1 py-2.5 text-sm font-bold transition-colors", styleTarget === "hook" ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}>Hook {activeIndex + 1}</button>
                <button onClick={() => setStyleTarget("body")} className={cn("flex-1 py-2.5 text-sm font-bold transition-colors", styleTarget === "body" ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}>Hook Body {activeIndex + 1}</button>
              </div>
            </div>
            {/* Styling */}
            <div className="glass-card p-5 space-y-0 divide-y divide-border">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3">{isBody ? `Hook Body ${activeIndex + 1}` : `Hook ${activeIndex + 1}`} Style</h3>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-white">Font Color</span><ColorPickerAlpha value={activeColor} onChange={setColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-white">Font Style</span>
                <Select value={activeFont} onValueChange={(v) => v && setFont(v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-white">Bold</span>
                <button onClick={setBold} className={cn("w-10 h-10 rounded-lg border flex items-center justify-center text-base font-black transition-all", activeBold ? "gradient-bg text-white border-transparent" : "bg-white/5 text-muted-foreground border-border hover:bg-white/10")}>B</button>
              </div>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-white">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={setBoxColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-white">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { setOutlineColor(c); if (c === "transparent") setOutlineWidth(0); else if (activeOutlineWidth === 0) setOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-sm font-bold text-white">Width</span><span className="text-xs text-black dark:text-white font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => setOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Font Size</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFontSize(Math.max(10, activeFontSize - 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">−</button>
                    <span className="text-sm text-black dark:text-white font-mono w-10 text-center font-bold">{activeFontSize}px</span>
                    <button onClick={() => setFontSize(Math.min(48, activeFontSize + 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">+</button>
                  </div>
                </div>
                <Slider value={[activeFontSize]} onValueChange={(v) => setFontSize(Array.isArray(v) ? v[0] : v)} min={10} max={48} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-cyan" /><h3 className="text-sm font-bold text-white uppercase tracking-wider">Hook Duration & Position</h3></div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm font-bold text-white mb-1 block">Start (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.styling.hookStart} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    updateWizardState({ styling: { ...wizardState.styling, hookStart: val } });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-bold text-white mb-1 block">End (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.styling.hookDuration} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    updateWizardState({ styling: { ...wizardState.styling, hookDuration: val, hookBodyStart: val } });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-white">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => updateWizardState({ styling: { ...wizardState.styling, hookXPosition: opt.value } })} className={cn("px-3 py-2 text-xs transition-colors", wizardState.styling.hookXPosition === opt.value ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold text-white flex items-center gap-1"><ArrowDownUp className="h-3.5 w-3.5" />Vertical</Label><span className="text-xs text-black dark:text-white font-mono">{wizardState.styling.hookYPosition}%</span></div>
                <Slider value={[wizardState.styling.hookYPosition]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, hookYPosition: Array.isArray(v) ? v[0] : v } })} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
            {/* Hook Body Duration & Position */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-teal" /><h3 className="text-sm font-bold text-white uppercase tracking-wider">Hook Body Duration & Position</h3></div>
              <p className="text-xs text-muted-foreground">Hook body appears after hook ends. Hook body start must be ≥ hook end.</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm font-bold text-white mb-1 block">Start (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.styling.hookBodyStart} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    if (val < wizardState.styling.hookDuration) { toast.error(`Hook body start must be after hook end (${wizardState.styling.hookDuration}s)`); return; }
                    updateWizardState({ styling: { ...wizardState.styling, hookBodyStart: val } });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-bold text-white mb-1 block">End (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.styling.hookBodyDuration} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    if (val <= wizardState.styling.hookBodyStart) { toast.error("Hook body end must be greater than start"); return; }
                    updateWizardState({ styling: { ...wizardState.styling, hookBodyDuration: val } });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-white">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => updateWizardState({ styling: { ...wizardState.styling, hookBodyXPosition: opt.value } })} className={cn("px-3 py-2 text-xs transition-colors", wizardState.styling.hookBodyXPosition === opt.value ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold text-white flex items-center gap-1"><ArrowDownUp className="h-3.5 w-3.5" />Vertical</Label><span className="text-xs text-black dark:text-white font-mono">{wizardState.styling.hookBodyYPosition}%</span></div>
                <Slider value={[wizardState.styling.hookBodyYPosition]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, hookBodyYPosition: Array.isArray(v) ? v[0] : v } })} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
