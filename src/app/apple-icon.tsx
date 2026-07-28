import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f1ef",
        }}
      >
        <svg viewBox="0 0 160 160" width="132" height="132">
          <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#e2e2df" strokeWidth="34" />
          <circle
            cx="80"
            cy="80"
            r="52"
            fill="none"
            stroke="#ff3008"
            strokeWidth="34"
            strokeDasharray="40.84 40.84"
          />
          <circle cx="80" cy="80" r="69" fill="none" stroke="#191919" strokeWidth="5" />
          <circle cx="80" cy="80" r="35" fill="#ffffff" stroke="#191919" strokeWidth="5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
