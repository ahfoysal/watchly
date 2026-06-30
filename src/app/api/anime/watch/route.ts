import { getEpisodeSources } from "@/lib/consumet";

export const runtime = "nodejs";

// Episode ids can contain slashes (e.g. "12-one-piece/5987"), so we take them
// as a query param rather than a path segment.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const ep = params.get("ep");
  const provider = params.get("provider") ?? undefined;
  if (!ep) {
    return Response.json({ error: "Missing episode id" }, { status: 400 });
  }
  try {
    return Response.json(await getEpisodeSources(ep, provider));
  } catch (err) {
    console.error("[watch]", err);
    return Response.json(
      { error: "Streaming source unavailable" },
      { status: 502 },
    );
  }
}
