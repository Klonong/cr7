import type { MetadataRoute } from "next";
import { STORE_CONFIG } from "@/config/store";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${STORE_CONFIG.brandName} — Katalog Resmi Aksesori & Lampu Motor`,
    short_name: STORE_CONFIG.brandName,
    description:
      "Katalog digital resmi CR7 Racing untuk lampu LED motor, Bi-LED projector, SQL laser, handle CNC, dan aksesoris touring.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ca0c1f",
    lang: "id",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
