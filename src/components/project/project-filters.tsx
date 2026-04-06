"use client";

import { Project } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { subtitleStyles } from "@/data/subtitle-styles";

interface FilterState {
  videoId: string | null;
  hookIndex: number | null;
  bodyIndex: number | null;
  ctaIndex: number | null;
  subtitleStyleId: string | null;
}

export function ProjectFilters({
  project,
  filters,
  onFilterChange,
}: {
  project: Project;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) {
  const hasActiveFilters = filters.videoId || filters.hookIndex !== null || filters.bodyIndex !== null || filters.ctaIndex !== null || filters.subtitleStyleId;

  const clearFilters = () => {
    onFilterChange({ videoId: null, hookIndex: null, bodyIndex: null, ctaIndex: null, subtitleStyleId: null });
  };

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <div>
        <label className="text-xs font-semibold text-black block mb-1">Video</label>
        <Select
          value={filters.videoId ?? "all"}
          onValueChange={(v) => onFilterChange({ ...filters, videoId: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="All Videos" />
          </SelectTrigger>
          <SelectContent className="bg-[#141832] border-white/10">
            <SelectItem value="all">All Videos</SelectItem>
            {project.videos.map((v) => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold text-black block mb-1">Hook</label>
        <Select
          value={filters.hookIndex !== null ? String(filters.hookIndex) : "all"}
          onValueChange={(v) => onFilterChange({ ...filters, hookIndex: v === "all" ? null : Number(v) })}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="All Hooks" />
          </SelectTrigger>
          <SelectContent className="bg-[#141832] border-white/10">
            <SelectItem value="all">All Hooks</SelectItem>
            {project.hooks.map((h, i) => (
              <SelectItem key={i} value={String(i)}>Hook {i + 1}: {h.slice(0, 20)}{h.length > 20 ? "..." : ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold text-black block mb-1">Body</label>
        <Select
          value={filters.bodyIndex !== null ? String(filters.bodyIndex) : "all"}
          onValueChange={(v) => onFilterChange({ ...filters, bodyIndex: v === "all" ? null : Number(v) })}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="All Bodies" />
          </SelectTrigger>
          <SelectContent className="bg-[#141832] border-white/10">
            <SelectItem value="all">All Bodies</SelectItem>
            {(project.hookBodies || []).map((b, i) => b.trim() ? (
              <SelectItem key={i} value={String(i)}>Body {i + 1}: {b.slice(0, 20)}{b.length > 20 ? "..." : ""}</SelectItem>
            ) : null)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold text-black block mb-1">CTA</label>
        <Select
          value={filters.ctaIndex !== null ? String(filters.ctaIndex) : "all"}
          onValueChange={(v) => onFilterChange({ ...filters, ctaIndex: v === "all" ? null : Number(v) })}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="All CTAs" />
          </SelectTrigger>
          <SelectContent className="bg-[#141832] border-white/10">
            <SelectItem value="all">All CTAs</SelectItem>
            {project.ctas.map((c, i) => (
              <SelectItem key={i} value={String(i)}>CTA {i + 1}: {c.slice(0, 20)}{c.length > 20 ? "..." : ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold text-black block mb-1">Subtitle</label>
        <Select
          value={filters.subtitleStyleId ?? "all"}
          onValueChange={(v) => onFilterChange({ ...filters, subtitleStyleId: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="All Subtitles" />
          </SelectTrigger>
          <SelectContent className="bg-[#141832] border-white/10">
            <SelectItem value="all">All Subtitles</SelectItem>
            {project.subtitleStyles.map((sid) => {
              const style = subtitleStyles.find((s) => s.id === sid);
              return (
                <SelectItem key={sid} value={sid}>{style?.name ?? sid}</SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-white gap-1 mt-4"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

export type { FilterState };
