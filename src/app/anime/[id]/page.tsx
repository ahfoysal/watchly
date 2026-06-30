import { AnimeDetail } from "@/components/detail/anime-detail";

export default async function AnimePage({ params }: PageProps<"/anime/[id]">) {
  const { id } = await params;
  return <AnimeDetail id={id} />;
}
