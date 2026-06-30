import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-brand">ANIME</span>
          <span>FLIX</span>
        </Link>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Watchly is a free streaming demo for anime, manga, and movies, built
          on Next.js and the open-source Consumet engine, with metadata from
          AniList. It hosts no content and is for educational/portfolio use only.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/az" className="hover:text-foreground">A–Z List</Link>
          <Link href="/search?q=one+piece" className="hover:text-foreground">Search</Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Watchly · Data from AniList & Consumet
        </p>
      </div>
    </footer>
  );
}
