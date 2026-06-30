import { browse } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const sort = sp.get("sort") ?? "az";
  const page = parseInt(sp.get("page") ?? "1", 10) || 1;
  const genre = sp.get("genre") ?? undefined;
  const status = sp.get("status") ?? undefined;
  const perPage = parseInt(sp.get("perPage") ?? "30", 10) || 30;
  try {
    return Response.json(await browse(sort, page, genre, status, perPage));
  } catch (err) {
    console.error("[browse]", err);
    return Response.json({ items: [], hasNextPage: false }, { status: 200 });
  }
}
