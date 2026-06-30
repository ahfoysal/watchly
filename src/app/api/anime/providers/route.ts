import { getProviders } from "@/lib/consumet";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(getProviders());
}
