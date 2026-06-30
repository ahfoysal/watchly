"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogIn, LogOut, Bookmark, ListVideo, Settings, Shuffle } from "lucide-react";
import { api } from "@/lib/api";
import { SearchBox } from "@/components/browse/search-box";
import { useTitleLang } from "@/store/title-lang";
import { useSession, signOut } from "@/lib/auth-client";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
  "Isekai", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological",
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
];

export function SiteHeader() {
  const router = useRouter();
  const currentQuery = useSearchParams().get("q") ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const genresRef = useRef<HTMLDivElement>(null);
  const lang = useTitleLang((s) => s.lang);
  const setLang = useTitleLang((s) => s.setLang);
  const { data: session } = useSession();
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (genresRef.current && !genresRef.current.contains(e.target as Node)) {
        setGenresOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  async function random() {
    try {
      const list = await api.popular();
      const pick = list[Math.floor(Math.random() * list.length)];
      if (pick) router.push(`/anime/${pick.id}`);
    } catch {
      /* ignore */
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-shadow ${
        scrolled ? "border-border/70 shadow-lg shadow-black/30" : "border-border/40"
      } bg-card`}
    >
      <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center text-lg font-extrabold tracking-tight drop-shadow-sm sm:text-xl"
        >
          <span className="text-brand">WATCH</span>
          <span>LY</span>
        </Link>

        <Link
          href="/az"
          className="hidden shrink-0 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
        >
          A–Z
        </Link>

        <div ref={genresRef} className="relative hidden shrink-0 md:block">
          <button
            onClick={() => setGenresOpen((o) => !o)}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Genres
            <ChevronDown className={`size-4 transition ${genresOpen ? "rotate-180" : ""}`} />
          </button>
          {genresOpen && (
            <div className="absolute left-0 top-[calc(100%+12px)] z-50 grid w-[420px] grid-cols-3 gap-1 rounded-xl border border-border bg-popover p-3 shadow-2xl shadow-black/50">
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={`/az?genre=${encodeURIComponent(g)}&sort=popular`}
                  onClick={() => setGenresOpen(false)}
                  className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}
        </div>

        <SearchBox key={currentQuery} initial={currentQuery} />

        <button
          onClick={random}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/70"
          aria-label="Random anime"
        >
          <Shuffle className="size-4" />
          <span className="hidden sm:inline">Random</span>
        </button>

        {/* EN/JP title language toggle */}
        <div className="hidden shrink-0 overflow-hidden rounded-md ring-1 ring-border sm:flex">
          {(["en", "jp"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 text-xs font-bold uppercase transition ${
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {session ? (
          <div ref={userRef} className="relative shrink-0">
            <button
              onClick={() => setUserOpen((o) => !o)}
              className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              aria-label="Account menu"
            >
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </button>
            {userOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/50">
                <div className="border-b border-border px-4 py-3">
                  <p className="line-clamp-1 text-sm font-semibold">{session.user.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <Link
                  href="/my-list"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-secondary"
                >
                  <Bookmark className="size-4" />
                  My List
                </Link>
                <Link
                  href="/lists"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-secondary"
                >
                  <ListVideo className="size-4" />
                  My Lists
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-secondary"
                >
                  <Settings className="size-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setUserOpen(false);
                    signOut().then(() => router.refresh());
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive transition hover:bg-secondary"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:flex"
          >
            <LogIn className="size-4" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
