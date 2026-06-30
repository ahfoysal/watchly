import { searchManga } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return Response.json([], { status: 200 });
  try {
    return Response.json(await searchManga(q));
  } catch (err) {
    console.error("[manga/search]", err);
    return Response.json([], { status: 200 });
  }
}
