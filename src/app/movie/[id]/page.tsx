import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchlistButton } from "@/components/system/watchlist-button";

export const metadata = { title: "Movies & TV" };

export default async function MoviePage({
  params,
  searchParams,
}: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const title = typeof sp.t === "string" ? sp.t : "This title";
  const img = typeof sp.img === "string" ? sp.img : undefined;
  const kindParam = typeof sp.type === "string" ? sp.type : "movie";
  const kind = kindParam.toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-1"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {img && (
          <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
            <Image src={img} alt={title} fill className="object-cover" unoptimized />
          </div>
        )}
        <div>
          <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-semibold">
            <Film className="size-3" />
            {kind}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Full details and streaming for Movies &amp; TV are temporarily
            unavailable — the Consumet movie source providers (FlixHQ, Goku, SFlix,
            HiMovies) are offline right now. Browsing is powered by TMDB metadata and
            playback will return automatically once a provider recovers.
          </p>
          <div className="mt-5">
            <WatchlistButton
              mediaId={id}
              kind={kindParam === "tv" ? "tv" : "movie"}
              title={title}
              image={img}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
