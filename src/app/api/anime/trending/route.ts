import { getTrending } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getTrending());
  } catch (err) {
    console.error("[trending]", err);
    return Response.json([], { status: 200 });
  }
}
