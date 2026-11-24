"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/data/products";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
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

  const handleThumbClick = (index: number) => {
    setCurrent(index);
    api?.scrollTo(index);
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
        <Carousel
          setApi={setApi}
          opts={{ loop: images.length > 1 }}
          className="w-full"
          aria-label={`${productName} image gallery`}
        >
          <CarouselContent className="ml-0">
            {images.map((image, idx) => (
              <CarouselItem key={`${image.url}-${idx}`} className="pl-0">
                <AspectRatio ratio={1}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-3 bg-background/85 hover:bg-background border-border" />
              <CarouselNext className="right-3 bg-background/85 hover:bg-background border-border" />
            </>
          )}
        </Carousel>

        {images[current]?.label && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-md border border-border bg-background/85 px-2.5 py-1 font-mono text-xs font-medium text-foreground backdrop-blur-sm">
            {images[current].label}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((image, idx) => (
            <button
              key={`${image.url}-thumb-${idx}`}
              type="button"
              onClick={() => handleThumbClick(idx)}
              aria-label={`Select ${image.label ?? `image ${idx + 1}`}`}
              aria-current={idx === current ? "true" : undefined}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                idx === current
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
