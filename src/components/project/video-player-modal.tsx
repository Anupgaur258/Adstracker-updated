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
  const hookBold = project.hookBolds?.[video.hookIndex] || false;
  const hookOutlineColor = project.hookOutlineColors?.[video.hookIndex] || "transparent";
  const hookOutlineWidth = project.hookOutlineWidths?.[video.hookIndex] || 0;
  const hookBodyText = project.hookBodies?.[video.hookIndex]?.trim() || "";
  const hookBodyColor = project.hookBodyColors?.[video.hookIndex] || "#FFF";
  const hookBodyFont = project.hookBodyFonts?.[video.hookIndex] || "Inter";
  const hookBodyFontSize = project.hookBodyFontSizes?.[video.hookIndex] || 22;
  const hookBodyBold = project.hookBodyBolds?.[video.hookIndex] || false;
  const hookBodyBoxColor = project.hookBodyBoxColors?.[video.hookIndex] || "transparent";
  const ctaColor = project.ctaColors?.[video.ctaIndex] || "#FFF";
  const ctaFont = project.ctaFonts?.[video.ctaIndex] || "Inter";
  const ctaFontSize = project.ctaFontSizes?.[video.ctaIndex] || 20;
  const ctaBold = project.ctaBolds?.[video.ctaIndex] || false;
  const ctaBoxColor = project.ctaBoxColors?.[video.ctaIndex] || "transparent";
  const ctaTmpl = ctaTemplates.find((t) => t.id === project.ctaTemplates?.[video.ctaIndex]);
  const ctaStyleFn = ctaPreviewStyle[ctaTmpl?.style || "solid"] || ctaPreviewStyle.solid;
  const sub = subtitleStyles.find((s) => s.id === video.subtitleStyleId);
  const styling = project.styling;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[calc(100vw-2rem)] sm:max-w-sm md:max-w-md overflow-visible mx-auto" showCloseButton={false}>
        <DialogTitle className="sr-only">Video Preview</DialogTitle>
        {/* Close button */}
        <button onClick={onClose} className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 z-[100] w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-lg hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition-colors border border-gray-200">
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
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
            <div className="absolute left-0 right-0 px-4" style={{ top: `${project.hookYPositions?.[video.hookIndex] ?? styling.hookYPosition}%`, transform: "translateY(-50%)", textAlign: (project.hookXPositions?.[video.hookIndex] || styling.hookXPosition) as React.CSSProperties["textAlign"] }}>
              <p className="font-semibold leading-tight max-w-full break-words" style={{
                color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.7, 24)}px`,
                fontWeight: hookBold ? 800 : 600,
                textShadow: "1px 2px 8px rgba(0,0,0,0.9)",
                ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "4px 10px", borderRadius: 6 }),
                ...(hookOutlineColor !== "transparent" && hookOutlineWidth > 0 && { WebkitTextStroke: `${hookOutlineWidth * 0.5}px ${hookOutlineColor}` }),
              }}>{hookText}</p>
            </div>

            {/* Hook Body */}
            {hookBodyText && (
              <div className="absolute left-0 right-0 px-4" style={{ top: `${project.hookBodyYPositions?.[video.hookIndex] ?? styling.hookBodyYPosition}%`, transform: "translateY(-50%)", textAlign: (project.hookBodyXPositions?.[video.hookIndex] || styling.hookBodyXPosition) as React.CSSProperties["textAlign"] }}>
                <p className="leading-tight max-w-full break-words" style={{
                  color: hookBodyColor, fontFamily: hookBodyFont, fontSize: `${Math.min(hookBodyFontSize * 0.7, 22)}px`,
                  fontWeight: hookBodyBold ? 800 : 400,
                  textShadow: "1px 1px 6px rgba(0,0,0,0.9)",
                  ...(hookBodyBoxColor !== "transparent" && { backgroundColor: hookBodyBoxColor, padding: "4px 10px", borderRadius: 6 }),
                }}>{hookBodyText}</p>
              </div>
            )}

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
            <div className="absolute left-0 right-0 px-4" style={{ top: `${project.ctaYPositions?.[video.ctaIndex] ?? styling.ctaYPosition}%`, transform: "translateY(-50%)", textAlign: (project.ctaXPositions?.[video.ctaIndex] || styling.ctaXPosition) as React.CSSProperties["textAlign"] }}>
              <span className="inline-block px-4 py-2 font-semibold" style={{
                ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: `${Math.min(ctaFontSize * 0.7, 18)}px`,
                fontWeight: ctaBold ? 800 : 600,
                ...(ctaBoxColor !== "transparent" && { background: ctaBoxColor, borderRadius: 6 }),
              }}>{ctaText}</span>
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
