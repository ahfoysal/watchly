"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { watchlist } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface Props {
  mediaId: string;
  kind: string;
  title: string;
  image?: string;
}

export function WatchlistButton({ mediaId, kind, title, image }: Props) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data } = useQuery({
    queryKey: ["watchlist"],
    queryFn: watchlist.list,
    enabled: !!session,
  });

  if (!session) {
    return (
      <Button size="lg" variant="secondary" className="gap-2" nativeButton={false} render={<Link href="/sign-in" />}>
        <Bookmark className="size-5" />
        Add to List
      </Button>
    );
  }

  const inList = !!data?.some((i) => i.mediaId === mediaId && i.kind === kind);

  async function toggle() {
    setBusy(true);
    try {
      if (inList) await watchlist.remove(mediaId, kind);
      else await watchlist.add({ mediaId, kind, title, image });
      await qc.invalidateQueries({ queryKey: ["watchlist"] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      size="lg"
      variant={inList ? "default" : "secondary"}
      className="gap-2"
      onClick={toggle}
      disabled={busy}
    >
      {inList ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
      {inList ? "In My List" : "Add to List"}
    </Button>
  );
}
