import { getMangaInfo } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/manga/info/[...id]">,
) {
  const { id } = await ctx.params;
  try {
    return Response.json(await getMangaInfo(id.join("/")));
  } catch (err) {
    console.error("[manga/info]", err);
    return Response.json({ error: "Manga not found" }, { status: 404 });
  }
}
