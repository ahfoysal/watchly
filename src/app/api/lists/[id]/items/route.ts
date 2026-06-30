import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

async function ownsList(listId: string, userId: string) {
  const list = await prisma.list.findUnique({ where: { id: listId }, select: { userId: true } });
  return list?.userId === userId;
}

export async function POST(req: Request, ctx: RouteContext<"/api/lists/[id]/items">) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await ownsList(id, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { mediaId, kind, title, image } = await req.json();
  if (!mediaId || !kind || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const item = await prisma.listItem.upsert({
    where: { listId_mediaId_kind: { listId: id, mediaId, kind } },
    create: { listId: id, mediaId, kind, title, image },
    update: {},
  });
  await prisma.list.update({ where: { id }, data: { updatedAt: new Date() } });
  return NextResponse.json(item);
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/lists/[id]/items">) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await ownsList(id, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { mediaId, kind } = await req.json();
  await prisma.listItem.deleteMany({ where: { listId: id, mediaId, kind } });
  return NextResponse.json({ ok: true });
}
