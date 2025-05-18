// API route for /api/fruits
import { NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";

/**
 * @swagger
 * /api/fruits:
 *   get:
 *     description: Returns a random fruit
 *     responses:
 *       200:
 *         description: Random fruit object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Apple"
 *               category: "fruits"
 *               partOfSpeech: "noun"
 *       404:
 *         description: No fruits found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No fruits found"
 */

export async function GET() {
  const wordEntry = await getRandomWordByCategory("fruits");
  if (!wordEntry) {
    return NextResponse.json({ error: "No fruits found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}
