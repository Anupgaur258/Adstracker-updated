"use client";

import { GeneratedVideo, VideoSource } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Download, RotateCw, Film } from "lucide-react";
import { motion } from "framer-motion";

const statusConfig = {
  pending: { label: "Pending", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  processing: { label: "Processing", className: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" },
  completed: { label: "Done", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function VideoCard({
  video,
  sourceVideo,
  index = 0,
  onPreview,
}: {
  video: GeneratedVideo;
  sourceVideo?: VideoSource;
  index?: number;
  onPreview?: (video: GeneratedVideo) => void;
}) {
  const status = statusConfig[video.status];
  const thumbUrl = sourceVideo?.thumbnail || video.thumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
      className="glass-card-hover overflow-hidden group cursor-pointer"
      onClick={() => video.status === "completed" && onPreview?.(video)}
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 relative overflow-hidden">
        {/* Show actual video thumbnail */}
        {thumbUrl ? (
          <img src={thumbUrl} alt={video.label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-8 w-8 text-brand-purple/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <Badge className={cn("absolute top-2 right-2 text-[10px]", status.className)} variant="outline">
          {status.label}
        </Badge>

        {video.status === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onPreview?.(video); }}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}

        {video.status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
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
