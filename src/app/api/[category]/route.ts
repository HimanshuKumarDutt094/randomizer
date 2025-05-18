// API route for /api/[category] to return a random word in the given category
import { NextRequest, NextResponse } from "next/server";
import { getRandomWordByCategory } from "@/app/apiWords";
import type { WordCategory } from "@/types";

export async function GET(
  request: Request,
  context: { params: Promise<{ category: string }> }
) {
  // Context7/Next.js 15+ syntax: await params
  const { category } = await context.params;
  const wordEntry = await getRandomWordByCategory(category as WordCategory);
  if (!wordEntry) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(wordEntry);
}

/**
 * @swagger
 * /api/{category}:
 *   get:
 *     description: Returns a random word from the specified category
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category name (e.g., animals, birds, fish, fruits, vegetables, objects)
 *     responses:
 *       200:
 *         description: Random word object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WordEntry'
 *             example:
 *               name: "Apple"
 *               category: "fruits"
 *               partOfSpeech: "noun"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Category not found"
 */
