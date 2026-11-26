"use client";

import { ExternalLink, Play } from "lucide-react";
import { YouTubeIcon } from "@/components/icons/marketplace-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { STORE_CONFIG } from "@/config/store";
import { useYoutubeShowcase } from "@/hooks/about/use-youtube-showcase";
import { cn } from "@/lib/utils";

export function YoutubeShowcase() {
  const { videos, activeVideo, selectVideo } = useYoutubeShowcase();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Channel Resmi YouTube
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Video Uji Sorot &amp; Review Produk CR7 Racing
          </h2>
          <p className="text-sm text-muted-foreground">
            Tonton langsung bukti kualitas sorot lampu LED, tutorial pemasangan
            relay, dan ulasan part CNC resmi dari tim teknis kami.
          </p>
        </div>

        <a
          href={STORE_CONFIG.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 min-h-[44px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 font-semibold self-start sm:self-auto"
          )}
        >
          <YouTubeIcon className="size-4.5" aria-hidden="true" />
          <span>Kunjungi YouTube CR7 Racing</span>
          <ExternalLink className="size-3.5 opacity-85" aria-hidden="true" />
        </a>
      </div>

      {/* Main Embedded YouTube Player */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-black shadow-md">
            <div className="aspect-video w-full">
              <iframe
                key={activeVideo.youtubeId}
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground text-[11px]">
                {activeVideo.category}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                Durasi {activeVideo.duration}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Tonton di YouTube</span>
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {activeVideo.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeVideo.description}
            </p>
          </div>
        </div>

        {/* Video Playlist Selector */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daftar Video Pilihan ({videos.length})
          </p>
          <div className="space-y-2.5">
            {videos.map((video) => {
              const isSelected = video.id === activeVideo.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => selectVideo(video.id)}
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                >
                  <Card
                    className={cn(
                      "rounded-xl border p-4 ring-0 gap-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border bg-card hover:border-foreground/25"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <Play className="size-4 fill-current" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold uppercase text-primary">
                            {video.category}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {video.duration}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">
                          {video.title}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
