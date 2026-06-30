import { getMoviesTrending } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getMoviesTrending());
  } catch (err) {
    console.error("[movie/trending]", err);
    return Response.json([], { status: 200 });
  }
}
