import { MangaReader } from "@/components/detail/manga-reader";

export const metadata = { title: "Read" };

export default async function ReadPage({ params }: PageProps<"/read/[chapterId]">) {
  const { chapterId } = await params;
  return <MangaReader chapterId={chapterId} />;
}
