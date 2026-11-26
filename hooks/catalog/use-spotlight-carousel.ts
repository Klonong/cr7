"use client";

import * as React from "react";
import type { CarouselApi } from "@/components/ui/carousel";

export function useSpotlightCarousel(slideCount: number, intervalMs = 6000) {
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
    if (!api || slideCount <= 1 || paused) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      api.scrollNext();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [api, slideCount, paused, intervalMs]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = React.useCallback((idx: number) => api?.scrollTo(idx), [api]);
  const pause = React.useCallback(() => setPaused(true), []);
  const resume = React.useCallback(() => setPaused(false), []);

  return {
    setApi,
    current,
    scrollPrev,
    scrollNext,
    scrollTo,
    pause,
    resume,
  };
}
