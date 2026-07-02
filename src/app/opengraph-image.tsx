// Auto-generated Open Graph image (shown when a Naviora link is shared).
// Next attaches this to openGraph + twitter metadata automatically.

import { ImageResponse } from "next/og";

export const alt = "Naviora — Find your next stay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #0d9488)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 26,
              background: "white",
              color: "#0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 68,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 92, fontWeight: 800 }}>Naviora</div>
        </div>
        <div style={{ marginTop: 28, fontSize: 38, opacity: 0.92 }}>
          Find your next stay
        </div>
      </div>
    ),
    { ...size },
  );
}
