"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ListPlus, Plus } from "lucide-react";
import { lists } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface Props {
  mediaId: string;
  kind: string;
  title: string;
  image?: string;
}

export function AddToListMenu({ mediaId, kind, title, image }: Props) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [newName, setNewName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const { data: myLists } = useQuery({
    queryKey: ["lists"],
    queryFn: lists.mine,
    enabled: !!session && open,
  });

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (!session) {
    return (
      <Button size="lg" variant="secondary" className="gap-2" nativeButton={false} render={<Link href="/sign-in" />}>
        <ListPlus className="size-5" />
        Add to List
      </Button>
    );
  }

  async function add(listId: string) {
    await lists.addItem(listId, { mediaId, kind, title, image });
    setAdded((a) => ({ ...a, [listId]: true }));
    qc.invalidateQueries({ queryKey: ["lists"] });
  }

  async function createAndAdd() {
    const name = newName.trim();
    if (!name) return;
    const res = await lists.create(name);
    const l = await res.json();
    setNewName("");
    if (l?.id) await add(l.id);
  }

  return (
    <div ref={ref} className="relative">
      <Button size="lg" variant="secondary" className="gap-2" onClick={() => setOpen((o) => !o)}>
        <ListPlus className="size-5" />
        Add to List
      </Button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
          <div className="max-h-60 overflow-y-auto p-1">
            {myLists?.length ? (
              myLists.map((l) => (
                <button
                  key={l.id}
                  onClick={() => add(l.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition hover:bg-secondary"
                >
                  <span className="line-clamp-1">{l.name}</span>
                  {added[l.id] ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{l.count}</span>
                  )}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground">No lists yet.</p>
            )}
          </div>
          <div className="flex items-center gap-1 border-t border-border p-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createAndAdd()}
              placeholder="New list…"
              className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={createAndAdd}
              aria-label="Create list"
              className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
