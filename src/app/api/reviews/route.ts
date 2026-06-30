import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cached, cacheDel } from "@/lib/cache";

export const runtime = "nodejs";

const cacheKey = (mediaId: string, kind: string) => `reviews:${kind}:${mediaId}`;

// Public, shared summary (cached). `userId` is kept internally so we can flag
// the requester's own review, then stripped from the response.
async function publicSummary(mediaId: string, kind: string) {
  return cached(cacheKey(mediaId, kind), 120, async () => {
    const [rows, agg] = await Promise.all([
      prisma.review.findMany({
        where: { mediaId, kind },
        orderBy: { updatedAt: "desc" },
        take: 50,
        include: { user: { select: { name: true, image: true } } },
      }),
      prisma.review.aggregate({
        where: { mediaId, kind },
        _avg: { rating: true },
        _count: true,
      }),
    ]);
    return {
      average: agg._avg.rating ?? 0,
      count: agg._count,
      reviews: rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        rating: r.rating,
        body: r.body,
        createdAt: r.createdAt,
        user: { name: r.user.name, image: r.user.image },
      })),
    };
  });
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const mediaId = sp.get("mediaId");
  const kind = sp.get("kind") ?? "anime";
  if (!mediaId) return NextResponse.json({ error: "Missing mediaId" }, { status: 400 });

  const [summary, session] = await Promise.all([
    publicSummary(mediaId, kind),
    getSession(),
  ]);
  const uid = session?.user.id;
  const mine = uid ? summary.reviews.find((r) => r.userId === uid) ?? null : null;

  return NextResponse.json({
    average: summary.average,
    count: summary.count,
    mine: mine ? { rating: mine.rating, body: mine.body } : null,
    reviews: summary.reviews.map(({ userId, ...r }) => ({
      ...r,
      isMine: !!uid && userId === uid,
    })),
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mediaId, kind, rating, body } = await req.json();
  const r = Math.round(Number(rating));
  if (!mediaId || !kind || !(r >= 1 && r <= 5)) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }
  const data = { rating: r, body: typeof body === "string" ? body.slice(0, 2000) : null };
  const review = await prisma.review.upsert({
    where: { userId_mediaId_kind: { userId: session.user.id, mediaId, kind } },
    create: { userId: session.user.id, mediaId, kind, ...data },
    update: data,
  });
  await cacheDel(cacheKey(mediaId, kind));
  return NextResponse.json(review);
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { mediaId, kind } = await req.json();
  await prisma.review.deleteMany({
    where: { userId: session.user.id, mediaId, kind },
  });
  await cacheDel(cacheKey(mediaId, kind));
  return NextResponse.json({ ok: true });
}
