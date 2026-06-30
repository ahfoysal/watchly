"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ListRow } from "@/components/home/mini-list";
import { Skeleton } from "@/components/ui/skeleton";

const TABS = [
  { key: "day", label: "Day", sort: "trending" },
  { key: "week", label: "Week", sort: "popular" },
  { key: "month", label: "Month", sort: "score" },
];

export function TopAnime() {
  const [tab, setTab] = useState("day");
  const sort = TABS.find((t) => t.key === tab)!.sort;

  const { data, isLoading } = useQuery({
    queryKey: ["top", sort],
    queryFn: () => api.browse(sort, 1, { perPage: 10 }).then((r) => r.items),
  });

  return (
    <aside className="rounded-xl bg-card/50 p-3 ring-1 ring-border/50">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold">Top Anime</h3>
        <div className="flex gap-1 rounded-md bg-secondary p-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                t.key === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-16 w-12 rounded-md" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))
          : data?.map((a, idx) => (
              <div key={a.id} className="py-0.5">
                <ListRow anime={a} rank={idx + 1} />
              </div>
            ))}
      </div>
    </aside>
  );
}
