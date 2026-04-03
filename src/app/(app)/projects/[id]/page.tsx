"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { useHydration } from "@/hooks/use-hydration";
import { ProgressPipeline } from "@/components/project/progress-pipeline";
import { ProjectFilters, FilterState } from "@/components/project/project-filters";
import { VideoGrid } from "@/components/project/video-grid";
import { VideoPlayerModal } from "@/components/project/video-player-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Sparkles, Video, Type, MousePointerClick, Film, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { GeneratedVideo } from "@/types";
import { subtitleStyles } from "@/data/subtitle-styles";
import Link from "next/link";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  generating: { label: "Generating", className: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" },
  completed: { label: "Completed", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hydrated = useHydration();
  const getProject = useProjectStore((s) => s.getProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const [filters, setFilters] = useState<FilterState>({ videoId: null, hookIndex: null, ctaIndex: null, subtitleStyleId: null });
  const [previewVideo, setPreviewVideo] = useState<GeneratedVideo | null>(null);

  const project = hydrated ? getProject(params.id as string) : undefined;

  // Generate video combinations if they don't exist
  useEffect(() => {
    if (!project || project.generatedVideos.length > 0) return;
    if (project.status === "draft" || project.status === "pending") return;

    const videos: GeneratedVideo[] = [];
    let videoIndex = 0;

    for (const video of project.videos) {
      for (let hi = 0; hi < project.hooks.length; hi++) {
        for (let ci = 0; ci < project.ctas.length; ci++) {
          for (const sid of project.subtitleStyles) {
            const styleName = subtitleStyles.find((s) => s.id === sid)?.name ?? sid;
            const isCompleted = videoIndex < project.completedVideos;
            videos.push({
              id: `gv-${project.id}-${videoIndex}`,
              projectId: project.id,
              videoSourceId: video.id,
              hookIndex: hi,
              ctaIndex: ci,
              subtitleStyleId: sid,
              status: isCompleted ? "completed" : project.status === "generating" ? "processing" : "pending",
              label: `${video.name} + Hook ${hi + 1} + ${project.ctas[ci]} + ${styleName}`,
              thumbnail: video.thumbnail,
              outputUrl: video.url,
            });
            videoIndex++;
          }
        }
      }
    }

    updateProject(project.id, { generatedVideos: videos });
  }, [project, updateProject]);

  const filteredVideos = useMemo(() => {
    if (!project) return [];
    return project.generatedVideos.filter((v) => {
      if (filters.videoId && v.videoSourceId !== filters.videoId) return false;
      if (filters.hookIndex !== null && v.hookIndex !== filters.hookIndex) return false;
      if (filters.ctaIndex !== null && v.ctaIndex !== filters.ctaIndex) return false;
      if (filters.subtitleStyleId && v.subtitleStyleId !== filters.subtitleStyleId) return false;
      return true;
    });
  }, [project, filters]);

  if (!hydrated) return <div className="glass-card h-96 animate-pulse" />;

  if (!project) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button render={<Link href="/dashboard" />} variant="outline" className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const status = statusConfig[project.status];
  const hasCompletedVideos = project.completedVideos > 0;

  const stats = [
    { label: "Source Videos", value: project.videos.length, icon: Video },
    { label: "Hooks", value: project.hooks.length, icon: Type },
    { label: "CTAs", value: project.ctas.length, icon: MousePointerClick },
    { label: "Output Videos", value: `${project.completedVideos}/${project.totalVideos}`, icon: Film },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mt-0.5 text-muted-foreground hover:text-white cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{project.name}</h1>
              <Badge className={status.className} variant="outline">{status.label}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(project.status === "draft" || project.status === "pending") && (
            <Button className="gradient-bg text-white border-0 hover:opacity-90 gap-2 cursor-pointer" onClick={() => updateProject(project.id, { status: "generating" })}>
              <Sparkles className="h-4 w-4" /> Start Generation
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-purple" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-white">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pipeline */}
      {(project.status === "pending" || project.status === "generating" || project.status === "completed" || project.status === "failed") && (
        <ProgressPipeline completedVideos={project.completedVideos} totalVideos={project.totalVideos} status={project.status} />
      )}

      {/* Videos */}
      {hasCompletedVideos ? (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <ProjectFilters project={project} filters={filters} onFilterChange={setFilters} />
            <p className="text-xs text-muted-foreground">Showing {filteredVideos.length} of {project.generatedVideos.length}</p>
          </div>
          <VideoGrid videos={filteredVideos} sourceVideos={project.videos} onPreview={(v) => setPreviewVideo(v)} />
        </>
      ) : (
        <>
          {(project.status === "draft" || project.status === "pending") && (
            <Card className="bg-card border-border p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.status === "pending" ? "Queued" : "Ready to Generate"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.totalVideos} video combinations configured.</p>
                </div>
                <Button className="gradient-bg text-white border-0 hover:opacity-90 gap-2 cursor-pointer" onClick={() => updateProject(project.id, { status: "generating" })}>
                  <Sparkles className="h-4 w-4" /> Start Generation
                </Button>
              </div>
            </Card>
          )}
          {project.status === "generating" && (
            <Card className="bg-card border-border p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                <Loader2 className="h-10 w-10 text-brand-cyan animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Processing Videos</h3>
                  <p className="text-sm text-muted-foreground mt-1">Completed videos will appear here shortly.</p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={previewVideo}
        project={project}
        open={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}
