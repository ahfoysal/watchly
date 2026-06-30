import { getAnimeInfo } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/anime/info/[id]">,
) {
  const { id } = await ctx.params;
  const sp = new URL(req.url).searchParams;
  const provider = sp.get("provider") ?? undefined;
  const dub = sp.get("dub") === "1" || sp.get("dub") === "true";
  try {
    return Response.json(await getAnimeInfo(id, provider, dub));
  } catch (err) {
    console.error("[info]", err);
    return Response.json({ error: "Anime not found" }, { status: 404 });
  }
}
