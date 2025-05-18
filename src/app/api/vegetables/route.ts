// API route for /api/vegetables
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";

export const runtime = "edge";

/**
 * @swagger
 * /api/vegetables:
 *   get:
 *     description: Returns a random vegetable
 *     responses:
 *       200:
 *         description: Random vegetable object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Carrot"
 *               category: "vegetables"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No vegetables found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No vegetables found"
 */

export async function GET() {
  const wordEntry = await getRandomWordByCategory("vegetables");
  if (!wordEntry) {
    return NextResponse.json({ error: "No vegetables found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}

// No params or searchParams used in this route, so no update is needed for Context7/Next.js 15+.
