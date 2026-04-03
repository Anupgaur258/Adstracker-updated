"use client";

import { GeneratedVideo, Project } from "@/types";
import { subtitleStyles } from "@/data/subtitle-styles";
import { ctaTemplates } from "@/data/cta-templates";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ctaPreviewStyle: Record<string, (c: string) => React.CSSProperties> = {
  solid: () => ({ background: "#3B82F6", borderRadius: 6, color: "#fff" }),
  outline: (c) => ({ border: `2px solid ${c}`, borderRadius: 6, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff" }),
};

interface Props {
  video: GeneratedVideo | null;
  project: Project;
  open: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ video, project, open, onClose }: Props) {
  if (!video) return null;

  const sourceVideo = project.videos.find((v) => v.id === video.videoSourceId);
  const videoUrl = sourceVideo?.url || "";
  const hookText = project.hooks[video.hookIndex] || "";
  const ctaText = project.ctas[video.ctaIndex] || "";
  const hookColor = project.hookColors?.[video.hookIndex] || "#FFF";
  const hookFont = project.hookFonts?.[video.hookIndex] || "Inter";
  const hookFontSize = project.hookFontSizes?.[video.hookIndex] || 28;
  const hookBoxColor = project.hookBoxColors?.[video.hookIndex] || "transparent";
  const ctaColor = project.ctaColors?.[video.ctaIndex] || "#FFF";
  const ctaFont = project.ctaFonts?.[video.ctaIndex] || "Inter";
  const ctaTmpl = ctaTemplates.find((t) => t.id === project.ctaTemplates?.[video.ctaIndex]);
  const ctaStyleFn = ctaPreviewStyle[ctaTmpl?.style || "solid"] || ctaPreviewStyle.solid;
  const sub = subtitleStyles.find((s) => s.id === video.subtitleStyleId);
  const styling = project.styling;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm sm:max-w-md overflow-hidden">
        <DialogTitle className="sr-only">Video Preview</DialogTitle>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 z-50 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-colors">
          <X className="h-4 w-4" />
        </button>

        {/* Video container - 9:16 aspect */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
          {/* Video */}
          {videoUrl ? (
            <video
              key={video.id}
              src={videoUrl}
              poster={sourceVideo?.thumbnail}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-white/40">Video not available</p>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Hook */}
            <div className="absolute left-0 right-0 px-4" style={{ top: `${styling.hookYPosition}%`, transform: "translateY(-50%)", textAlign: styling.hookXPosition }}>
              <p className="font-semibold leading-tight inline-block max-w-full break-words" style={{
                color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.7, 24)}px`,
                textShadow: "1px 2px 8px rgba(0,0,0,0.9)",
                ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "4px 10px", borderRadius: 6 }),
              }}>{hookText}</p>
            </div>

            {/* Subtitle */}
            {sub && (
              <div className="absolute left-0 right-0 px-4" style={{ top: `${styling.subtitleYPosition}%`, transform: "translateY(-50%)", textAlign: styling.subtitleXPosition }}>
                <p className="leading-tight inline-block" style={{
                  fontFamily: sub.fontFamily, fontSize: "14px", color: sub.color,
                  backgroundColor: sub.backgroundColor !== "transparent" ? sub.backgroundColor : undefined,
                  padding: sub.backgroundColor !== "transparent" ? "3px 10px" : undefined, borderRadius: 4,
                  textShadow: "1px 1px 4px rgba(0,0,0,0.9)",
                }}>{sub.preview}</p>
              </div>
            )}

            {/* CTA */}
            <div className="absolute left-0 right-0 px-4" style={{ top: `${styling.ctaYPosition}%`, transform: "translateY(-50%)", textAlign: styling.ctaXPosition }}>
              <span className="inline-block px-4 py-2 font-semibold" style={{ ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: "14px" }}>{ctaText}</span>
            </div>
          </div>

          {/* Label at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[11px] text-white/80 line-clamp-2">{video.label}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
