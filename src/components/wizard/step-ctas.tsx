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
import { MousePointerClick, Check, AlertCircle, Clock, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, X, Plus, Copy } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

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
    if (ctas.length <= 1) { toast.error("At least 1 CTA is required", { closeButton: true }); return; }
    const rm = (arr: string[]) => arr.filter((_, idx) => idx !== i);
    const rmN = (arr: number[]) => arr.filter((_, idx) => idx !== i);
    updateWizardState({
      ctas: rm(ctas), ctaTemplates: rm(templates), ctaColors: rm(ctaColors),
      ctaFonts: rm(ctaFonts), ctaFontSizes: rmN(ctaFontSizes), ctaBoxColors: rm(ctaBoxColors),
      ctaOutlineColors: rm(ctaOutlineColors), ctaOutlineWidths: rmN(ctaOutlineWidths),
    });
    if (activeIndex >= ctas.length - 1) setActiveIndex(Math.max(0, ctas.length - 2));
    toast.success("CTA removed", { closeButton: true });
  };

  const addCta = () => {
    if (ctas.length >= LIMITS.maxCtas) { toast.error(`Maximum ${LIMITS.maxCtas} CTAs allowed`, { closeButton: true }); return; }
    updateWizardState({
      ctas: [...ctas, ""], ctaTemplates: [...templates, "ct1"], ctaColors: [...ctaColors, "#FFFFFF"],
      ctaFonts: [...ctaFonts, "Inter"], ctaFontSizes: [...ctaFontSizes, 20], ctaBoxColors: [...ctaBoxColors, "transparent"],
      ctaOutlineColors: [...ctaOutlineColors, "transparent"], ctaOutlineWidths: [...ctaOutlineWidths, 0],
    });
    setActiveIndex(ctas.length);
  };

  const applyToAll = () => {
    const color = ctaColors[activeIndex] || "#FFFFFF";
    const font = ctaFonts[activeIndex] || "Inter";
    const size = ctaFontSizes[activeIndex] || 20;
    const box = ctaBoxColors[activeIndex] || "transparent";
    const outline = ctaOutlineColors[activeIndex] || "transparent";
    const outlineW = ctaOutlineWidths[activeIndex] || 0;
    const tmpl = templates[activeIndex] || "ct1";
    updateWizardState({
      ctaColors: ctas.map(() => color), ctaFonts: ctas.map(() => font), ctaFontSizes: ctas.map(() => size),
      ctaBoxColors: ctas.map(() => box), ctaOutlineColors: ctas.map(() => outline), ctaOutlineWidths: ctas.map(() => outlineW),
      ctaTemplates: ctas.map(() => tmpl),
    });
    toast.success("Style applied to all CTAs", { closeButton: true });
  };

  const applySuggestion = (s: string) => {
    updateCta(activeIndex, s);
    toast.success(`Applied "${s}" to CTA ${activeIndex + 1}`, { closeButton: true });
  };

  const updateCtaTemplate = (id: string) => { const n = [...templates]; n[activeIndex] = id; updateWizardState({ ctaTemplates: n }); };
  const updateCtaColor = (c: string) => { const n = [...ctaColors]; n[activeIndex] = c; updateWizardState({ ctaColors: n }); };
  const updateCtaFont = (f: string) => { const n = [...ctaFonts]; n[activeIndex] = f; updateWizardState({ ctaFonts: n }); };
  const updateCtaFontSize = (s: number) => { const n = [...ctaFontSizes]; n[activeIndex] = s; updateWizardState({ ctaFontSizes: n }); };
  const updateCtaBoxColor = (c: string) => { const n = [...ctaBoxColors]; n[activeIndex] = c; updateWizardState({ ctaBoxColors: n }); };
  const updateCtaOutlineColor = (c: string) => { const n = [...ctaOutlineColors]; n[activeIndex] = c; updateWizardState({ ctaOutlineColors: n }); };
  const updateCtaOutlineWidth = (w: number) => { const n = [...ctaOutlineWidths]; n[activeIndex] = w; updateWizardState({ ctaOutlineWidths: n }); };

  const filledCount = ctas.filter((c) => c.trim().length > 0).length;
  const activeColor = ctaColors[activeIndex] || "#FFFFFF";
  const activeFont = ctaFonts[activeIndex] || "Inter";
  const activeFontSize = ctaFontSizes[activeIndex] || 20;
  const activeBoxColor = ctaBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = ctaOutlineColors[activeIndex] || "transparent";
  const activeOutlineWidth = ctaOutlineWidths[activeIndex] || 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">Add CTAs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {LIMITS.maxCtas} CTAs (min 1).{" "}
          <span className="text-brand-purple font-medium">{filledCount}/{ctas.length}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* LEFT */}
        <div className="flex-1 min-w-0 space-y-3 lg:pr-6">
          {ctas.map((cta, index) => (
            <div key={index} onClick={() => setActiveIndex(index)}
              className={cn("w-full text-left rounded-xl border p-3 transition-all cursor-pointer", activeIndex === index ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-border/80")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0", activeIndex === index ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                <span className="text-xs text-muted-foreground flex-1">CTA {index + 1}</span>
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{cta.length}/{LIMITS.ctaMaxChars}</span>
              </div>
              {validationErrors[index] && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{validationErrors[index]}</p>}
            </div>
          ))}

          {/* Add CTA button */}
          {ctas.length < LIMITS.maxCtas && (
            <Button onClick={addCta} className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10">
              <Plus className="h-4 w-4" /> Add CTA ({ctas.length}/{LIMITS.maxCtas})
            </Button>
          )}

          {/* Quick suggestions */}
          <div className="pt-1">
            <p className="text-[11px] text-muted-foreground mb-1.5">Quick suggestions <span className="text-brand-purple">(fills CTA {activeIndex + 1})</span>:</p>
            <div className="flex flex-wrap gap-1.5">
              {CTA_SUGGESTIONS.map((s) => (
                <Badge key={s} variant="outline" className="hover:bg-brand-purple/10 hover:border-brand-purple/20 cursor-pointer transition-colors text-[11px]" onClick={() => applySuggestion(s)}>{s}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 min-w-0 lg:pl-4 mt-4 lg:mt-0 space-y-3">
          <PreviewPanel activeLayer="cta" ctaIndex={activeIndex}>
            {/* Apply to All */}
            {ctas.length > 1 && (
              <Button onClick={applyToAll} variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Copy className="h-3.5 w-3.5" /> Apply Style to All CTAs
              </Button>
            )}
            {/* Templates */}
            <div className="glass-card p-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Templates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ctaTemplates.map((tmpl) => {
                  const sel = templates[activeIndex] === tmpl.id;
                  const fn = ctaPreviewStyle[tmpl.style] || ctaPreviewStyle.solid;
                  return (
                    <button key={tmpl.id} onClick={() => updateCtaTemplate(tmpl.id)}
                      className={cn("relative rounded-lg border p-2 text-center transition-all cursor-pointer", sel ? "border-brand-purple bg-brand-purple/10 ring-1 ring-brand-purple" : "border-border hover:border-border/80")}>
                      <div className="h-10 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded flex items-center justify-center mb-1.5 overflow-hidden">
                        <span className={cn("text-[8px] font-semibold px-2 py-0.5", `overlay-anim-${tmpl.animation}`)} style={fn(activeColor)}>{tmpl.style}</span>
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
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">CTA {activeIndex + 1} Style</h3>
              <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Font Color</span><ColorPickerAlpha value={activeColor} onChange={updateCtaColor} /></div>
              <Select value={activeFont} onValueChange={(v) => v && updateCtaFont(v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="text-sm"><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
              </Select>
              <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Box Color</span><ColorPickerAlpha value={activeBoxColor} onChange={updateCtaBoxColor} /></div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Text Outline</span>
                <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => { updateCtaOutlineColor(c); if (c === "transparent") updateCtaOutlineWidth(0); else if (activeOutlineWidth === 0) updateCtaOutlineWidth(1); }} />
                {activeOutlineColor !== "transparent" && (<><div className="flex items-center justify-between mt-1"><span className="text-[10px] text-muted-foreground">Width</span><span className="text-[10px] text-brand-purple font-mono">{activeOutlineWidth}px</span></div><Slider value={[activeOutlineWidth]} onValueChange={(v) => updateCtaOutlineWidth(Array.isArray(v) ? v[0] : v)} min={1} max={5} step={0.5} className="py-1" /></>)}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Font Size</span><span className="text-xs text-brand-purple font-mono">{activeFontSize}px</span></div>
                <Slider value={[activeFontSize]} onValueChange={(v) => updateCtaFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={36} step={1} className="py-1" />
              </div>
            </div>
            {/* Duration & Position */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-cyan" /><h3 className="text-xs font-semibold text-white uppercase tracking-wider">Duration & Position</h3></div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-xs text-muted-foreground">Duration</Label><span className="text-xs text-brand-cyan font-mono">{wizardState.styling.ctaDuration}s</span></div>
                <Slider value={[wizardState.styling.ctaDuration]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, ctaDuration: Array.isArray(v) ? v[0] : v } })} min={1} max={10} step={0.5} className="py-1" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Horizontal</Label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {xPosOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} onClick={() => updateWizardState({ styling: { ...wizardState.styling, ctaXPosition: opt.value } })} className={cn("px-2.5 py-1.5 text-xs transition-colors", wizardState.styling.ctaXPosition === opt.value ? "bg-brand-purple text-white" : "text-muted-foreground hover:bg-muted")}><Icon className="h-3.5 w-3.5" /></button>); })}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><Label className="text-xs text-muted-foreground flex items-center gap-1"><ArrowDownUp className="h-3 w-3" />Vertical</Label><span className="text-xs text-brand-cyan font-mono">{wizardState.styling.ctaYPosition}%</span></div>
                <Slider value={[wizardState.styling.ctaYPosition]} onValueChange={(v) => updateWizardState({ styling: { ...wizardState.styling, ctaYPosition: Array.isArray(v) ? v[0] : v } })} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
