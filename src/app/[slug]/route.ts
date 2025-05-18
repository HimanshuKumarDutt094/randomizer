import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }
  return NextResponse.json({ message: `Hello ${slug}!` });
}
