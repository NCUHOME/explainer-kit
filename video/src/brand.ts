import brandJson from "../public/brand/brand.json";

/**
 * Brand settings — the active brand is copied into public/brand/ from the brand library brands/<id>/
 * by tools/brand.py (review.sh / render.sh do it automatically from the episode's episode.json).
 * lockupColor / lockupWhite: official lockup images for light / dark backgrounds.
 * Leave them "" to fall back to a typeset org name.
 * primary: five tones of the brand colour, darkest → lightest (index 1 = main).
 */
export type Brand = {
  org: string;
  orgEn: string;
  dept: string;
  deptEn: string;
  series: string;
  lockupColor: string;
  lockupWhite: string;
  primary: [string, string, string, string, string];
  disclaimer: string;
};

export const BRAND = brandJson as Brand;
