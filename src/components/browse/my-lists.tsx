"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ListVideo } from "lucide-react";
import { lists } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function MyLists() {
  const { data: session, isPending } = useSession();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: lists.mine,
    enabled: !!session,
  });

  if (!isPending && !session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <p className="text-lg">Sign in to create lists.</p>
        <Button nativeButton={false} render={<Link href="/sign-in" />}>Sign In</Button>
      </div>
    );
  }

  async function create() {
    const n = name.trim();
    if (!n) return;
    await lists.create(n);
    setName("");
    qc.invalidateQueries({ queryKey: ["lists"] });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-5 text-2xl font-bold">My Lists</h1>

      <div className="mb-6 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="Create a new list…"
          className="h-9 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
        />
        <Button onClick={create} className="gap-1">
          <Plus className="size-4" />
          Create
        </Button>
      </div>

      {isLoading || isPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="py-16 text-center text-muted-foreground">
          No lists yet. Create one above, or use “Add to List” on any title.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((l) => (
            <Link
              key={l.id}
              href={`/lists/${l.id}`}
              className="group overflow-hidden rounded-lg ring-1 ring-border/50 transition hover:ring-primary/60"
            >
              <div className="grid aspect-video grid-cols-2 bg-muted">
                {l.covers.slice(0, 4).map((c, i) => (
                  <div key={i} className="relative">
                    <Image src={c!} alt="" fill sizes="160px" className="object-cover" unoptimized />
                  </div>
                ))}
                {l.covers.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center text-muted-foreground">
                    <ListVideo className="size-8" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="line-clamp-1 text-sm font-semibold">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.count} item{l.count === 1 ? "" : "s"} · {l.isPublic ? "Public" : "Private"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
