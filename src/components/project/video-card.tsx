"use client";

import { GeneratedVideo, VideoSource, Project } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Download, RotateCw, Film } from "lucide-react";
import { motion } from "framer-motion";
import { subtitleStyles } from "@/data/subtitle-styles";
import { ctaTemplates } from "@/data/cta-templates";

const ctaPreviewStyle: Record<string, (c: string) => React.CSSProperties> = {
  solid: () => ({ background: "#3B82F6", borderRadius: 4, color: "#fff" }),
  outline: (c) => ({ border: `1px solid ${c}`, borderRadius: 4, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#fff" }),
};

const statusConfig = {
  pending: { label: "Pending", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  processing: { label: "Processing", className: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" },
  completed: { label: "Done", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function VideoCard({
  video,
  sourceVideo,
  project,
  index = 0,
  onPreview,
}: {
  video: GeneratedVideo;
  sourceVideo?: VideoSource;
  project?: Project;
  index?: number;
  onPreview?: (video: GeneratedVideo) => void;
}) {
  const status = statusConfig[video.status];
  const thumbUrl = sourceVideo?.thumbnail || video.thumbnail;

  // Styled overlays from project data
  const hookText = project?.hooks?.[video.hookIndex] || "";
  const hookColor = project?.hookColors?.[video.hookIndex] || "#FFF";
  const hookFont = project?.hookFonts?.[video.hookIndex] || "Inter";
  const hookFontSize = project?.hookFontSizes?.[video.hookIndex] || 28;
  const hookBold = project?.hookBolds?.[video.hookIndex] || false;
  const hookBoxColor = project?.hookBoxColors?.[video.hookIndex] || "transparent";
  const hookYPos = project?.hookYPositions?.[video.hookIndex] ?? project?.styling?.hookYPosition ?? 8;
  const hookXPos = project?.hookXPositions?.[video.hookIndex] || project?.styling?.hookXPosition || "center";

  const hookBodyText = project?.hookBodies?.[video.hookIndex]?.trim() || "";
  const hookBodyColor = project?.hookBodyColors?.[video.hookIndex] || "#FFF";
  const hookBodyFont = project?.hookBodyFonts?.[video.hookIndex] || "Inter";
  const hookBodyFontSize = project?.hookBodyFontSizes?.[video.hookIndex] || 22;
  const hookBodyBold = project?.hookBodyBolds?.[video.hookIndex] || false;
  const hookBodyYPos = project?.hookBodyYPositions?.[video.hookIndex] ?? project?.styling?.hookBodyYPosition ?? 30;

  const ctaText = project?.ctas?.[video.ctaIndex] || "";
  const ctaColor = project?.ctaColors?.[video.ctaIndex] || "#FFF";
  const ctaFont = project?.ctaFonts?.[video.ctaIndex] || "Inter";
  const ctaFontSize = project?.ctaFontSizes?.[video.ctaIndex] || 20;
  const ctaBold = project?.ctaBolds?.[video.ctaIndex] || false;
  const ctaTmpl = ctaTemplates.find((t) => t.id === project?.ctaTemplates?.[video.ctaIndex]);
  const ctaStyleFn = ctaPreviewStyle[ctaTmpl?.style || "solid"] || ctaPreviewStyle.solid;
  const ctaYPos = project?.ctaYPositions?.[video.ctaIndex] ?? project?.styling?.ctaYPosition ?? 88;

  const sub = subtitleStyles.find((s) => s.id === video.subtitleStyleId);
  const subYPos = project?.styling?.subtitleYPosition ?? 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
      className="glass-card-hover overflow-hidden group cursor-pointer"
      onClick={() => video.status === "completed" && onPreview?.(video)}
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 relative overflow-hidden">
        {thumbUrl ? (
          <img src={thumbUrl} alt={video.label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-8 w-8 text-brand-purple/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Styled overlays on thumbnail */}
        {project && (
          <div className="absolute inset-0 pointer-events-none">
            {hookText && (
              <div className="absolute left-0 right-0 px-2" style={{ top: `${hookYPos}%`, transform: "translateY(-50%)", textAlign: hookXPos as React.CSSProperties["textAlign"] }}>
                <p className="leading-tight max-w-full break-words" style={{ color: hookColor, fontFamily: hookFont, fontSize: `${Math.min(hookFontSize * 0.3, 11)}px`, fontWeight: hookBold ? 800 : 600, textShadow: "1px 1px 3px rgba(0,0,0,0.9)", ...(hookBoxColor !== "transparent" && { backgroundColor: hookBoxColor, padding: "2px 4px", borderRadius: 2 }) }}>{hookText}</p>
              </div>
            )}
            {hookBodyText && (
              <div className="absolute left-0 right-0 px-2" style={{ top: `${hookBodyYPos}%`, transform: "translateY(-50%)" }}>
                <p className="leading-tight max-w-full break-words" style={{ color: hookBodyColor, fontFamily: hookBodyFont, fontSize: `${Math.min(hookBodyFontSize * 0.3, 10)}px`, fontWeight: hookBodyBold ? 800 : 400, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{hookBodyText}</p>
              </div>
            )}
            {sub && (
              <div className="absolute left-0 right-0 px-2" style={{ top: `${subYPos}%`, transform: "translateY(-50%)" }}>
                <p className="leading-tight" style={{ fontFamily: sub.fontFamily, fontSize: "7px", color: sub.color, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{sub.preview}</p>
              </div>
            )}
            {ctaText && (
              <div className="absolute left-0 right-0 px-2" style={{ top: `${ctaYPos}%`, transform: "translateY(-50%)" }}>
                <span className="inline-block px-2 py-0.5" style={{ ...ctaStyleFn(ctaColor), fontFamily: ctaFont, fontSize: `${Math.min(ctaFontSize * 0.3, 9)}px`, fontWeight: ctaBold ? 800 : 600 }}>{ctaText}</span>
              </div>
            )}
          </div>
        )}

        <Badge className={cn("absolute top-2 right-2 text-[10px] z-10", status.className)} variant="outline">
          {status.label}
        </Badge>

        {video.status === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
            <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onPreview?.(video); }}>
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              onClick={(e) => { e.stopPropagation(); }}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}

        {video.status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
            <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white gap-1.5 cursor-pointer">
              <RotateCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-xs text-muted-foreground line-clamp-2">{video.label}</p>
      </div>
    </motion.div>
  );
}
