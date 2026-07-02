import type { Metadata } from "next";
import { AnimeDetail } from "@/components/detail/anime-detail";
import { getAnimeMeta } from "@/lib/consumet";

export async function generateMetadata({
  params,
}: PageProps<"/anime/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const m = await getAnimeMeta(id);
    const description = m.description?.slice(0, 200);
    const images = m.cover || m.image ? [(m.cover || m.image)!] : undefined;
    return {
      title: m.title,
      description,
      openGraph: { title: m.title, description, images, type: "video.tv_show" },
      twitter: { card: "summary_large_image", title: m.title, description, images },
    };
  } catch {
    return {};
  }
}

export default async function AnimePage({ params }: PageProps<"/anime/[id]">) {
  const { id } = await params;
  return <AnimeDetail id={id} />;
}
