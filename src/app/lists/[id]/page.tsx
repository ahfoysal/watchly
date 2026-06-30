import { ListView } from "@/components/browse/list-view";

export const metadata = { title: "List" };

export default async function ListPage({ params }: PageProps<"/lists/[id]">) {
  const { id } = await params;
  return <ListView id={id} />;
}
