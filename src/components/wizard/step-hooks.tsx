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
  const [activeIndex, setActiveIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Ensure per-hook position/duration arrays are synced with hooks length
  useEffect(() => {
    const len = hooks.length;
    const yPos = wizardState.hookYPositions || [];
    const xPos = wizardState.hookXPositions || [];
    const starts = wizardState.hookStarts || [];
    const ends = wizardState.hookEnds || [];
    if (yPos.length < len || xPos.length < len || starts.length < len || ends.length < len) {
      const newY = [...yPos]; const newX = [...xPos]; const newS = [...starts]; const newE = [...ends];
      for (let i = yPos.length; i < len; i++) newY.push(Math.min(8 + i * 15, 80));
      for (let i = xPos.length; i < len; i++) newX.push("center");
      for (let i = starts.length; i < len; i++) newS.push(0);
      for (let i = ends.length; i < len; i++) newE.push(5);
      updateWizardState({ hookYPositions: newY, hookXPositions: newX, hookStarts: newS, hookEnds: newE });
    }
  }, [hooks.length]);

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

  const removeHook = (i: number) => {
    if (hooks.length <= 1) { toast.error("At least 1 hook is required"); return; }
    const rm = (arr: string[]) => arr.filter((_, idx) => idx !== i);
    const rmN = (arr: number[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      hooks: rm(hooks), hookTemplates: rm(templates), hookColors: rm(hookColors),
      hookFonts: rm(hookFonts), hookFontSizes: rmN(hookFontSizes), hookBoxColors: rm(hookBoxColors),
      hookOutlineColors: rm(hookOutlineColors), hookOutlineWidths: rmN(hookOutlineWidths),
      hookBolds: hookBolds.filter((_, idx) => idx !== i),
      hookBodies: wizardState.hookBodies.filter((_, idx) => idx !== i),
      hookBodyTemplates: wizardState.hookBodyTemplates.filter((_, idx) => idx !== i),
      hookBodyColors: wizardState.hookBodyColors.filter((_, idx) => idx !== i),
      hookBodyFonts: wizardState.hookBodyFonts.filter((_, idx) => idx !== i),
      hookBodyFontSizes: wizardState.hookBodyFontSizes.filter((_, idx) => idx !== i),
      hookBodyBolds: wizardState.hookBodyBolds.filter((_, idx) => idx !== i),
      hookBodyBoxColors: wizardState.hookBodyBoxColors.filter((_, idx) => idx !== i),
      hookBodyOutlineColors: wizardState.hookBodyOutlineColors.filter((_, idx) => idx !== i),
      hookBodyOutlineWidths: wizardState.hookBodyOutlineWidths.filter((_, idx) => idx !== i),
      hookStarts: wizardState.hookStarts.filter((_, idx) => idx !== i),
      hookEnds: wizardState.hookEnds.filter((_, idx) => idx !== i),
      hookXPositions: wizardState.hookXPositions.filter((_, idx) => idx !== i),
      hookYPositions: wizardState.hookYPositions.filter((_, idx) => idx !== i),
      hookBodyStarts: wizardState.hookBodyStarts.filter((_, idx) => idx !== i),
      hookBodyEnds: wizardState.hookBodyEnds.filter((_, idx) => idx !== i),
      hookBodyXPositions: wizardState.hookBodyXPositions.filter((_, idx) => idx !== i),
      hookBodyYPositions: wizardState.hookBodyYPositions.filter((_, idx) => idx !== i),
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
      hookBodies: [...wizardState.hookBodies, ""],
      hookBodyTemplates: [...wizardState.hookBodyTemplates, "ht1"],
      hookBodyColors: [...wizardState.hookBodyColors, "#FFFFFF"],
      hookBodyFonts: [...wizardState.hookBodyFonts, "Inter"],
      hookBodyFontSizes: [...wizardState.hookBodyFontSizes, 22],
      hookBodyBolds: [...wizardState.hookBodyBolds, false],
      hookBodyBoxColors: [...wizardState.hookBodyBoxColors, "transparent"],
      hookBodyOutlineColors: [...wizardState.hookBodyOutlineColors, "transparent"],
      hookBodyOutlineWidths: [...wizardState.hookBodyOutlineWidths, 0],
      hookStarts: [...wizardState.hookStarts, 0],
      hookEnds: [...wizardState.hookEnds, 5],
      hookXPositions: [...wizardState.hookXPositions, "center"],
      hookYPositions: [...wizardState.hookYPositions, Math.min(8 + hooks.length * 15, 80)],
      hookBodyStarts: [...wizardState.hookBodyStarts, 0],
      hookBodyEnds: [...wizardState.hookBodyEnds, 5],
      hookBodyXPositions: [...wizardState.hookBodyXPositions, "center"],
      hookBodyYPositions: [...wizardState.hookBodyYPositions, Math.min(30 + hooks.length * 15, 85)],
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

  const applyToAll = () => {
    if (hooks.length <= 1) { toast.error("Nothing to apply - only 1 item"); return; }
    if (hooks[activeIndex].trim() === "") { toast.error("Please fill in the field first"); return; }
    updateWizardState({
      hookColors: hooks.map(() => hookColors[activeIndex] || "#FFFFFF"),
      hookFonts: hooks.map(() => hookFonts[activeIndex] || "Inter"),
      hookFontSizes: hooks.map(() => hookFontSizes[activeIndex] || 28),
      hookBoxColors: hooks.map(() => hookBoxColors[activeIndex] || "transparent"),
      hookOutlineColors: hooks.map(() => hookOutlineColors[activeIndex] || "transparent"),
      hookOutlineWidths: hooks.map(() => hookOutlineWidths[activeIndex] || 0),
      hookTemplates: hooks.map(() => templates[activeIndex] || "ht1"),
      hookBolds: hooks.map(() => hookBolds[activeIndex] || false),
      hookStarts: hooks.map(() => wizardState.hookStarts?.[activeIndex] ?? 0),
      hookEnds: hooks.map(() => wizardState.hookEnds?.[activeIndex] ?? 0),
      hookXPositions: hooks.map(() => wizardState.hookXPositions?.[activeIndex] || "center"),
      hookYPositions: hooks.map(() => wizardState.hookYPositions?.[activeIndex] ?? 8),
    });
    toast.success("Style applied to all hooks");
  };

  const filledCount = hooks.filter((h) => h.trim().length > 0).length;
  const activeColor = hookColors[activeIndex] || "#FFFFFF";
  const activeFont = hookFonts[activeIndex] || "Inter";
  const activeFontSize = hookFontSizes[activeIndex] || 28;
  const activeBoxColor = hookBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = hookOutlineColors[activeIndex] || "transparent";
  const activeBold = hookBolds[activeIndex] || false;
  const activeOutlineWidth = hookOutlineWidths[activeIndex] || 0;

  return (
    <div className="space-y-3 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-black">Write Your Hooks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {LIMITS.maxHooks} hooks (Minimum 1).{" "}
          <span className="text-black font-medium">{filledCount}/{hooks.length}</span>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-4 lg:gap-5 w-full">
        {/* LEFT — Hook inputs */}
        <div className="w-full md:w-[45%] lg:w-[38%] md:flex-none min-w-0 space-y-3 mt-3 md:mt-0">
          {hooks.map((hook, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                <span className="text-base font-semibold text-black flex-1">Hook {index + 1}</span>
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
                  className={cn("h-9 pl-9 pr-14 text-sm rounded-lg hook-input", validationErrors[index] && "border-red-500/50 ring-1 ring-red-500/20")} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{hook.length}/{LIMITS.hookMaxChars}</span>
              </div>
              {validationErrors[index] && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
            </div>
          ))}

          {hooks.length < LIMITS.maxHooks && (
            <Button onClick={addHook} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10">
              <Plus className="h-4 w-4" /> Add Hook ({hooks.length}/{LIMITS.maxHooks})
            </Button>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full md:flex-1 min-w-0 md:sticky md:top-0">
          <PreviewPanel activeLayer="hook" hookIndex={activeIndex} hookStyleTarget="hook"
            topContent={
              <div className="flex items-center justify-between bg-gradient-to-r from-brand-purple/10 to-transparent rounded-lg px-4 py-3">
                <div>
                  <h3 className="text-lg font-bold text-black">Hook {activeIndex + 1}</h3>
                  <p className="text-xs text-muted-foreground">Preview & Style</p>
                </div>
                <Button onClick={applyToAll} size="sm" className="gradient-bg text-white border-0 hover:opacity-90 text-sm h-9 px-4">
                  Apply to All
                </Button>
              </div>
            }>
            {/* Templates */}
            <div className="glass-card p-3 sm:p-5 w-full">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Hook Templates</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
                {hookTemplates.map((tmpl) => {
                  const sel = templates[activeIndex] === tmpl.id;
                  return (
                    <button key={tmpl.id} onClick={() => updateHookTemplate(tmpl.id)}
                      className={cn("relative rounded-xl border p-5 text-center transition-all cursor-pointer w-full", sel ? "border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple" : "border-border hover:border-border/80 hover:bg-white/[0.02]")}>
                      <div className="h-32 sm:h-36 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg flex items-center justify-center mb-3 overflow-hidden w-full">
                        <span className={cn("text-base font-bold", `overlay-anim-${tmpl.animation}`)} style={{ color: activeColor, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{tmpl.animation}</span>
                      </div>
                      <span className="text-sm font-bold text-black leading-tight block">{tmpl.name}</span>
                      {sel && <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full gradient-bg flex items-center justify-center"><Check className="h-3.5 w-3.5 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Styling */}
            <div className="glass-card p-3 sm:p-5 space-y-0 divide-y divide-border">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider pb-3">Hook {activeIndex + 1} Style</h3>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Font Color</span><ColorPickerAlpha value={activeColor} onChange={updateHookColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Font Style</span>
                <Select value={activeFont} onValueChange={(v) => v && updateHookFont(v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Bold</span>
                <button onClick={toggleHookBold} className={cn("w-10 h-10 rounded-lg border flex items-center justify-center text-base font-black transition-all", activeBold ? "gradient-bg text-white border-transparent" : "bg-white/5 text-muted-foreground border-border hover:bg-white/10")}>B</button>
              </div>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={updateHookBoxColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { updateHookOutlineColor(c); if (c === "transparent") updateHookOutlineWidth(0); else if (activeOutlineWidth === 0) updateHookOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-sm font-bold text-black">Width</span><span className="text-xs text-black font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => updateHookOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Font Size</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateHookFontSize(Math.max(10, activeFontSize - 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">−</button>
                    <span className="text-sm text-black font-mono w-10 text-center font-bold">{activeFontSize}px</span>
                    <button onClick={() => updateHookFontSize(Math.min(48, activeFontSize + 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">+</button>
                  </div>
                </div>
                <Slider value={[activeFontSize]} onValueChange={(v) => updateHookFontSize(Array.isArray(v) ? v[0] : v)} min={10} max={48} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-3 sm:p-5 space-y-4">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-cyan" /><h3 className="text-sm font-bold text-black uppercase tracking-wider">Hook {activeIndex + 1} Duration & Position</h3></div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">Start (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.hookStarts[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...wizardState.hookStarts]; n[activeIndex] = val; updateWizardState({ hookStarts: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">End (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.hookEnds[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...wizardState.hookEnds]; n[activeIndex] = val; updateWizardState({ hookEnds: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-black">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => { const n = [...wizardState.hookXPositions]; n[activeIndex] = opt.value; updateWizardState({ hookXPositions: n }); }} className={cn("px-3 py-2 text-xs transition-colors", (wizardState.hookXPositions[activeIndex] || "center") === opt.value ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold text-black flex items-center gap-1"><ArrowDownUp className="h-3.5 w-3.5" />Vertical</Label><span className="text-xs text-black font-mono">{wizardState.hookYPositions[activeIndex] ?? 8}%</span></div>
                <Slider value={[wizardState.hookYPositions[activeIndex] ?? 8]} onValueChange={(v) => { const n = [...wizardState.hookYPositions]; n[activeIndex] = Array.isArray(v) ? v[0] : v; updateWizardState({ hookYPositions: n }); }} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
