"use client";

import { useState, useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import { demoVideos } from "@/data/demo-videos";
import { LIMITS, ACCEPTED_VIDEO_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UploadedVideo } from "@/types";
import { Check, Play, Upload, X, FileVideo, AlertCircle, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROJECT_NAME_MAX = 50;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Demo";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateThumbnail(file: File): Promise<{ thumbnailUrl: string; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.onloadedmetadata = () => { video.currentTime = Math.min(1, video.duration / 2); };
    video.onseeked = () => {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
      URL.revokeObjectURL(objectUrl);
      resolve({ thumbnailUrl, duration: Math.round(video.duration) });
    };
    video.onerror = () => { URL.revokeObjectURL(objectUrl); resolve({ thumbnailUrl: "", duration: 0 }); };
  });
}

export function StepVideos() {
  const { wizardState, updateWizardState } = useProjectStore();
  const videos = wizardState.videos;
  const projectName = wizardState.projectName || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState("");
  const [videoError, setVideoError] = useState("");

  // Listen for validation trigger from wizard
  useEffect(() => {
    const handler = () => {
      if (!projectName.trim()) setNameError("Project name is required");
      if (videos.length === 0) setVideoError("Please upload at least 1 video");
    };
    window.addEventListener("wizard-validate", handler);
    return () => window.removeEventListener("wizard-validate", handler);
  }, [projectName, videos.length]);

  const updateProjectName = (value: string) => {
    if (value.length > PROJECT_NAME_MAX) return;
    updateWizardState({ projectName: value });
    if (value.trim()) setNameError("");
  };

  const addVideo = useCallback(
    (video: UploadedVideo) => {
      if (videos.length >= LIMITS.maxVideos) {
        toast.error(`Maximum ${LIMITS.maxVideos} videos allowed`);
        return;
      }
      updateWizardState({ videos: [...videos, video] });
      setVideoError("");
    },
    [videos, updateWizardState]
  );

  const removeVideo = useCallback(
    (id: string) => {
      const video = videos.find((v) => v.id === id);
      if (video) {
        if (video.objectUrl.startsWith("blob:")) URL.revokeObjectURL(video.objectUrl);
        if (video.thumbnailUrl.startsWith("blob:")) URL.revokeObjectURL(video.thumbnailUrl);
      }
      const remaining = videos.filter((v) => v.id !== id);
      updateWizardState({ videos: remaining });
      if (remaining.length === 0) setVideoError("Please upload at least 1 video");
    },
    [videos, updateWizardState]
  );

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const remaining = LIMITS.maxVideos - videos.length;
      if (remaining <= 0) { toast.error(`Maximum ${LIMITS.maxVideos} videos allowed`); return; }
      for (const file of fileArr.slice(0, remaining)) {
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type as typeof ACCEPTED_VIDEO_TYPES[number])) {
          toast.error(`"${file.name}" is not a supported format. Use MP4, MOV, or WebM.`);
          continue;
        }
        const objectUrl = URL.createObjectURL(file);
        const { thumbnailUrl, duration } = await generateThumbnail(file);
        addVideo({ id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: file.name, size: file.size, type: file.type, objectUrl, thumbnailUrl, duration });
      }
    },
    [videos.length, addVideo]
  );

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); processFiles(e.dataTransfer.files); }, [processFiles]);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) processFiles(e.target.files); e.target.value = ""; }, [processFiles]);
  const toggleDemoVideo = useCallback((demo: UploadedVideo) => {
    videos.some((v) => v.id === demo.id) ? removeVideo(demo.id) : addVideo(demo);
  }, [videos, addVideo, removeVideo]);

  return (
    <div className="space-y-5 w-full">
      {/* Project Name */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <FolderOpen className="h-5 w-5 text-brand-purple" />
          <h2 className="text-lg sm:text-xl font-bold text-black">Project Name <span className="text-red-400">*</span></h2>
        </div>
        <div className="relative">
          <Input
            value={projectName}
            onChange={(e) => updateProjectName(e.target.value)}
            placeholder="e.g., Summer Sale Campaign"
            maxLength={PROJECT_NAME_MAX}
            className={cn("bg-white/5 border-white/10 focus:border-brand-purple pr-16", nameError && "border-red-500/50 ring-1 ring-red-500/20")}
            onBlur={() => { if (!projectName.trim()) setNameError("Project name is required"); }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{projectName.length}/{PROJECT_NAME_MAX}</span>
        </div>
        {nameError && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" />{nameError}</p>}
      </div>

      {/* Video section header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-black">Select Videos <span className="text-red-400">*</span></h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your own or choose demo videos.{" "}
          <span className="text-black font-medium">{videos.length}/{LIMITS.maxVideos} selected</span>
        </p>
        {videoError && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" />{videoError}</p>}
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer group",
          videoError ? "border-red-500/30 hover:border-red-500/50" : "border-white/10 hover:border-brand-purple/40"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" multiple onChange={handleFileSelect} className="hidden" />
        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-3 group-hover:text-brand-purple transition-colors" />
        <p className="text-sm text-white font-medium">Drag & drop or browse files</p>
        <p className="text-xs text-muted-foreground mt-1">MP4, MOV, or WebM · 9:16 vertical recommended</p>
      </div>

      {/* Selected videos */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Your Videos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 px-1">
            {videos.map((video, index) => (
              <motion.div key={video.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }}
                className="glass-card relative group">
                <div className="aspect-[9/14] bg-zinc-900 relative overflow-hidden rounded-t-[11px]">
                  {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt={video.name} className="absolute inset-0 w-full h-full object-cover" />
                    : <div className="absolute inset-0 flex items-center justify-center"><FileVideo className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" /></div>}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-2">
                  <p className="text-xs sm:text-xs font-medium text-white truncate">{video.name}</p>
                  <p className="text-xs sm:text-xs text-muted-foreground mt-0.5">{video.duration}s · {formatFileSize(video.size)}</p>
                </div>
                <button onClick={() => removeVideo(video.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/60 hover:bg-red-500/80 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Demo videos */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Or use demo videos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 px-1">
          {demoVideos.slice(0, 5).map((demo, index) => {
            const isSelected = videos.some((v) => v.id === demo.id);
            return (
              <motion.button key={demo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                onClick={() => toggleDemoVideo(demo)}
                className={cn("glass-card-hover relative text-left group", isSelected && "ring-2 ring-brand-purple")}>
                <div className="aspect-[9/14] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 relative overflow-hidden rounded-t-[11px]">
                  {demo.thumbnailUrl && <img src={demo.thumbnailUrl} alt={demo.name} className="absolute inset-0 w-full h-full object-cover" />}
                  <video src={demo.objectUrl} poster={demo.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover z-[2]" muted loop playsInline preload="none"
                    onMouseOver={(e) => { (e.target as HTMLVideoElement).play().catch(() => {}); }}
                    onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-[3] pointer-events-none" />
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 text-white/60 z-[4] group-hover:opacity-0 transition-opacity pointer-events-none" />
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-[5] pointer-events-none gradient-bg group-hover:bg-red-500">
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white group-hover:hidden" />
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white hidden group-hover:block" />
                    </motion.div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-white text-xs sm:text-xs">{demo.name}</h3>
                  <p className="text-xs sm:text-xs text-muted-foreground mt-0.5">{demo.duration}s</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
