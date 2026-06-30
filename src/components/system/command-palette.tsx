"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Home, ListVideo, Bookmark, Settings, CornerDownLeft } from "lucide-react";
import { api } from "@/lib/api";

type Item = { label: string; sub?: string; image?: string; href: string };

const NAV: Item[] = [
  { label: "Home", href: "/", sub: "Browse" },
  { label: "A–Z List", href: "/az", sub: "Catalog" },
  { label: "My List", href: "/my-list", sub: "Saved" },
  { label: "Settings", href: "/settings", sub: "Preferences" },
];

const NAV_ICONS = [Home, ListVideo, Bookmark, Settings];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);

  // global ⌘K / Ctrl-K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("animeflix:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("animeflix:search", onOpen);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  const { data: results = [] } = useQuery({
    queryKey: ["cmdk", debounced],
    queryFn: () => api.search(debounced),
    enabled: open && debounced.length >= 2,
  });

  const items: Item[] = useMemo(() => {
    const nav = NAV.filter(
      (n) => !q || n.label.toLowerCase().includes(q.toLowerCase()),
    );
    const found: Item[] = results.slice(0, 7).map((a) => ({
      label: a.title,
      sub: [a.type, a.releaseDate].filter(Boolean).join(" · "),
      image: a.image,
      href: `/anime/${a.id}`,
    }));
    const search: Item[] = q.trim()
      ? [{ label: `Search “${q.trim()}”`, href: `/search?q=${encodeURIComponent(q.trim())}` }]
      : [];
    return [...nav, ...found, ...search];
  }, [q, results]);

  if (!open) return null;

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && items[active]) {
                go(items[active].href);
              }
            }}
            placeholder="Search or jump to…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded bg-secondary px-1.5 text-xs text-muted-foreground">esc</kbd>
        </div>

        <ul className="max-h-[55vh] overflow-y-auto p-1">
          {items.map((it, i) => {
            const NavIcon = i < NAV.length ? NAV_ICONS[i] : null;
            return (
              <li key={`${it.href}-${i}`}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it.href)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                    i === active ? "bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  {it.image ? (
                    <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded bg-muted">
                      <Image src={it.image} alt="" fill sizes="28px" className="object-cover" unoptimized />
                    </div>
                  ) : NavIcon ? (
                    <NavIcon className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-sm font-medium">{it.label}</span>
                    {it.sub && (
                      <span className="line-clamp-1 text-xs text-muted-foreground">{it.sub}</span>
                    )}
                  </span>
                  {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
