import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  const session = await getSession();
  const [followers, following, isFollowing] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    session
      ? prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
        })
      : null,
  ]);
  return NextResponse.json({ followers, following, isFollowing: !!isFollowing });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId } = await req.json();
  if (!userId || userId === session.user.id) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    create: { followerId: session.user.id, followingId: userId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId } = await req.json();
  await prisma.follow.deleteMany({
    where: { followerId: session.user.id, followingId: userId },
  });
  return NextResponse.json({ ok: true });
}
