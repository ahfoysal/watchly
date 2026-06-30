import { searchAnime } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return Response.json([], { status: 200 });
  try {
    return Response.json(await searchAnime(q));
  } catch (err) {
    console.error("[search]", err);
    return Response.json([], { status: 200 });
  }
}
