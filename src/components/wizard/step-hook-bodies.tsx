"use client";

import { useState, useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Clock, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";
import { PreviewPanel } from "./preview-panel";
import { toast } from "react-toastify";

const MAX_BODIES = 4;

type XPos = "left" | "center" | "right";
const xPosOptions: { value: XPos; icon: typeof AlignLeft }[] = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

export function StepHookBodies() {
  const { wizardState, updateWizardState } = useProjectStore();
  const hookBodies = wizardState.hookBodies;
  const hookBodyColors = wizardState.hookBodyColors;
  const hookBodyFonts = wizardState.hookBodyFonts;
  const hookBodyFontSizes = wizardState.hookBodyFontSizes;
  const hookBodyBolds = wizardState.hookBodyBolds;
  const hookBodyBoxColors = wizardState.hookBodyBoxColors;
  const hookBodyOutlineColors = wizardState.hookBodyOutlineColors;
  const hookBodyOutlineWidths = wizardState.hookBodyOutlineWidths;
  const [activeIndex, setActiveIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Ensure per-body position/duration arrays are synced with bodies length
  useEffect(() => {
    const len = hookBodies.length;
    const yPos = wizardState.hookBodyYPositions || [];
    const xPos = wizardState.hookBodyXPositions || [];
    const starts = wizardState.hookBodyStarts || [];
    const ends = wizardState.hookBodyEnds || [];
    if (yPos.length < len || xPos.length < len || starts.length < len || ends.length < len) {
      const newY = [...yPos]; const newX = [...xPos]; const newS = [...starts]; const newE = [...ends];
      for (let i = yPos.length; i < len; i++) newY.push(Math.min(30 + i * 15, 85));
      for (let i = xPos.length; i < len; i++) newX.push("center");
      for (let i = starts.length; i < len; i++) newS.push(0);
      for (let i = ends.length; i < len; i++) newE.push(5);
      updateWizardState({ hookBodyYPositions: newY, hookBodyXPositions: newX, hookBodyStarts: newS, hookBodyEnds: newE });
    }
  }, [hookBodies.length]);

  useEffect(() => {
    const handler = () => {
      const filled = hookBodies.filter((b) => b.trim().length > 0).length;
      if (filled < 1) setValidationErrors({ 0: "At least 1 body is required" });
    };
    window.addEventListener("wizard-validate", handler);
    return () => window.removeEventListener("wizard-validate", handler);
  }, [hookBodies]);

  const updateHookBody = (i: number, v: string) => {
    const n = [...hookBodies]; n[i] = v; updateWizardState({ hookBodies: n });
    if (v.trim()) setValidationErrors((p) => { const x = { ...p }; delete x[i]; return x; });
  };

  const addBody = () => {
    if (hookBodies.length >= MAX_BODIES) { toast.error(`Maximum ${MAX_BODIES} bodies allowed`); return; }
    updateWizardState({
      hookBodies: [...hookBodies, ""],
      hookBodyColors: [...hookBodyColors, "#FFFFFF"],
      hookBodyFonts: [...hookBodyFonts, "Inter"],
      hookBodyFontSizes: [...hookBodyFontSizes, 22],
      hookBodyBolds: [...hookBodyBolds, false],
      hookBodyBoxColors: [...hookBodyBoxColors, "transparent"],
      hookBodyOutlineColors: [...hookBodyOutlineColors, "transparent"],
      hookBodyOutlineWidths: [...hookBodyOutlineWidths, 0],
      hookBodyTemplates: [...(wizardState.hookBodyTemplates || []), "ht1"],
      hookBodyStarts: [...(wizardState.hookBodyStarts || []), 0],
      hookBodyEnds: [...(wizardState.hookBodyEnds || []), 5],
      hookBodyXPositions: [...(wizardState.hookBodyXPositions || []), "center"],
      hookBodyYPositions: [...(wizardState.hookBodyYPositions || []), Math.min(30 + hookBodies.length * 15, 85)],
    });
    setActiveIndex(hookBodies.length);
  };

  const removeBody = (i: number) => {
    if (hookBodies.length <= 1) { toast.error("At least 1 body is required"); return; }
    const rm = <T,>(arr: T[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      hookBodies: rm(hookBodies),
      hookBodyColors: rm(hookBodyColors),
      hookBodyFonts: rm(hookBodyFonts),
      hookBodyFontSizes: rm(hookBodyFontSizes),
      hookBodyBolds: rm(hookBodyBolds),
      hookBodyBoxColors: rm(hookBodyBoxColors),
      hookBodyOutlineColors: rm(hookBodyOutlineColors),
      hookBodyOutlineWidths: rm(hookBodyOutlineWidths),
      hookBodyTemplates: rm(wizardState.hookBodyTemplates || []),
      hookBodyStarts: rm(wizardState.hookBodyStarts || []),
      hookBodyEnds: rm(wizardState.hookBodyEnds || []),
      hookBodyXPositions: rm(wizardState.hookBodyXPositions || []),
      hookBodyYPositions: rm(wizardState.hookBodyYPositions || []),
    });
    if (activeIndex >= hookBodies.length - 1) setActiveIndex(Math.max(0, hookBodies.length - 2));
    toast.success("Body removed");
  };

  const updateBodyColor = (c: string) => { const n = [...hookBodyColors]; n[activeIndex] = c; updateWizardState({ hookBodyColors: n }); };
  const updateBodyFont = (f: string) => { const n = [...hookBodyFonts]; n[activeIndex] = f; updateWizardState({ hookBodyFonts: n }); };
  const updateBodyFontSize = (s: number) => { const n = [...hookBodyFontSizes]; n[activeIndex] = s; updateWizardState({ hookBodyFontSizes: n }); };
  const toggleBodyBold = () => { const n = [...hookBodyBolds]; n[activeIndex] = !n[activeIndex]; updateWizardState({ hookBodyBolds: n }); };
  const updateBodyBoxColor = (c: string) => { const n = [...hookBodyBoxColors]; n[activeIndex] = c; updateWizardState({ hookBodyBoxColors: n }); };
  const updateBodyOutlineColor = (c: string) => { const n = [...hookBodyOutlineColors]; n[activeIndex] = c; updateWizardState({ hookBodyOutlineColors: n }); };
  const updateBodyOutlineWidth = (w: number) => { const n = [...hookBodyOutlineWidths]; n[activeIndex] = w; updateWizardState({ hookBodyOutlineWidths: n }); };

  const applyToAll = () => {
    if (hookBodies.length <= 1) { toast.error("Nothing to apply - only 1 item"); return; }
    if (hookBodies[activeIndex]?.trim() === "") { toast.error("Please fill in the field first"); return; }
    updateWizardState({
      hookBodyColors: hookBodies.map(() => hookBodyColors[activeIndex] || "#FFFFFF"),
      hookBodyFonts: hookBodies.map(() => hookBodyFonts[activeIndex] || "Inter"),
      hookBodyFontSizes: hookBodies.map(() => hookBodyFontSizes[activeIndex] || 22),
      hookBodyBoxColors: hookBodies.map(() => hookBodyBoxColors[activeIndex] || "transparent"),
      hookBodyOutlineColors: hookBodies.map(() => hookBodyOutlineColors[activeIndex] || "transparent"),
      hookBodyOutlineWidths: hookBodies.map(() => hookBodyOutlineWidths[activeIndex] || 0),
      hookBodyBolds: hookBodies.map(() => hookBodyBolds[activeIndex] || false),
      hookBodyStarts: hookBodies.map(() => wizardState.hookBodyStarts?.[activeIndex] ?? 0),
      hookBodyEnds: hookBodies.map(() => wizardState.hookBodyEnds?.[activeIndex] ?? 0),
      hookBodyXPositions: hookBodies.map(() => wizardState.hookBodyXPositions?.[activeIndex] || "center"),
      hookBodyYPositions: hookBodies.map(() => wizardState.hookBodyYPositions?.[activeIndex] ?? 30),
    });
    toast.success("Style applied to all bodies");
  };

  const filledCount = hookBodies.filter((b) => b.trim().length > 0).length;
  const activeColor = hookBodyColors[activeIndex] || "#FFFFFF";
  const activeFont = hookBodyFonts[activeIndex] || "Inter";
  const activeFontSize = hookBodyFontSizes[activeIndex] || 22;
  const activeBoxColor = hookBodyBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = hookBodyOutlineColors[activeIndex] || "transparent";
  const activeBold = hookBodyBolds[activeIndex] || false;
  const activeOutlineWidth = hookBodyOutlineWidths[activeIndex] || 0;

  return (
    <div className="space-y-3 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-black">Write Your Bodies</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {MAX_BODIES} bodies (Minimum 1).{" "}
          <span className="text-black font-medium">{filledCount}/{hookBodies.length}</span>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-4 lg:gap-5 w-full">
        {/* LEFT */}
        <div className="w-full md:w-[45%] lg:w-[38%] md:flex-none min-w-0 space-y-3 mt-3 md:mt-0">
          {hookBodies.map((body, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                <span className="text-base font-semibold text-black flex-1">Body {index + 1}</span>
                {body.trim() && <Check className="h-3 w-3 text-brand-teal shrink-0" />}
                {hookBodies.length > 1 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeBody(index); }}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors shrink-0" title="Remove body">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Textarea
                  value={body}
                  onChange={(e) => updateHookBody(index, e.target.value)}
                  onFocus={() => setActiveIndex(index)}
                  placeholder={`Enter body ${index + 1}...`}
                  rows={3}
                  className={cn("text-sm rounded-lg resize-none hook-input", validationErrors[index] ? "border-red-500/50" : "")}
                />
              </div>
              {validationErrors[index] && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
            </div>
          ))}

          {hookBodies.length < MAX_BODIES && (
            <Button onClick={addBody} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10">
              <Plus className="h-4 w-4" /> Add Body ({hookBodies.length}/{MAX_BODIES})
            </Button>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full md:flex-1 min-w-0 md:sticky md:top-0">
          <PreviewPanel activeLayer="hook" bodyIndex={activeIndex} hookStyleTarget="body"
            topContent={
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg px-4 py-3">
                <div>
                  <h3 className="text-lg font-bold text-black">Body {activeIndex + 1}</h3>
                  <p className="text-xs text-muted-foreground">Preview & Style</p>
                </div>
                <Button onClick={applyToAll} size="sm" className="gradient-bg text-white border-0 hover:opacity-90 text-sm h-9 px-4">
                  Apply to All
                </Button>
              </div>
            }>
            {/* Styling */}
            <div className="glass-card p-3 sm:p-5 space-y-0 divide-y divide-border">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider pb-3">Body {activeIndex + 1} Style</h3>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Font Color</span><ColorPickerAlpha value={activeColor} onChange={updateBodyColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Font Style</span>
                <Select value={activeFont} onValueChange={(v) => v && updateBodyFont(v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Bold</span>
                <button onClick={toggleBodyBold} className={cn("w-10 h-10 rounded-lg border flex items-center justify-center text-base font-black transition-all", activeBold ? "gradient-bg text-white border-transparent" : "bg-white/5 text-muted-foreground border-border hover:bg-white/10")}>B</button>
              </div>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={updateBodyBoxColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { updateBodyOutlineColor(c); if (c === "transparent") updateBodyOutlineWidth(0); else if (activeOutlineWidth === 0) updateBodyOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-sm font-bold text-black">Width</span><span className="text-xs text-black font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => updateBodyOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Font Size</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateBodyFontSize(Math.max(10, activeFontSize - 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">−</button>
                    <span className="text-sm text-black font-mono w-10 text-center font-bold">{activeFontSize}px</span>
                    <button onClick={() => updateBodyFontSize(Math.min(48, activeFontSize + 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">+</button>
                  </div>
                </div>
                <Slider value={[activeFontSize]} onValueChange={(v) => updateBodyFontSize(Array.isArray(v) ? v[0] : v)} min={10} max={48} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-3 sm:p-5 space-y-4">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-cyan" /><h3 className="text-sm font-bold text-black uppercase tracking-wider">Body {activeIndex + 1} Duration & Position</h3></div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">Start (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.hookBodyStarts?.[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...(wizardState.hookBodyStarts || [])]; n[activeIndex] = val; updateWizardState({ hookBodyStarts: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">End (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.hookBodyEnds?.[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...(wizardState.hookBodyEnds || [])]; n[activeIndex] = val; updateWizardState({ hookBodyEnds: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-black">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => { const n = [...(wizardState.hookBodyXPositions || [])]; n[activeIndex] = opt.value; updateWizardState({ hookBodyXPositions: n }); }} className={cn("px-3 py-2 text-xs transition-colors", (wizardState.hookBodyXPositions?.[activeIndex] || "center") === opt.value ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold text-black flex items-center gap-1"><ArrowDownUp className="h-3.5 w-3.5" />Vertical</Label><span className="text-xs text-black font-mono">{wizardState.hookBodyYPositions?.[activeIndex] ?? 30}%</span></div>
                <Slider value={[wizardState.hookBodyYPositions?.[activeIndex] ?? 30]} onValueChange={(v) => { const n = [...(wizardState.hookBodyYPositions || [])]; n[activeIndex] = Array.isArray(v) ? v[0] : v; updateWizardState({ hookBodyYPositions: n }); }} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
