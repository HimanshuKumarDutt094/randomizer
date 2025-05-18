// API route for /api/random-verb to return a random verb
import { NextResponse } from "next/server";
import { getRandomByPartOfSpeech } from "@/app/apiWords";

export const runtime = "edge";

/**
 * @swagger
 * /api/random-verb:
 *   get:
 *     description: Returns a random verb
 *     responses:
 *       200:
 *         description: Random verb object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Jump"
 *               partOfSpeech: "verb"
 *       404:
 *         description: No verbs found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No verbs found"
 */

export async function GET() {
  const wordEntry = await getRandomByPartOfSpeech("verb");
  if (!wordEntry) {
    return NextResponse.json({ error: "No verbs found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
