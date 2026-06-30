"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { api } from "@/lib/api";
import { pickName, useTitleLang } from "@/store/title-lang";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const lang = useTitleLang((s) => s.lang);
  const [q, setQ] = useState(initial);
  const [debounced, setDebounced] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // debounce (setState inside a timeout is allowed by the effect rules)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 280);
    return () => clearTimeout(t);
  }, [q]);

  const { data = [], isFetching } = useQuery({
    queryKey: ["suggest", debounced],
    queryFn: () => api.search(debounced),
    enabled: debounced.length >= 2,
  });

  const results = data.slice(0, 6);

  // close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submit(term: string) {
    const t = term.trim();
    if (t) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(t)}`);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && results[active]) {
        setOpen(false);
        router.push(`/anime/${results[active].id}`);
      } else {
        submit(q);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && debounced.length >= 2;

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search anime…"
          aria-label="Search anime"
          className="h-9 w-full rounded-full border border-input bg-card/80 pl-9 pr-4 text-sm outline-none backdrop-blur-sm placeholder:text-muted-foreground focus:border-primary"
        />
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
            <span className="font-semibold text-foreground">Anime</span>
            {isFetching && <span className="text-muted-foreground">Searching…</span>}
          </div>

          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {isFetching ? "Searching…" : "No results"}
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((a, i) => (
                <li key={a.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/anime/${a.id}`);
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                      i === active ? "bg-secondary" : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
                      {a.image && (
                        <Image src={a.image} alt="" fill sizes="48px" className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">{pickName(a, lang)}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                        {typeof a.rating === "number" && a.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-yellow-400">
                            <Star className="size-3 fill-yellow-400" />
                            {(a.rating / 10).toFixed(1)}
                          </span>
                        )}
                        {a.type && <span>{a.type}</span>}
                        {a.releaseDate && <span>· {a.releaseDate}</span>}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => submit(q)}
            className="flex w-full items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground transition hover:bg-secondary/60"
          >
            <span className="hidden gap-2 sm:flex">
              <kbd className="rounded bg-secondary px-1.5">↑↓</kbd> navigate
              <kbd className="rounded bg-secondary px-1.5">↵</kbd> select
              <kbd className="rounded bg-secondary px-1.5">esc</kbd> exit
            </span>
            <span className="font-semibold text-primary">View all →</span>
          </button>
        </div>
      )}
    </div>
  );
}
