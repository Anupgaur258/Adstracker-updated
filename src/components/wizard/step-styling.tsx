"use client";

import { useProjectStore } from "@/stores/project-store";
import { FONT_OPTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Type, Palette, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, Subtitles } from "lucide-react";
import { cn } from "@/lib/utils";

type XPos = "left" | "center" | "right";

const xPosOptions: { value: XPos; icon: typeof AlignLeft }[] = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

function XPositionGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: XPos;
  onChange: (v: XPos) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {xPosOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "px-2.5 py-1.5 text-xs transition-colors",
                value === opt.value
                  ? "bg-brand-purple text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepStyling() {
  const { wizardState, updateWizardState } = useProjectStore();
  const styling = wizardState.styling;

  const updateStyling = (updates: Partial<typeof styling>) => {
    updateWizardState({
      styling: { ...styling, ...updates },
    });
  };

  const hookColor = wizardState.hookColors[0] || "#FFFFFF";
  const hookFont = wizardState.hookFonts[0] || styling.fontFamily;
  const ctaColor = wizardState.ctaColors[0] || "#FFFFFF";
  const ctaFont = wizardState.ctaFonts[0] || styling.fontFamily;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Customize Styling</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fine-tune the appearance of your video overlays.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Controls */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Duration Controls */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-brand-purple" />
              <h3 className="font-semibold text-white text-sm">Timing</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Hook Duration</Label>
                <span className="text-xs text-brand-purple font-mono">{styling.hookDuration}s</span>
              </div>
              <Slider
                value={[styling.hookDuration]}
                onValueChange={(v) => updateStyling({ hookDuration: Array.isArray(v) ? v[0] : v })}
                min={1}
                max={10}
                step={0.5}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">CTA Duration</Label>
                <span className="text-xs text-brand-purple font-mono">{styling.ctaDuration}s</span>
              </div>
              <Slider
                value={[styling.ctaDuration]}
                onValueChange={(v) => updateStyling({ ctaDuration: Array.isArray(v) ? v[0] : v })}
                min={1}
                max={10}
                step={0.5}
                className="py-2"
              />
            </div>
          </div>

          {/* Typography Controls */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Type className="h-4 w-4 text-brand-cyan" />
              <h3 className="font-semibold text-white text-sm">Typography</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Family</Label>
              <Select
                value={styling.fontFamily}
                onValueChange={(v) => v && updateStyling({ fontFamily: v })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141832] border-white/10">
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Font Size</Label>
                <span className="text-xs text-brand-cyan font-mono">{styling.fontSize}px</span>
              </div>
              <Slider
                value={[styling.fontSize]}
                onValueChange={(v) => updateStyling({ fontSize: Array.isArray(v) ? v[0] : v })}
                min={14}
                max={48}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Words Per Line</Label>
                <span className="text-xs text-brand-cyan font-mono">{styling.wordsPerLine}</span>
              </div>
              <Slider
                value={[styling.wordsPerLine]}
                onValueChange={(v) => updateStyling({ wordsPerLine: Array.isArray(v) ? v[0] : v })}
                min={2}
                max={8}
                step={1}
                className="py-2"
              />
            </div>
          </div>

          {/* Color & Effects */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-brand-teal" />
              <h3 className="font-semibold text-white text-sm">Colors & Effects</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <ColorPickerAlpha
                value={styling.textColor}
                onChange={(v) => updateStyling({ textColor: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Text Shadow</Label>
              <Switch
                checked={styling.shadowEnabled}
                onCheckedChange={(v) => updateStyling({ shadowEnabled: v })}
              />
            </div>
          </div>

          {/* Subtitle Styling */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Subtitles className="h-4 w-4 text-brand-blue" />
              <h3 className="font-semibold text-white text-sm">Subtitle Styling</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Color</Label>
              <ColorPickerAlpha
                value={styling.subtitleFontColor}
                onChange={(v) => updateStyling({ subtitleFontColor: v })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shadow Color</Label>
              <ColorPickerAlpha
                value={styling.subtitleShadowColor}
                onChange={(v) => updateStyling({ subtitleShadowColor: v })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Shadow Blur</Label>
                <span className="text-xs text-brand-blue font-mono">{styling.subtitleShadowBlur}px</span>
              </div>
              <Slider
                value={[styling.subtitleShadowBlur]}
                onValueChange={(v) => updateStyling({ subtitleShadowBlur: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <ColorPickerAlpha
                value={styling.subtitleBackgroundColor}
                onChange={(v) => updateStyling({ subtitleBackgroundColor: v })}
              />
            </div>
          </div>

          {/* Text Alignment (X-Position) */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <AlignCenter className="h-4 w-4 text-brand-blue" />
              <h3 className="font-semibold text-white text-sm">Text Alignment</h3>
            </div>
            <XPositionGroup
              label="Hook"
              value={styling.hookXPosition}
              onChange={(v) => updateStyling({ hookXPosition: v })}
            />
            <XPositionGroup
              label="Subtitle"
              value={styling.subtitleXPosition}
              onChange={(v) => updateStyling({ subtitleXPosition: v })}
            />
            <XPositionGroup
              label="CTA"
              value={styling.ctaXPosition}
              onChange={(v) => updateStyling({ ctaXPosition: v })}
            />
          </div>

          {/* Y-Position (vertical from top) */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownUp className="h-4 w-4 text-brand-purple" />
              <h3 className="font-semibold text-white text-sm">Vertical Position</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Hook (from top)</Label>
                <span className="text-xs text-brand-purple font-mono">{styling.hookYPosition}%</span>
              </div>
              <Slider
                value={[styling.hookYPosition]}
                onValueChange={(v) => updateStyling({ hookYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Subtitle (from top)</Label>
                <span className="text-xs text-brand-purple font-mono">{styling.subtitleYPosition}%</span>
              </div>
              <Slider
                value={[styling.subtitleYPosition]}
                onValueChange={(v) => updateStyling({ subtitleYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">CTA (from top)</Label>
                <span className="text-xs text-brand-purple font-mono">{styling.ctaYPosition}%</span>
              </div>
              <Slider
                value={[styling.ctaYPosition]}
                onValueChange={(v) => updateStyling({ ctaYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full md:w-[300px] shrink-0 space-y-3 md:sticky md:top-4 h-fit">
          <div className="flex items-center gap-2">
            <AlignCenter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-white text-sm">Preview</h3>
          </div>
          <div className="glass-card aspect-[9/16] max-h-[500px] relative overflow-hidden">
            <div className="bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 absolute inset-0" />

            {/* Hook preview */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.hookYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div
                style={{
                  fontFamily: hookFont,
                  fontSize: `${styling.fontSize * 0.65}px`,
                  color: hookColor,
                  textShadow: styling.shadowEnabled ? "2px 2px 4px rgba(0,0,0,0.8)" : "none",
                  textAlign: styling.hookXPosition,
                }}
              >
                Sample Hook Text
              </div>
            </div>

            {/* Subtitle preview */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.subtitleYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div
                style={{
                  fontFamily: styling.fontFamily,
                  fontSize: `${styling.fontSize * 0.65 * 0.7}px`,
                  color: styling.subtitleFontColor,
                  textShadow: `0 0 ${styling.subtitleShadowBlur}px ${styling.subtitleShadowColor}`,
                  textAlign: styling.subtitleXPosition,
                  backgroundColor: styling.subtitleBackgroundColor !== "transparent" ? styling.subtitleBackgroundColor : undefined,
                  padding: styling.subtitleBackgroundColor !== "transparent" ? "2px 6px" : undefined,
                  borderRadius: styling.subtitleBackgroundColor !== "transparent" ? 4 : undefined,
                  display: "inline-block",
                  width: "100%",
                }}
              >
                Subtitle text appears here
              </div>
            </div>

            {/* CTA preview */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.ctaYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div style={{ textAlign: styling.ctaXPosition }}>
                <span
                  className="inline-block px-6 py-2 rounded-full gradient-bg text-sm font-semibold"
                  style={{
                    fontFamily: ctaFont,
                    color: ctaColor,
                  }}
                >
                  CTA Button
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
