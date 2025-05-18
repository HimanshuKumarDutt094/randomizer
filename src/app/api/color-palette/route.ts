// API route for /api/color-palette - generates a color palette between two colors
import { NextRequest, NextResponse } from "next/server";
import type {
  ColorPaletteRequest,
  ColorPaletteResponse,
  ColorString,
  ColorFormat,
} from "@/types";

function parseColor(
  color: ColorString
): { r: number; g: number; b: number; a: number } | null {
  // Only supports rgba and hex for palette interpolation
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length !== 6) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }
  if (color.startsWith("rgba")) {
    const match = color.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
    if (!match) return null;
    return { r: +match[1], g: +match[2], b: +match[3], a: +match[4] };
  }
  return null;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateColor(
  from: ColorString,
  to: ColorString,
  t: number
): ColorString {
  const c1 = parseColor(from);
  const c2 = parseColor(to);
  if (!c1 || !c2) return from;
  const r = Math.round(lerp(c1.r, c2.r, t));
  const g = Math.round(lerp(c1.g, c2.g, t));
  const b = Math.round(lerp(c1.b, c2.b, t));
  const a = +lerp(c1.a, c2.a, t).toFixed(2);
  return `rgba(${r},${g},${b},${a})`;
}

// --- Color conversion helpers ---
function rgbaToHex(r: number, g: number, b: number): `#${string}` {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(
  hex: string,
  a = 1
): `rgba(${number},${number},${number},${number})` {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Dummy oklch conversion for demo (returns a string, not real conversion)
function rgbaToOklch(
  r: number,
  g: number,
  b: number
): `oklch(${number}% ${number} ${number})` {
  // Not a real conversion, just for API completeness
  return `oklch(${Math.round((r + g + b) / 7.65)}% 0.2 200)`;
}

function hexToOklch(hex: string): `oklch(${number}% ${number} ${number})` {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return rgbaToOklch(r, g, b);
}

function parseRgbaString(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (!match) return [0, 0, 0, 1];
  return [
    parseInt(match[1]),
    parseInt(match[2]),
    parseInt(match[3]),
    parseFloat(match[4]),
  ];
}

function convertColor(
  color: ColorString,
  from: ColorFormat,
  to: ColorFormat
): ColorString {
  if (from === to) return color;
  if (from === "hex") {
    if (to === "rgba") return hexToRgba(color as string);
    if (to === "oklch") return hexToOklch(color as string);
  }
  if (from === "rgba") {
    const [r, g, b] = parseRgbaString(color as string);
    if (to === "hex") return rgbaToHex(r, g, b);
    if (to === "oklch") return rgbaToOklch(r, g, b);
  }
  // oklch to others not implemented
  return color;
}

/**
 * @swagger
 * /api/color-palette:
 *   get:
 *     description: Generate a color palette between two colors. If 'from' and 'to' are not provided, two random colors will be used.
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: false
 *         description: Starting color (hex or rgba). If omitted, a random color is used.
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: false
 *         description: Ending color (hex or rgba). If omitted, a random color is used.
 *       - in: query
 *         name: points
 *         schema:
 *           type: integer
 *           default: 5
 *         required: false
 *         description: Number of colors in the palette
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [hex, rgba, oklch]
 *         required: false
 *         description: The color format to return (hex, rgba, oklch)
 *     responses:
 *       200:
 *         description: Color palette object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ColorPaletteResponse'
 *             example:
 *               palette: ["rgba(10,20,30,1)", "rgba(50,60,70,1)"]
 *               format: "rgba"
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Missing required parameters"
 */

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRgba(): `rgba(${number},${number},${number},${number})` {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  const a = parseFloat(Math.random().toFixed(2));
  return `rgba(${r},${g},${b},${a})`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let from = searchParams.get("from");
  let to = searchParams.get("to");
  const points = Number(searchParams.get("points") || 5);
  const formatParam = searchParams.get("format");
  const formats: ColorFormat[] = ["hex", "rgba", "oklch"];
  const format = formats.includes(formatParam as ColorFormat)
    ? (formatParam as ColorFormat)
    : "rgba";
  // If from or to are missing, generate random colors
  if (!from) from = randomRgba();
  if (!to) to = randomRgba();
  const palette: ColorString[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    let color: ColorString;
    if (format === "hex") {
      const rgba = interpolateColor(from as ColorString, to as ColorString, t);
      const [r, g, b] = parseRgbaString(rgba);
      color = rgbaToHex(r, g, b);
    } else if (format === "oklch") {
      const rgba = interpolateColor(from as ColorString, to as ColorString, t);
      const [r, g, b] = parseRgbaString(rgba);
      color = rgbaToOklch(r, g, b);
    } else {
      color = interpolateColor(from as ColorString, to as ColorString, t);
    }
    palette.push(color);
  }
  const response: ColorPaletteResponse = { palette, format };
  return NextResponse.json(response);
}
