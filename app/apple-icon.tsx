import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// 180×180 Apple touch icon: LOCKR mark on dark.
// next/og (Satori) constraints: stick to text Noto Sans can render. Plain Latin only.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "#00ff85",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            color: "#f5f4f1",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          LOCKR
        </div>
      </div>
    ),
    { ...size },
  );
}
