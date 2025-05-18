// API route for /api/objects
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";
import type { WordCategory } from "@/types";

export async function GET() {
  const wordEntry = await getRandomWordByCategory("objects" as WordCategory);
  if (!wordEntry) {
    return NextResponse.json({ error: "No objects found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}

/**
 * @swagger
 * /api/objects:
 *   get:
 *     description: Returns a random object
 *     responses:
 *       200:
 *         description: Random object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Table"
 *               category: "objects"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No objects found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No objects found"
 */

// No params or searchParams used in this route, so no update is needed for Context7/Next.js 15+.
