"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { api } from "@/lib/api";
import { useHydrated } from "@/lib/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function fmtTime(unix: number): string {
  try {
    return new Date(unix * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

function fmtDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
}

export function ScheduleSection() {
  const hydrated = useHydrated();
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
      <div className="overflow-hidden rounded-xl bg-card/50 ring-1 ring-border/50">
        {hydrated ? (
          <ScheduleInner />
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-bold sm:text-2xl">Estimated Schedule</h2>
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
        )}
      </div>
    </section>
  );
}

function ScheduleInner() {
  const { data } = useQuery({ queryKey: ["schedule"], queryFn: api.schedule });

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = now.getDay();
  const [day, setDay] = useState(today);
  const [showAll, setShowAll] = useState(false);

  // dates for the current week (Sunday-based)
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - today);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });

  const items = data?.[String(day)] ?? [];
  const shown = showAll ? items : items.slice(0, 6);

  return (
    <div className="p-5 sm:p-6">
      <h2 className="text-xl font-bold sm:text-2xl">
        Estimated Schedule{" "}
        <span className="text-sm font-normal text-muted-foreground">
          – Now: {now.toLocaleString("en-US")}
        </span>
      </h2>

      {/* day strip */}
      <div className="mt-4 flex items-center gap-1">
        <button
          onClick={() => setDay((d) => (d + 6) % 7)}
          aria-label="Previous day"
          className="hidden shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:block"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto sm:grid sm:grid-cols-7 sm:gap-0">
          {DAYS.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d}
                onClick={() => {
                  setDay(i);
                  setShowAll(false);
                }}
                className={`flex shrink-0 flex-col items-center border-b-2 px-3 py-2 transition sm:px-0 ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-[11px] font-medium opacity-80">
                  {fmtDate(dates[i])}
                </span>
                <span className="text-xl font-extrabold tracking-wide sm:text-2xl">
                  {d}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setDay((d) => (d + 1) % 7)}
          aria-label="Next day"
          className="hidden shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:block"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      {/* list */}
      <div className="mt-4 divide-y divide-border/40">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No scheduled episodes for this day.
          </p>
        ) : (
          shown.map((it) => (
            <div
              key={`${it.id}-${it.episode}`}
              className="flex items-center gap-4 py-3"
            >
              <span className="w-12 shrink-0 font-bold tabular-nums">
                {fmtTime(it.airingAt)}
              </span>
              <span className="line-clamp-1 flex-1 text-sm sm:text-base">
                {it.title}
              </span>
              <Link
                href={`/anime/${it.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Play className="size-3.5 fill-current" />
                Episode {it.episode}
              </Link>
            </div>
          ))
        )}
      </div>

      {items.length > 6 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-2 w-full rounded-lg py-3 text-center text-sm font-medium text-muted-foreground transition hover:bg-secondary/50 hover:text-foreground"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
