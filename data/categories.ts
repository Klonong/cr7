import type { Category, CategorySlug, Motorcycle } from "@/types/catalog";

export type { Category, CategorySlug, Motorcycle };

export const CATEGORIES: Category[] = [
  {
    slug: "led-headlights",
    name: "Lampu Depan & Projector LED",
    shortName: "Lampu LED",
    description:
      "Bi-LED projector, lampu tembak SQL laser, dan optik cutoff rata anti silau.",
  },
  {
    slug: "signals-tail-lights",
    name: "Sein, DRL & Stoplamp LED",
    shortName: "Sein & Stoplamp",
    description:
      "Sein running smoke, stoplamp 3-in-1 twin blade, dan modul hazard.",
  },
  {
    slug: "controls-cockpit",
    name: "Kokpit & Kontrol CNC",
    shortName: "Kokpit & CNC",
    description:
      "Handle rem CNC 6 klik, saklar waterproof 3 mode, dan spion bar-end anti silau.",
  },
  {
    slug: "protection-body",
    name: "Pelindung & Body Armor",
    shortName: "Proteksi",
    description:
      "Frame slider CNC Delrin, crash bar mesin, dan pelindung bodi motor.",
  },
  {
    slug: "touring-mounts",
    name: "Touring & Holder HP",
    shortName: "Touring",
    description:
      "Holder HP CNC anti getar dengan pengisian cepat USB-C tahan air.",
  },
  {
    slug: "electrical-relays",
    name: "Kelistrikan & Relay Set",
    shortName: "Kelistrikan",
    description:
      "Kabel relay set waterproof 40A, konektor kedap air, dan pengaman sekring.",
  },
];

export const DEFAULT_MOTORCYCLES: Motorcycle[] = [
  { id: "moto-universal", brand: "Universal", model: "Semua Motor", name: "Universal", type: "Universal" },
  { id: "moto-nmax", brand: "Yamaha", model: "NMAX", name: "Yamaha NMAX", type: "Matic" },
  { id: "moto-pcx160", brand: "Honda", model: "PCX 160", name: "Honda PCX 160", type: "Matic" },
  { id: "moto-vario160", brand: "Honda", model: "Vario 160", name: "Honda Vario 160", type: "Matic" },
  { id: "moto-aerox155", brand: "Yamaha", model: "Aerox 155", name: "Yamaha Aerox 155", type: "Matic" },
  { id: "moto-adv160", brand: "Honda", model: "ADV 160", name: "Honda ADV 160", type: "Matic" },
  { id: "moto-ninja", brand: "Kawasaki", model: "Ninja / ZX", name: "Kawasaki Ninja / ZX", type: "Sport" },
  { id: "moto-crf-klx", brand: "Honda / Kawasaki", model: "CRF / KLX", name: "CRF / KLX Trail", type: "Trail / Adventure" },
];

export const BIKE_MODELS = DEFAULT_MOTORCYCLES.map((m) => m.name);

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
