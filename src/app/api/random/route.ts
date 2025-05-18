// API route for /api/random to return a random word from any category
import { NextResponse } from "next/server";
import {
  getRandomWord,
  getRandomWordByCategory,
  getRandomByPartOfSpeech,
} from "@/app/apiWords";
import type {
  RandomColorResponse,
  ColorPaletteResponse,
  ColorString,
} from "@/types";

function randomColorHex() {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `#${hex}`;
}

function randomRgba() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random().toFixed(2);
  return `rgba(${r},${g},${b},${a})`;
}

function randomOklch() {
  const l = +(Math.random() * 100).toFixed(1);
  const c = +(Math.random() * 0.4).toFixed(3);
  const h = +(Math.random() * 360).toFixed(1);
  return `oklch(${l}% ${c} ${h})`;
}

async function getRandomColor(): Promise<RandomColorResponse> {
  const formats = ["hex", "rgba", "oklch"] as const;
  const format = formats[Math.floor(Math.random() * formats.length)];
  let color: ColorString;
  if (format === "hex") color = randomColorHex() as ColorString;
  else if (format === "rgba") color = randomRgba() as ColorString;
  else color = randomOklch() as ColorString;
  return { color, format };
}

async function getRandomPalette(): Promise<ColorPaletteResponse> {
  const from = randomRgba() as ColorString;
  const to = randomRgba() as ColorString;
  const points = 5;
  const palette: ColorString[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    // Simple linear interpolation for rgba
    const parse = (rgba: string) =>
      rgba.match(/\d+\.?\d*/g)?.map(Number) ?? [0, 0, 0, 1];
    const [r1, g1, b1, a1] = parse(from);
    const [r2, g2, b2, a2] = parse(to);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    const a = +(a1 + (a2 - a1) * t).toFixed(2);
    palette.push(`rgba(${r},${g},${b},${a})` as ColorString);
  }
  return { palette, format: "rgba" };
}

export async function GET() {
  const [animal, fish, fruit, bird, verb, noun, color, palette] =
    await Promise.all([
      getRandomWordByCategory("animals"),
      getRandomWordByCategory("fish"),
      getRandomWordByCategory("fruits"),
      getRandomWordByCategory("birds"),
      getRandomByPartOfSpeech("verb"),
      getRandomByPartOfSpeech("noun"),
      getRandomColor(),
      getRandomPalette(),
    ]);
  if (!animal || !fish || !fruit || !bird || !verb || !noun) {
    return NextResponse.json(
      { error: "Not enough data for random response" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    animal,
    fish,
    fruit,
    bird,
    verb,
    noun,
    color,
    palette,
    description: `${animal.name} with ${fish.name}, ${fruit.name}, ${
      bird.name
    } doing ${verb.name} and ${noun.name} in color ${
      color.color
    } with palette ${palette.palette.join(", ")}`,
  });
}

/**
 * @swagger
 * /api/random:
 *   get:
 *     description: Returns a random animal, fish, fruit, bird, verb, noun, color, and palette
 *     responses:
 *       200:
 *         description: Random everything object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animal:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 fish:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 fruit:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 bird:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 verb:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 noun:
 *                   $ref: '#/components/schemas/WordEntry'
 *                 color:
 *                   $ref: '#/components/schemas/RandomColorResponse'
 *                 palette:
 *                   $ref: '#/components/schemas/ColorPaletteResponse'
 *                 description:
 *                   type: string
 *             example:
 *               animal: { name: "Aardvark", category: "animals", partOfSpeech: "noun" }
 *               fish: { name: "Bass", category: "fish", partOfSpeech: "noun" }
 *               fruit: { name: "Apple", category: "fruits", partOfSpeech: "noun" }
 *               bird: { name: "Crow", category: "birds", partOfSpeech: "noun" }
 *               verb: { name: "Jump", partOfSpeech: "verb" }
 *               noun: { name: "Table", partOfSpeech: "noun" }
 *               color: { color: "#aabbcc", format: "hex" }
 *               palette: { palette: ["rgba(10,20,30,1)", "rgba(50,60,70,1)"], format: "rgba" }
 *               description: "Aardvark with Bass, Apple, Crow doing Jump and Table in color #aabbcc with palette ..."
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No data found"
 */
