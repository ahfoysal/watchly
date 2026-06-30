import { searchMovies } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return Response.json([], { status: 200 });
  try {
    return Response.json(await searchMovies(q));
  } catch (err) {
    console.error("[movie/search]", err);
    return Response.json([], { status: 200 });
  }
}
