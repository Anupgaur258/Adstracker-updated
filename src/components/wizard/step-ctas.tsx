"use client";

import { useState, useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { ctaTemplates } from "@/data/cta-templates";
import { LIMITS, CTA_SUGGESTIONS, FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MousePointerClick, Check, AlertCircle, Clock, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, X, Plus } from "lucide-react";
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

const ctaPreviewStyle: Record<string, (color: string) => React.CSSProperties> = {
  solid: () => ({ background: "#3B82F6", borderRadius: 6, color: "#fff" }),
  outline: (c) => ({ border: `2px solid ${c}`, borderRadius: 6, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff" }),
};

export function StepCtas() {
  const { wizardState, updateWizardState } = useProjectStore();
  const ctas = wizardState.ctas;
  const templates = wizardState.ctaTemplates;
  const ctaColors = wizardState.ctaColors;
  const ctaFonts = wizardState.ctaFonts;
  const ctaFontSizes = wizardState.ctaFontSizes;
  const ctaBoxColors = wizardState.ctaBoxColors;
  const ctaOutlineColors = wizardState.ctaOutlineColors;
  const ctaOutlineWidths = wizardState.ctaOutlineWidths;
  const ctaBolds = wizardState.ctaBolds;
  const [activeIndex, setActiveIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Ensure per-CTA position/duration arrays are synced with CTAs length
  useEffect(() => {
    const len = ctas.length;
    const yPos = wizardState.ctaYPositions || [];
    const xPos = wizardState.ctaXPositions || [];
    const starts = wizardState.ctaStarts || [];
    const ends = wizardState.ctaEnds || [];
    if (yPos.length < len || xPos.length < len || starts.length < len || ends.length < len) {
      const newY = [...yPos]; const newX = [...xPos]; const newS = [...starts]; const newE = [...ends];
      for (let i = yPos.length; i < len; i++) newY.push(Math.min(88 - i * 10, 95));
      for (let i = xPos.length; i < len; i++) newX.push("center");
      for (let i = starts.length; i < len; i++) newS.push(0);
      for (let i = ends.length; i < len; i++) newE.push(5);
      updateWizardState({ ctaYPositions: newY, ctaXPositions: newX, ctaStarts: newS, ctaEnds: newE });
    }
  }, [ctas.length]);

  // Listen for validation trigger
  useEffect(() => {
    const handler = () => {
      const filled = ctas.filter((c) => c.trim().length > 0).length;
      if (filled < 1) setValidationErrors({ 0: "At least 1 CTA is required" });
    };
    window.addEventListener("wizard-validate", handler);
    return () => window.removeEventListener("wizard-validate", handler);
  }, [ctas]);

  const updateCta = (i: number, v: string) => {
    if (v.length > LIMITS.ctaMaxChars) return;
    const n = [...ctas]; n[i] = v; updateWizardState({ ctas: n });
    if (v.trim()) setValidationErrors((p) => { const x = { ...p }; delete x[i]; return x; });
  };

  const removeCta = (i: number) => {
    if (ctas.length <= 1) { toast.error("At least 1 CTA is required"); return; }
    const rm = (arr: string[]) => arr.filter((_, idx) => idx !== i);
    const rmN = (arr: number[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      ctas: rm(ctas), ctaTemplates: rm(templates), ctaColors: rm(ctaColors),
      ctaFonts: rm(ctaFonts), ctaFontSizes: rmN(ctaFontSizes), ctaBoxColors: rm(ctaBoxColors),
      ctaOutlineColors: rm(ctaOutlineColors), ctaOutlineWidths: rmN(ctaOutlineWidths),
      ctaBolds: ctaBolds.filter((_, idx) => idx !== i),
      ctaStarts: wizardState.ctaStarts.filter((_, idx) => idx !== i),
      ctaEnds: wizardState.ctaEnds.filter((_, idx) => idx !== i),
      ctaXPositions: wizardState.ctaXPositions.filter((_, idx) => idx !== i),
      ctaYPositions: wizardState.ctaYPositions.filter((_, idx) => idx !== i),
    });
    if (activeIndex >= ctas.length - 1) setActiveIndex(Math.max(0, ctas.length - 2));
    toast.success("CTA removed");
  };

  const addCta = () => {
    if (ctas.length >= LIMITS.maxCtas) { toast.error(`Maximum ${LIMITS.maxCtas} CTAs allowed`); return; }
    updateWizardState({
      ctas: [...ctas, ""], ctaTemplates: [...templates, "ct1"], ctaColors: [...ctaColors, "#FFFFFF"],
      ctaFonts: [...ctaFonts, "Inter"], ctaFontSizes: [...ctaFontSizes, 20], ctaBoxColors: [...ctaBoxColors, "transparent"],
      ctaOutlineColors: [...ctaOutlineColors, "transparent"], ctaOutlineWidths: [...ctaOutlineWidths, 0],
      ctaBolds: [...ctaBolds, false],
      ctaStarts: [...wizardState.ctaStarts, 0],
      ctaEnds: [...wizardState.ctaEnds, 5],
      ctaXPositions: [...wizardState.ctaXPositions, "center"],
      ctaYPositions: [...wizardState.ctaYPositions, 88],
    });
    setActiveIndex(ctas.length);
  };

  const applySuggestion = (s: string) => {
    updateCta(activeIndex, s);
    toast.success(`Applied "${s}" to CTA ${activeIndex + 1}`);
  };

  const updateCtaTemplate = (id: string) => { const n = [...templates]; n[activeIndex] = id; updateWizardState({ ctaTemplates: n }); };
  const updateCtaColor = (c: string) => { const n = [...ctaColors]; n[activeIndex] = c; updateWizardState({ ctaColors: n }); };
  const updateCtaFont = (f: string) => { const n = [...ctaFonts]; n[activeIndex] = f; updateWizardState({ ctaFonts: n }); };
  const updateCtaFontSize = (s: number) => { const n = [...ctaFontSizes]; n[activeIndex] = s; updateWizardState({ ctaFontSizes: n }); };
  const updateCtaBoxColor = (c: string) => { const n = [...ctaBoxColors]; n[activeIndex] = c; updateWizardState({ ctaBoxColors: n }); };
  const updateCtaOutlineColor = (c: string) => { const n = [...ctaOutlineColors]; n[activeIndex] = c; updateWizardState({ ctaOutlineColors: n }); };
  const updateCtaOutlineWidth = (w: number) => { const n = [...ctaOutlineWidths]; n[activeIndex] = w; updateWizardState({ ctaOutlineWidths: n }); };
  const toggleCtaBold = () => { const n = [...ctaBolds]; n[activeIndex] = !n[activeIndex]; updateWizardState({ ctaBolds: n }); };
  const applyToAll = () => {
    if (ctas.length <= 1) { toast.error("Nothing to apply - only 1 item"); return; }
    if (ctas[activeIndex].trim() === "") { toast.error("Please fill in the field first"); return; }
    const color = ctaColors[activeIndex] || "#FFFFFF";
    const font = ctaFonts[activeIndex] || "Inter";
    const size = ctaFontSizes[activeIndex] || 20;
    const box = ctaBoxColors[activeIndex] || "transparent";
    const outline = ctaOutlineColors[activeIndex] || "transparent";
    const outlineW = ctaOutlineWidths[activeIndex] || 0;
    const tmpl = templates[activeIndex] || "ct1";
    const bold = ctaBolds[activeIndex] || false;
    updateWizardState({
      ctaColors: ctas.map(() => color), ctaFonts: ctas.map(() => font), ctaFontSizes: ctas.map(() => size),
      ctaBoxColors: ctas.map(() => box), ctaOutlineColors: ctas.map(() => outline), ctaOutlineWidths: ctas.map(() => outlineW),
      ctaTemplates: ctas.map(() => tmpl), ctaBolds: ctas.map(() => bold),
      ctaStarts: ctas.map(() => wizardState.ctaStarts?.[activeIndex] ?? 0),
      ctaEnds: ctas.map(() => wizardState.ctaEnds?.[activeIndex] ?? 0),
      ctaXPositions: ctas.map(() => wizardState.ctaXPositions?.[activeIndex] || "center"),
      ctaYPositions: ctas.map(() => wizardState.ctaYPositions?.[activeIndex] ?? 88),
    });
    toast.success("Style applied to all CTAs");
  };

  const filledCount = ctas.filter((c) => c.trim().length > 0).length;
  const activeColor = ctaColors[activeIndex] || "#FFFFFF";
  const activeFont = ctaFonts[activeIndex] || "Inter";
  const activeFontSize = ctaFontSizes[activeIndex] || 20;
  const activeBoxColor = ctaBoxColors[activeIndex] || "transparent";
  const activeBold = ctaBolds[activeIndex] || false;
  const activeOutlineColor = ctaOutlineColors[activeIndex] || "transparent";
  const activeOutlineWidth = ctaOutlineWidths[activeIndex] || 0;

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-black">Add CTAs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {LIMITS.maxCtas} CTAs (Minimum 1).{" "}
          <span className="text-black font-medium">{filledCount}/{ctas.length}</span>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-4 lg:gap-5 w-full">
        {/* LEFT */}
        <div className="w-full md:w-[45%] lg:w-[38%] md:flex-none min-w-0 space-y-3 mt-3 md:mt-0">
          {ctas.map((cta, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                <span className="text-base font-semibold text-black flex-1">CTA {index + 1}</span>
                {cta.trim() && <Check className="h-3 w-3 text-brand-teal shrink-0" />}
                {ctas.length > 1 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeCta(index); }}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors shrink-0" title="Remove CTA">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <MousePointerClick className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={cta} onChange={(e) => updateCta(index, e.target.value)} onFocus={() => setActiveIndex(index)}
                  placeholder={`Enter CTA ${index + 1}...`} maxLength={LIMITS.ctaMaxChars}
                  className={cn("h-9 pl-9 pr-14 text-sm rounded-lg", validationErrors[index] && "border-red-500/50 ring-1 ring-red-500/20")} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{cta.length}/{LIMITS.ctaMaxChars}</span>
              </div>
              {validationErrors[index] && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
            </div>
          ))}

          {/* Add CTA button */}
          {ctas.length < LIMITS.maxCtas && (
            <Button onClick={addCta} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10">
              <Plus className="h-4 w-4" /> Add CTA ({ctas.length}/{LIMITS.maxCtas})
            </Button>
          )}

          {/* Quick suggestions */}
          <div className="pt-2">
            <p className="text-sm font-bold text-black mb-2">Quick suggestions <span className="text-brand-purple">(fills CTA {activeIndex + 1})</span>:</p>
            <div className="flex flex-wrap gap-2">
              {CTA_SUGGESTIONS.map((s) => (
                <Badge key={s} variant="outline" className="bg-white/3 border-border text-muted-foreground hover:bg-brand-purple/10 hover:border-brand-purple/30 hover:text-white cursor-pointer border border-gray-300 transition-colors  px-3 py-1.5" onClick={() => applySuggestion(s)}>{s}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:flex-1 min-w-0 md:sticky md:top-0">
          <PreviewPanel activeLayer="cta" ctaIndex={activeIndex}
            topContent={
              <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg px-4 py-3">
                <div>
                  <h3 className="text-lg font-bold text-black">CTA {activeIndex + 1}</h3>
                  <p className="text-xs text-muted-foreground">Preview & Style</p>
                </div>
                <Button onClick={applyToAll} size="sm" className="gradient-bg text-white border-0 hover:opacity-90 text-sm h-9 px-4">
                  Apply to All
                </Button>
              </div>
            }>
            {/* Templates */}
            <div className="glass-card p-3 sm:p-5 w-full">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Templates</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
                {ctaTemplates.map((tmpl) => {
                  const sel = templates[activeIndex] === tmpl.id;
                  const fn = ctaPreviewStyle[tmpl.style] || ctaPreviewStyle.solid;
                  return (
                    <button key={tmpl.id} onClick={() => updateCtaTemplate(tmpl.id)}
                      className={cn("relative rounded-xl border p-5 text-center transition-all cursor-pointer w-full", sel ? "border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple" : "border-border hover:border-border/80 hover:bg-white/[0.02]")}>
                      <div className="h-32 sm:h-36 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg flex items-center justify-center mb-3 overflow-hidden w-full">
                        <span className={cn("text-base font-bold px-4 py-1.5", `overlay-anim-${tmpl.animation}`)} style={fn(activeColor)}>{tmpl.style}</span>
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
              <h3 className="text-sm font-bold text-black uppercase tracking-wider pb-3">CTA {activeIndex + 1} Style</h3>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Font Color</span><ColorPickerAlpha value={activeColor} onChange={updateCtaColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Font Style</span>
                <Select value={activeFont} onValueChange={(v) => v && updateCtaFont(v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Bold</span>
                <button onClick={toggleCtaBold} className={cn("w-10 h-10 rounded-lg border flex items-center justify-center text-base font-black transition-all", activeBold ? "gradient-bg text-white border-transparent" : "bg-white/5 text-muted-foreground border-border hover:bg-white/10")}>B</button>
              </div>
              <div className="py-3 space-y-1.5"><span className="text-sm font-bold text-black">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={updateCtaBoxColor} /></div>
              <div className="py-3 space-y-1.5">
                <span className="text-sm font-bold text-black">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { updateCtaOutlineColor(c); if (c === "transparent") updateCtaOutlineWidth(0); else if (activeOutlineWidth === 0) updateCtaOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-sm font-bold text-black">Width</span><span className="text-xs text-black font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => updateCtaOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Font Size</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCtaFontSize(Math.max(12, activeFontSize - 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">−</button>
                    <span className="text-sm text-black font-mono w-10 text-center font-bold">{activeFontSize}px</span>
                    <button onClick={() => updateCtaFontSize(Math.min(36, activeFontSize + 1))} className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">+</button>
                  </div>
                </div>
                <Slider value={[activeFontSize]} onValueChange={(v) => updateCtaFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={36} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-3 sm:p-5 space-y-4">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-cyan" /><h3 className="text-sm font-bold text-black uppercase tracking-wider">CTA {activeIndex + 1} Duration & Position</h3></div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">Start (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.ctaStarts?.[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...(wizardState.ctaStarts || [])]; n[activeIndex] = val; updateWizardState({ ctaStarts: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-bold text-black mb-1 block">End (s)</Label>
                  <input type="number" min={0} step={0.5} value={wizardState.ctaEnds?.[activeIndex] ?? 0} onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) return;
                    const n = [...(wizardState.ctaEnds || [])]; n[activeIndex] = val; updateWizardState({ ctaEnds: n });
                  }} className="h-9 text-sm font-mono w-full rounded-lg border border-border bg-transparent px-3 focus:border-brand-purple focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-black">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => { const n = [...(wizardState.ctaXPositions || [])]; n[activeIndex] = opt.value; updateWizardState({ ctaXPositions: n }); }} className={cn("px-3 py-2 text-xs transition-colors", (wizardState.ctaXPositions?.[activeIndex] || "center") === opt.value ? "gradient-bg text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold text-black flex items-center gap-1"><ArrowDownUp className="h-3.5 w-3.5" />Vertical</Label><span className="text-xs text-black font-mono">{wizardState.ctaYPositions?.[activeIndex] ?? 88}%</span></div>
                <Slider value={[wizardState.ctaYPositions?.[activeIndex] ?? 88]} onValueChange={(v) => { const n = [...(wizardState.ctaYPositions || [])]; n[activeIndex] = Array.isArray(v) ? v[0] : v; updateWizardState({ ctaYPositions: n }); }} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
