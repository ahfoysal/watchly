import { getMangaPages } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/manga/read/[chapterId]">,
) {
  const { chapterId } = await ctx.params;
  try {
    return Response.json(await getMangaPages(chapterId));
  } catch (err) {
    console.error("[manga/read]", err);
    return Response.json([], { status: 200 });
  }
}
