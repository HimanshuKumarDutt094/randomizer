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

/**
 * @swagger
 * /api/color-palette:
 *   get:
 *     description: Generate a color palette between two colors
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: Starting color (hex or rgba)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: Ending color (hex or rgba)
 *       - in: query
 *         name: points
 *         schema:
 *           type: integer
 *           default: 5
 *         required: false
 *         description: Number of colors in the palette
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

export async function GET(request: NextRequest) {
  // Context7/Next.js 15+ syntax: use request.nextUrl.searchParams (already correct)
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const points = Number(searchParams.get("points") || 5);
  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing 'from' or 'to' color" },
      { status: 400 }
    );
  }
  const palette: ColorString[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    palette.push(interpolateColor(from as ColorString, to as ColorString, t));
  }
  const response: ColorPaletteResponse = { palette, format: "rgba" };
  return NextResponse.json(response);
}
