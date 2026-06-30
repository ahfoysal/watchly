import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 200 });
  const rows = await prisma.progress.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  if (!b?.animeId || !b?.episodeId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const data = {
    title: String(b.title ?? "Anime"),
    image: b.image ? String(b.image) : null,
    provider: b.provider ? String(b.provider) : null,
    dub: !!b.dub,
    episodeId: String(b.episodeId),
    episodeNumber: Number(b.episodeNumber) || 1,
    position: Number(b.position) || 0,
    duration: Number(b.duration) || 0,
  };
  const row = await prisma.progress.upsert({
    where: { userId_animeId: { userId: session.user.id, animeId: String(b.animeId) } },
    create: { userId: session.user.id, animeId: String(b.animeId), ...data },
    update: data,
  });
  return NextResponse.json(row);
}
