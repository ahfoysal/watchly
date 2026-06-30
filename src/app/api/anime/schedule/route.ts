import { getSchedule } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getSchedule());
  } catch (err) {
    console.error("[schedule]", err);
    return Response.json({}, { status: 200 });
  }
}
