import brandJson from "../public/brand/brand.json";

/**
 * Brand settings — edit public/brand/brand.json (and drop logo files next to it).
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
