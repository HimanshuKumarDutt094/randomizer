// API route for /api/random-noun to return a random noun
import { NextResponse } from "next/server";
import { getRandomByPartOfSpeech } from "@/app/apiWords";

export const runtime = "edge";

/**
 * @swagger
 * /api/random-noun:
 *   get:
 *     description: Returns a random noun
 *     responses:
 *       200:
 *         description: Random noun object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Table"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No nouns found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No nouns found"
 */

export async function GET() {
  const wordEntry = await getRandomByPartOfSpeech("noun");
  if (!wordEntry) {
    return NextResponse.json({ error: "No nouns found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
