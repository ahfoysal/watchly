import { getPopular } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getPopular());
  } catch (err) {
    console.error("[popular]", err);
    return Response.json([], { status: 200 });
  }
}
