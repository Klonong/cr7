"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { HomeHighlight } from "@/types/home";

function isExternalUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

interface SpotlightCarouselProps {
  highlights: HomeHighlight[];
}

export function SpotlightCarousel({ highlights }: SpotlightCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || highlights.length <= 1 || paused) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => window.clearInterval(timer);
  }, [api, highlights.length, paused]);

  if (highlights.length === 0) return null;

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section Header + Carousel Controls */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Sorotan Unggulan
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Highlight &amp; Promo CR7 Racing
          </h2>
        </div>

        {highlights.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-xs text-muted-foreground tabular-nums mr-1">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(highlights.length).padStart(2, "0")}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => api?.scrollPrev()}
              aria-label="Sorotan sebelumnya"
              className="size-9 rounded-full"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => api?.scrollNext()}
              aria-label="Sorotan berikutnya"
              className="size-9 rounded-full"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      <Carousel
        setApi={setApi}
        opts={{ loop: highlights.length > 1, align: "start" }}
        className="w-full"
        aria-label="Carousel sorotan unggulan CR7 Racing"
      >
        <CarouselContent className="ml-0">
          {highlights.map((highlight) => {
            const ctaExternal = isExternalUrl(highlight.ctaHref);
            return (
              <CarouselItem key={highlight.id} className="pl-0">
                <div className="overflow-hidden rounded-xl border border-border bg-[#09090b] text-[#fefefe]">
                  <div className="grid grid-cols-1 items-center lg:grid-cols-12">
                    <div className="p-6 sm:p-8 lg:col-span-6 lg:p-10 space-y-5">
                      <Badge className="bg-primary/20 text-[#fefefe] border border-primary/50 font-mono text-xs">
                        <Sparkles
                          className="size-3 mr-1 text-primary"
                          aria-hidden="true"
                        />
                        {highlight.badge}
                      </Badge>
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                        {highlight.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-300">
                        {highlight.description}
                      </p>
                      {highlight.bullets.length > 0 && (
                        <ul className="space-y-2 text-sm text-zinc-200">
                          {highlight.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2
                                className="size-4 text-emerald-400 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="pt-2">
                        {ctaExternal ? (
                          <a
                            href={highlight.ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({ size: "lg" }),
                              "h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 font-semibold"
                            )}
                          >
                            <span>{highlight.ctaLabel}</span>
                            <ExternalLink
                              className="size-4"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          <Link
                            href={highlight.ctaHref}
                            className={cn(
                              buttonVariants({ size: "lg" }),
                              "h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 font-semibold"
                            )}
                          >
                            <span>{highlight.ctaLabel}</span>
                            <ArrowRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-zinc-800">
                      <AspectRatio ratio={4 / 3}>
                        <Image
                          src={highlight.imageUrl}
                          alt={highlight.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Dot Indicators */}
      {highlights.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 pt-1"
          role="tablist"
          aria-label="Pilih slide sorotan"
        >
          {highlights.map((hl, idx) => (
            <button
              key={hl.id}
              type="button"
              role="tab"
              aria-selected={idx === current}
              aria-label={`Tampilkan sorotan ${idx + 1}: ${hl.title}`}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                idx === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
