"use client";

import * as React from "react";
import type { CarouselApi } from "@/components/ui/carousel";

export function useProductGallery() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

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

  const selectSlide = React.useCallback(
    (index: number) => {
      setCurrent(index);
      api?.scrollTo(index);
    },
    [api]
  );

  return {
    setApi,
    current,
    selectSlide,
  };
}
