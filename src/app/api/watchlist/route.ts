import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 200 });
  const items = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { mediaId, kind, title, image } = await req.json();
  if (!mediaId || !kind || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const item = await prisma.watchlistItem.upsert({
    where: {
      userId_mediaId_kind: { userId: session.user.id, mediaId, kind },
    },
    create: { userId: session.user.id, mediaId, kind, title, image },
    update: {},
  });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { mediaId, kind } = await req.json();
  await prisma.watchlistItem.deleteMany({
    where: { userId: session.user.id, mediaId, kind },
  });
  return NextResponse.json({ ok: true });
}
