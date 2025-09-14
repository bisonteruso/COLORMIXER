export interface Color {
  name: string;
  hex: string;
  hue: number;
}

export interface MixingStep {
  colorName: string;
  colorHex: string;
  parts: number;
}