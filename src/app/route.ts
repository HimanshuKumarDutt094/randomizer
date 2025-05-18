import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { marked } from "marked";

export async function GET() {
  // Read the README.md file
  const readmePath = path.join(process.cwd(), "README.md");
  const markdown = await readFile(readmePath, "utf-8");
  // Convert markdown to HTML
  const html = marked.parse(markdown);
  // Use 'as any' to satisfy TypeScript for string body
  return new NextResponse(html as any, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
