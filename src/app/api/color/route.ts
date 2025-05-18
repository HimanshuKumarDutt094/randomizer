// API route for /api/color - returns a random color in hex, rgba, and oklch
import { NextResponse } from "next/server";
import type { RandomColorResponse, ColorFormat, ColorString } from "@/types";

/**
 * @swagger
 * /api/color:
 *   get:
 *     description: Returns a random color
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [hex, rgba, oklch]
 *         required: false
 *         description: The color format to return (hex, rgba, oklch)
 *     responses:
 *       200:
 *         description: Random color object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RandomColorResponse'
 *             example:
 *               color: "#aabbcc"
 *               format: "hex"
 *       404:
 *         description: No color found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No color found"
 */

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(): `#${string}` {
  const hex = randomInt(0, 0xffffff).toString(16).padStart(6, "0");
  return `#${hex}`;
}

function randomRgba(): `rgba(${number},${number},${number},${number})` {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  const a = parseFloat(Math.random().toFixed(2));
  return `rgba(${r},${g},${b},${a})`;
}

function randomOklch(): `oklch(${number}% ${number} ${number})` {
  // L: 0-100%, C: 0-0.4, H: 0-360
  const l = +(Math.random() * 100).toFixed(1);
  const c = +(Math.random() * 0.4).toFixed(3);
  const h = +(Math.random() * 360).toFixed(1);
  return `oklch(${l}% ${c} ${h})`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const formatParam = url.searchParams.get("format");
  const formats: ColorFormat[] = ["hex", "rgba", "oklch"];
  const format = formats.includes(formatParam as ColorFormat)
    ? (formatParam as ColorFormat)
    : formats[randomInt(0, formats.length - 1)];
  let color: ColorString;
  if (format === "hex") {
    color = randomHex();
  } else if (format === "rgba") {
    color = randomRgba();
  } else {
    color = randomOklch();
  }
  const response: RandomColorResponse = { color, format };
  return NextResponse.json(response);
}
