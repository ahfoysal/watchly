import { getByGenre } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const genre = new URL(req.url).searchParams.get("g");
  if (!genre) return Response.json([], { status: 200 });
  try {
    return Response.json(await getByGenre(genre));
  } catch (err) {
    console.error("[genre]", err);
    return Response.json([], { status: 200 });
  }
}
