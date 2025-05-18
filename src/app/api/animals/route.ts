// API route for /api/animals
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";

/**
 * @swagger
 * /api/animals:
 *   get:
 *     description: Returns a random animal
 *     responses:
 *       200:
 *         description: Random animal object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Aardvark"
 *               category: "animals"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No animals found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No animals found"
 */

export const runtime = "edge";

export async function GET() {
  const wordEntry = await getRandomWordByCategory("animals");
  if (!wordEntry) {
    return NextResponse.json({ error: "No animals found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
