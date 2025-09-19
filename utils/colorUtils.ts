export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export const hexToRgb = (hex: string): RgbColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const colorDistance = (rgb1: RgbColor, rgb2: RgbColor): number => {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return rDiff * rDiff + gDiff * gDiff + bDiff * bDiff; // Euclidean distance squared
};

export const mixRgbColors = (
  colors: { rgb: RgbColor; parts: number }[]
): RgbColor => {
  let totalParts = 0;
  let r = 0;
  let g = 0;
  let b = 0;

  for (const color of colors) {
    if (color.parts > 0) {
      totalParts += color.parts;
      r += color.rgb.r * color.parts;
      g += color.rgb.g * color.parts;
      b += color.rgb.b * color.parts;
    }
  }

  if (totalParts === 0) {
    return { r: 255, g: 255, b: 255 }; // Return white if no parts are mixed
  }

  return {
    r: r / totalParts,
    g: g / totalParts,
    b: b / totalParts,
  };
};
