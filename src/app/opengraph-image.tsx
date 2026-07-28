import { ImageResponse } from "next/og";
import { PHONE_DISPLAY } from "@/lib/site";

export const alt =
  "Resto Action : pour que le fruit du travail des restaurateurs québécois leur revienne";
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
          justifyContent: "space-between",
          backgroundColor: "#f1f1ef",
          padding: "72px 80px",
        }}
      >
        <svg viewBox="0 0 160 160" width="120" height="120">
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#191919",
          }}
        >
          <span>Pas normal que ceux qui cuisinent</span>
          <span style={{ color: "#ff3008" }}>
            soient ceux qui restent pauvres.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#191919",
            opacity: 0.7,
          }}
        >
          restoaction.ca · {PHONE_DISPLAY}
        </div>
      </div>
    ),
    { ...size }
  );
}
