import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Dynamic favicon — the LOCKR brand dot (accent green) on dark bg.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            background: "#00ff85",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
