"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { watchlist } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MediaKind } from "@/lib/types";

export function MyList() {
  const { data: session, isPending } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: watchlist.list,
    enabled: !!session,
  });

  if (!isPending && !session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <p className="text-lg">Sign in to view your list.</p>
        <Button nativeButton={false} render={<Link href="/sign-in" />}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">My List</h1>

      {isLoading || isPending ? (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="py-24 text-center text-muted-foreground">
          Your list is empty. Add titles with the “Add to List” button.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {data.map((it) => (
            <MediaCard
              key={it.id}
              anime={{
                id: it.mediaId,
                title: it.title,
                image: it.image ?? undefined,
                kind: it.kind as MediaKind,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
