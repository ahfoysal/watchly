import { getMangaPopular } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getMangaPopular());
  } catch (err) {
    console.error("[manga/popular]", err);
    return Response.json([], { status: 200 });
  }
}
