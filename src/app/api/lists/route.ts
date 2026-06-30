import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 200 });
  const lists = await prisma.list.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { items: true } },
      items: { take: 4, orderBy: { createdAt: "desc" }, select: { image: true } },
    },
  });
  return NextResponse.json(
    lists.map((l) => ({
      id: l.id,
      name: l.name,
      isPublic: l.isPublic,
      count: l._count.items,
      covers: l.items.map((i) => i.image).filter(Boolean),
    })),
  );
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, isPublic } = await req.json();
  const trimmed = String(name ?? "").trim().slice(0, 80);
  if (!trimmed) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const list = await prisma.list.create({
    data: { userId: session.user.id, name: trimmed, isPublic: isPublic !== false },
  });
  return NextResponse.json(list);
}
