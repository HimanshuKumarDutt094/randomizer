// Word data for each category and part of speech
import type { WordEntry, WordCategory, PartOfSpeech } from "@/types";

// Helper to map category to JSON file
const CATEGORY_FILE_MAP: Record<string, string> = {
  animals: "/animals.json",
  birds: "/birds.json",
  fish: "/fish.json",
  fruits: "/fruits.json",
  vegetables: "/vegetables.json",
  objects: "/objects.json", // if you add objects.json later
  noun: "/noun.json",
  verb: "/verb.json",
};

async function getJsonArray(path: string): Promise<WordEntry[]> {
  // Fix: Use absolute URL for fetch in Next.js API routes
  if (!path.startsWith("http")) {
    // Use process.env.NEXT_PUBLIC_BASE_URL or fallback to localhost
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    path = base + path;
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const arr = await res.json();
  return arr as WordEntry[];
}

export async function getRandomWordByCategory(
  category: WordCategory
): Promise<WordEntry | undefined> {
  const file = CATEGORY_FILE_MAP[category];
  if (!file) return undefined;
  const arr = await getJsonArray(file);
  if (!arr.length) return undefined;
  const random = arr[Math.floor(Math.random() * arr.length)];
  return { ...random, category };
}

export async function getRandomWord(): Promise<WordEntry | undefined> {
  // Pick a random category from the available ones
  const categories = Object.keys(CATEGORY_FILE_MAP);
  const file =
    CATEGORY_FILE_MAP[
      categories[Math.floor(Math.random() * categories.length)]
    ];
  const arr = await getJsonArray(file);
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getRandomByPartOfSpeech(
  pos: PartOfSpeech
): Promise<WordEntry | undefined> {
  // Use noun.json or verb.json for part of speech
  const file = CATEGORY_FILE_MAP[pos];
  if (!file) return undefined;
  const arr = await getJsonArray(file);
  if (!arr.length) return undefined;
  const random = arr[Math.floor(Math.random() * arr.length)];
  return { ...random, partOfSpeech: pos };
}
