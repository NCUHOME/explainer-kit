import React from "react";
import { Img, staticFile } from "remotion";
import { BRAND } from "../brand";
import { CREAM } from "./palette";

// Brand anchor: constant on every frame (STYLE.md §2). Configured in public/brand/brand.json.
export const NCU_BLUE = BRAND.primary[1];
const SERIF = "Noto Serif SC";

/**
 * Official lockup image (or the typeset org name when no image is configured),
 * a divider, then the department and its English name.
 */
export const OfficeLockup: React.FC<{ height: number; variant: "white" | "color" }> = ({ height, variant }) => {
  const ink = variant === "white" ? CREAM : NCU_BLUE;
  const file = variant === "white" ? BRAND.lockupWhite : BRAND.lockupColor;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.32 }}>
      {file ? (
        <Img src={staticFile(`brand/${file}`)} style={{ height, maxWidth: "none" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: height * 0.56, lineHeight: 1, color: ink, letterSpacing: height * 0.1, whiteSpace: "nowrap" }}>{BRAND.org}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: height * 0.15, color: ink, marginTop: height * 0.1, letterSpacing: height * 0.02, whiteSpace: "nowrap" }}>{BRAND.orgEn}</div>
        </div>
      )}
      {BRAND.dept ? (
        <>
          <div style={{ width: Math.max(2, height * 0.035), height: height * 0.86, background: ink, opacity: 0.5 }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: height * 0.62, lineHeight: 1, color: ink, letterSpacing: height * 0.08, whiteSpace: "nowrap" }}>{BRAND.dept}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: height * 0.155, color: ink, marginTop: height * 0.1, letterSpacing: height * 0.012, whiteSpace: "nowrap", opacity: 0.9 }}>{BRAND.deptEn}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};

/** Brand tab: a plate in the brand colour bleeding off the left edge, on every frame. */
export const BrandTab: React.FC<{ top?: number }> = ({ top = 36 }) => (
  <div style={{ position: "absolute", left: 0, top, background: NCU_BLUE, padding: "14px 30px 14px 64px", borderRadius: "0 10px 10px 0", boxShadow: "0 6px 18px rgba(0,0,0,0.16)" }}>
    <OfficeLockup height={64} variant="white" />
  </div>
);
