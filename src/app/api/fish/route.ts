// API route for /api/fish
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";

export const runtime = "edge";

/**
 * @swagger
 * /api/fish:
 *   get:
 *     description: Returns a random fish
 *     responses:
 *       200:
 *         description: Random fish object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Bass"
 *               category: "fish"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No fish found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No fish found"
 */

export async function GET() {
  const wordEntry = await getRandomWordByCategory("fish");
  if (!wordEntry) {
    return NextResponse.json({ error: "No fish found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
