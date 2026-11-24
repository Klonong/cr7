import type { Category, CategorySlug } from "@/types/catalog";

export type { Category, CategorySlug };

export const CATEGORIES: Category[] = [
  {
    slug: "led-headlights",
    name: "LED Headlights & Projectors",
    shortName: "Lighting",
    description:
      "Bi-LED projectors, SQL laser mini driving lights, and crisp Hi/Lo cutoff optics.",
    image: "/images/prod-biled-projector.svg",
  },
  {
    slug: "signals-tail-lights",
    name: "Signals, DRL & Tail Lights",
    shortName: "Signals & Tail",
    description:
      "Sequential smoked turn indicators, twin-blade LED tail lights, and hazard modules.",
    image: "/images/prod-turn-signal.svg",
  },
  {
    slug: "controls-cockpit",
    name: "Cockpit & Controls",
    shortName: "Controls",
    description:
      "CNC 6-click brake levers, waterproof 3-mode light switches, and anti-glare bar-end mirrors.",
    image: "/images/prod-cnc-levers.svg",
  },
  {
    slug: "protection-body",
    name: "Protection & Armor",
    shortName: "Protection",
    description:
      "CNC alloy & Delrin frame sliders, crash guards, and heavy-duty engine armor.",
    image: "/images/prod-crash-guard.svg",
  },
  {
    slug: "touring-mounts",
    name: "Touring & Phone Mounts",
    shortName: "Touring",
    description:
      "Anti-vibration handlebar phone mounts with waterproof USB-C fast charging.",
    image: "/images/prod-phone-mount.svg",
  },
  {
    slug: "electrical-relays",
    name: "Wiring & Relays",
    shortName: "Electrical",
    description:
      "Waterproof 40A relay harness kits, Deutsch connectors, and inline fuse protection.",
    image: "/images/prod-relay-harness.svg",
  },
];

export const BIKE_MODELS = [
  "Universal",
  "Yamaha NMAX",
  "Honda PCX 160",
  "Honda Vario 160",
  "Yamaha Aerox 155",
  "Honda ADV 160",
  "Kawasaki Ninja / ZX",
  "CRF / KLX Trail",
] as const;

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
