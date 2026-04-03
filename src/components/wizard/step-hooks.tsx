"use client";

import { useState, useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { hookTemplates } from "@/data/hook-templates";
import { LIMITS, FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Type, Check, AlertCircle, Clock, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, X, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";
import { PreviewPanel } from "./preview-panel";
import { toast } from "sonner";

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
  const [activeIndex, setActiveIndex] = useState(0);
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
    if (hooks.length <= 1) { toast.error("At least 1 hook is required", { closeButton: true }); return; }
    const rm = (arr: string[]) => arr.filter((_, idx) => idx !== i);
    const rmN = (arr: number[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      hooks: rm(hooks), hookTemplates: rm(templates), hookColors: rm(hookColors),
      hookFonts: rm(hookFonts), hookFontSizes: rmN(hookFontSizes), hookBoxColors: rm(hookBoxColors),
      hookOutlineColors: rm(hookOutlineColors), hookOutlineWidths: rmN(hookOutlineWidths),
    });
    if (activeIndex >= hooks.length - 1) setActiveIndex(Math.max(0, hooks.length - 2));
    toast.success("Hook removed", { closeButton: true });
  };

  const addHook = () => {
    if (hooks.length >= LIMITS.maxHooks) { toast.error(`Maximum ${LIMITS.maxHooks} hooks allowed`, { closeButton: true }); return; }
    updateWizardState({
      hooks: [...hooks, ""], hookTemplates: [...templates, "ht1"], hookColors: [...hookColors, "#FFFFFF"],
      hookFonts: [...hookFonts, "Inter"], hookFontSizes: [...hookFontSizes, 28], hookBoxColors: [...hookBoxColors, "transparent"],
      hookOutlineColors: [...hookOutlineColors, "transparent"], hookOutlineWidths: [...hookOutlineWidths, 0],
    });
    setActiveIndex(hooks.length);
  };

  const applyToAll = () => {
    const color = hookColors[activeIndex] || "#FFFFFF";
    const font = hookFonts[activeIndex] || "Inter";
    const size = hookFontSizes[activeIndex] || 28;
    const box = hookBoxColors[activeIndex] || "transparent";
    const outline = hookOutlineColors[activeIndex] || "transparent";
    const outlineW = hookOutlineWidths[activeIndex] || 0;
    const tmpl = templates[activeIndex] || "ht1";
    updateWizardState({
      hookColors: hooks.map(() => color), hookFonts: hooks.map(() => font), hookFontSizes: hooks.map(() => size),
      hookBoxColors: hooks.map(() => box), hookOutlineColors: hooks.map(() => outline), hookOutlineWidths: hooks.map(() => outlineW),
      hookTemplates: hooks.map(() => tmpl),
    });
    toast.success("Style applied to all hooks", { closeButton: true });
  };

  const updateHookTemplate = (id: string) => { const n = [...templates]; n[activeIndex] = id; updateWizardState({ hookTemplates: n }); };
  const updateHookColor = (c: string) => { const n = [...hookColors]; n[activeIndex] = c; updateWizardState({ hookColors: n }); };
  const updateHookFont = (f: string) => { const n = [...hookFonts]; n[activeIndex] = f; updateWizardState({ hookFonts: n }); };
  const updateHookFontSize = (s: number) => { const n = [...hookFontSizes]; n[activeIndex] = s; updateWizardState({ hookFontSizes: n }); };
  const updateHookBoxColor = (c: string) => { const n = [...hookBoxColors]; n[activeIndex] = c; updateWizardState({ hookBoxColors: n }); };
  const updateHookOutlineColor = (c: string) => { const n = [...hookOutlineColors]; n[activeIndex] = c; updateWizardState({ hookOutlineColors: n }); };
  const updateHookOutlineWidth = (w: number) => { const n = [...hookOutlineWidths]; n[activeIndex] = w; updateWizardState({ hookOutlineWidths: n }); };

  const filledCount = hooks.filter((h) => h.trim().length > 0).length;
  const activeColor = hookColors[activeIndex] || "#FFFFFF";
  const activeFont = hookFonts[activeIndex] || "Inter";
  const activeFontSize = hookFontSizes[activeIndex] || 28;
  const activeBoxColor = hookBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = hookOutlineColors[activeIndex] || "transparent";
  const activeOutlineWidth = hookOutlineWidths[activeIndex] || 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">Write Your Hooks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {LIMITS.maxHooks} hooks (min 1).{" "}
          <span className="text-brand-purple font-medium">{filledCount}/{hooks.length}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* LEFT — Hook inputs */}
        <div className="flex-1 min-w-0 space-y-3 lg:pr-6">
          {hooks.map((hook, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
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
                <Input value={hook} onChange={(e) => updateHook(index, e.target.value)} onFocus={() => setActiveIndex(index)}
                  placeholder={`Enter hook ${index + 1}...`} maxLength={LIMITS.hookMaxChars}
                  className={cn("h-9 pl-9 pr-14 text-sm rounded-lg", validationErrors[index] && "border-red-500/50 ring-1 ring-red-500/20")} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{hook.length}/{LIMITS.hookMaxChars}</span>
              </div>
              {validationErrors[index] && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
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
        <div className="flex-1 min-w-0 lg:pl-4 mt-4 lg:mt-0 space-y-3">
          <PreviewPanel activeLayer="hook" hookIndex={activeIndex}>
            {/* Apply to All */}
            {hooks.length > 1 && (
              <Button onClick={applyToAll} variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Copy className="h-3.5 w-3.5" /> Apply Style to All Hooks
              </Button>
            )}
            {/* Templates */}
            <div className="glass-card p-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Templates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hookTemplates.map((tmpl) => {
                  const sel = templates[activeIndex] === tmpl.id;
                  return (
                    <button key={tmpl.id} onClick={() => updateHookTemplate(tmpl.id)}
                      className={cn("relative rounded-lg border p-2 text-center transition-all cursor-pointer", sel ? "border-brand-purple bg-brand-purple/10 ring-1 ring-brand-purple" : "border-border hover:border-border/80")}>
                      <div className="h-10 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded flex items-center justify-center mb-1.5 overflow-hidden">
                        <span className={cn("text-[8px] font-semibold", `overlay-anim-${tmpl.animation}`)} style={{ color: activeColor, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{tmpl.animation}</span>
                      </div>
                      <span className="text-[10px] font-medium text-white leading-tight block">{tmpl.name}</span>
                      {sel && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-bg flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Styling */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Hook {activeIndex + 1} Style</h3>
              <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Font Color</span><ColorPickerAlpha value={activeColor} onChange={updateHookColor} /></div>
              <Select value={activeFont} onValueChange={(v) => v && updateHookFont(v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
              </Select>
              <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={updateHookBoxColor} /></div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { updateHookOutlineColor(c); if (c === "transparent") updateHookOutlineWidth(0); else if (activeOutlineWidth === 0) updateHookOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-[10px] text-muted-foreground">Width</span><span className="text-[10px] text-brand-purple font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => updateHookOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Font Size</span><span className="text-xs text-brand-purple font-mono">{activeFontSize}px</span></div>
                <Slider value={[activeFontSize]} onValueChange={(v) => updateHookFontSize(Array.isArray(v) ? v[0] : v)} min={14} max={48} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-cyan" /><h3 className="text-xs font-semibold text-white uppercase tracking-wider">Duration & Position</h3></div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-xs text-muted-foreground">Duration</Label><span className="text-xs text-brand-cyan font-mono">{wizardState.styling.hookDuration}s</span></div>
                <Slider value={[wizardState.styling.hookDuration]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, hookDuration: Array.isArray(v) ? v[0] : v } })} min={1} max={10} step={0.5} className="py-1" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => updateWizardState({ styling: { ...wizardState.styling, hookXPosition: opt.value } })} className={cn("px-2.5 py-1.5 text-xs transition-colors", wizardState.styling.hookXPosition === opt.value ? "bg-brand-purple text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-3.5 w-3.5" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-xs text-muted-foreground flex items-center gap-1"><ArrowDownUp className="h-3 w-3" />Vertical</Label><span className="text-xs text-brand-cyan font-mono">{wizardState.styling.hookYPosition}%</span></div>
                <Slider value={[wizardState.styling.hookYPosition]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, hookYPosition: Array.isArray(v) ? v[0] : v } })} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
