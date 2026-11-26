import { ImageResponse } from "next/og";

export const alt = "CR7 Racing — Katalog Resmi Lampu LED Motor & Part CNC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(202, 12, 31, 0.35), transparent 55%)",
          color: "#fefefe",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(202, 12, 31, 0.2)",
              border: "1px solid rgba(202, 12, 31, 0.6)",
              color: "#fefefe",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            KATALOG RESMI INDONESIA
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#ca0c1f",
            }}
          >
            CR7 RACING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "960px",
            }}
          >
            Lampu LED Presisi &amp; Part CNC Racing untuk Setiap Perjalanan.
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#d4d4d8",
              maxWidth: "880px",
              lineHeight: 1.4,
            }}
          >
            Bi-LED Projector · SQL Laser 3 Mata · Handle CNC · Frame Slider ·
            Tahan Air IP67
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: "24px",
            fontSize: "22px",
            color: "#a1a1aa",
          }}
        >
          <div>Order Resmi via Shopee &amp; TikTok Shop</div>
          <div style={{ color: "#fefefe", fontWeight: 700 }}>
            100% Original · Garansi Resmi
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
