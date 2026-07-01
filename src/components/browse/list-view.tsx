"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Trash2, X, Lock } from "lucide-react";
import { lists } from "@/lib/api";
import type { MediaKind } from "@/lib/types";
import { MediaCard } from "@/components/media/media-card";
import { FollowButton } from "@/components/system/follow-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ListView({ id }: { id: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["list", id],
    queryFn: () => lists.get(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
        <Skeleton className="h-9 w-1/3" />
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <Lock className="size-10" />
        <p className="text-lg">This list is private or doesn’t exist.</p>
        <Button variant="secondary" nativeButton={false} render={<Link href="/" />}>
          Back home
        </Button>
      </div>
    );
  }

  async function removeItem(mediaId: string, kind: string) {
    await lists.removeItem(id, mediaId, kind);
    qc.invalidateQueries({ queryKey: ["list", id] });
  }

  async function deleteList() {
    await lists.remove(id);
    router.push("/lists");
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            by {data.owner.name} · {data.items.length} item{data.items.length === 1 ? "" : "s"}
            {!data.isPublic && " · Private"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FollowButton userId={data.owner.id} />
          {data.isOwner && (
            <Button size="sm" variant="secondary" onClick={deleteList} className="gap-1.5">
              <Trash2 className="size-4" />
              Delete list
            </Button>
          )}
        </div>
      </div>

      {data.items.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">This list is empty.</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {data.items.map((it) => (
            <div key={`${it.kind}-${it.mediaId}`} className="group/li relative">
              <MediaCard
                anime={{
                  id: it.mediaId,
                  title: it.title,
                  image: it.image ?? undefined,
                  kind: it.kind as MediaKind,
                }}
              />
              {data.isOwner && (
                <button
                  onClick={() => removeItem(it.mediaId, it.kind)}
                  aria-label="Remove from list"
                  className="absolute right-1.5 top-1.5 z-20 flex size-6 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition hover:bg-destructive group-hover/li:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
