import { ImageResponse } from "next/og";

/**
 * Auto-generated Open Graph image (1200×630) for WhatsApp link previews —
 * sharing is the main growth channel (PRD §9.3).
 */
export const alt =
  "Businessmen & Women Outreach — God is your business partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#DFB011",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Free to join · BMW Outreach
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            background: "linear-gradient(90deg,#DBBB5F,#DFB011,#F1E2A4,#DBBB5F)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          God is your business partner.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#DBBB5F",
            textAlign: "center",
          }}
        >
          A free fellowship for student entrepreneurs, business owners &amp; professionals
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 22,
            letterSpacing: 4,
            color: "#E6E5E0",
          }}
        >
          BUSINESSMEN &amp; WOMEN OUTREACH
        </div>
      </div>
    ),
    size,
  );
}
