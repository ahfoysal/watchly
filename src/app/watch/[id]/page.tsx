import { WatchView } from "@/components/watch/watch-view";

export default async function WatchPage({
  params,
  searchParams,
}: PageProps<"/watch/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const ep = typeof sp.ep === "string" ? sp.ep : "";
  const num = typeof sp.num === "string" ? parseInt(sp.num, 10) || 1 : 1;
  const provider = typeof sp.provider === "string" ? sp.provider : undefined;
  const dub = sp.dub === "1" || sp.dub === "true";

  if (!ep) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        No episode selected.
      </div>
    );
  }

  return <WatchView id={id} ep={ep} num={num} provider={provider} dub={dub} />;
}
