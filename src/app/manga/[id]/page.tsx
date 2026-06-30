import { MangaDetail } from "@/components/detail/manga-detail";

export default async function MangaPage({ params }: PageProps<"/manga/[id]">) {
  const { id } = await params;
  return <MangaDetail id={id} />;
}
