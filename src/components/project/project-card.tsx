"use client";

import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Video, Clock, Trash2, Film, Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const statusConfig = {
  draft: { label: "Draft", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  generating: { label: "Generating", className: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" },
  completed: { label: "Completed", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const router = useRouter();
  const deleteProject = useProjectStore((s) => s.deleteProject);

  const status = statusConfig[project.status];
  const progress = project.totalVideos > 0 ? Math.round((project.completedVideos / project.totalVideos) * 100) : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="glass-card-hover cursor-pointer group relative overflow-hidden"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      {/* Thumbnail - vertical like YouTube Shorts */}
      <div className="aspect-[9/12] bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 relative overflow-hidden rounded-t-[12px]">
        {project.videos[0]?.thumbnail ? (
          <img
            src={project.videos[0].thumbnail}
            alt={project.videos[0].name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-12 w-12 text-brand-purple/30" />
          </div>
        )}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Progress bar */}
        {project.status === "generating" && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
            <div className="h-full gradient-bg transition-all duration-500 relative overflow-hidden" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}
        {project.status === "completed" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-teal" />}
        {project.status === "failed" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />}

        {/* Status badge */}
        <Badge className={cn("absolute top-2.5 right-2.5", status.className)} variant="outline">{status.label}</Badge>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 text-[10px] text-white/80">
            <span className="flex items-center gap-1"><Video className="h-3 w-3" />{project.completedVideos}/{project.totalVideos}</span>
            <span>&middot;</span>
            <span>{project.hooks.length} hooks</span>
            <span>&middot;</span>
            <span>{project.ctas.length} CTAs</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm truncate">{project.name}</h3>
        <p className="text-xs mt-1 truncate">
          {project.status === "generating" && <span className="text-brand-cyan">Generating... {progress}%</span>}
          {project.status === "completed" && <span className="text-brand-teal flex items-center gap-1"><Check className="h-3 w-3" />Completed</span>}
          {project.status === "pending" && <span className="text-amber-400">Queued</span>}
          {project.status === "draft" && <span className="text-muted-foreground">{project.totalVideos} videos planned</span>}
          {project.status === "failed" && <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Failed</span>}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" />{new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Delete button */}
      <div className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={handleDelete}>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="ghost" size="icon" className="h-7 w-7 bg-black/60 hover:bg-red-500/20 text-white/70 hover:text-red-400" />}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{project.name}&quot; and all its generated videos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                onClick={() => { deleteProject(project.id); toast.success("Project deleted"); }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
