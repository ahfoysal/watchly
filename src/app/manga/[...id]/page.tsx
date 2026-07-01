import { MangaDetail } from "@/components/detail/manga-detail";

// WeebCentral manga IDs contain a slash (e.g. `01J.../One-Piece`), so this is a
// catch-all route; we rejoin the captured segments back into the full id.
export default async function MangaPage({ params }: PageProps<"/manga/[...id]">) {
  const { id } = await params;
  return <MangaDetail id={id.join("/")} />;
}
