// API route for /api/birds
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";

export const runtime = "edge";

/**
 * @swagger
 * /api/birds:
 *   get:
 *     description: Returns a random bird
 *     responses:
 *       200:
 *         description: Random bird object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Crow"
 *               category: "birds"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No birds found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No birds found"
 */

export async function GET() {
  const wordEntry = await getRandomWordByCategory("birds");
  if (!wordEntry) {
    return NextResponse.json({ error: "No birds found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
