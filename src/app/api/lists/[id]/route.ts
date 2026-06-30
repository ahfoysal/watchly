import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: RouteContext<"/api/lists/[id]">) {
  const { id } = await ctx.params;
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      items: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true } },
    },
  });
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await getSession();
  const isOwner = session?.user.id === list.userId;
  if (!list.isPublic && !isOwner) {
    return NextResponse.json({ error: "Private list" }, { status: 403 });
  }

  return NextResponse.json({
    id: list.id,
    name: list.name,
    isPublic: list.isPublic,
    isOwner,
    owner: { id: list.user.id, name: list.user.name },
    items: list.items.map((i) => ({
      mediaId: i.mediaId,
      kind: i.kind,
      title: i.title,
      image: i.image,
    })),
  });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/lists/[id]">) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.list.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
