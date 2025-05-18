// Types for color API

export type ColorFormat = "hex" | "rgba" | "oklch";

export type ColorString =
  | `#${string}` // hex
  | `rgba(${number},${number},${number},${number})`
  | `oklch(${number}% ${number} ${number})`;

export interface RandomColorResponse {
  color: ColorString;
  format: ColorFormat;
}

export interface ColorPaletteRequest {
  from: ColorString;
  to: ColorString;
  points: number;
}

export interface ColorPaletteResponse {
  palette: ColorString[];
  format: ColorFormat;
}
