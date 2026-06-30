"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Bookmark, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/az", label: "Browse", icon: LayoutGrid, match: (p: string) => p.startsWith("/az") },
  { href: "/my-list", label: "List", icon: Bookmark, match: (p: string) => p.startsWith("/my-list") || p.startsWith("/lists") },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2">
        {TABS.slice(0, 1).map((t) => (
          <Tab key={t.href} {...t} active={t.match(pathname)} />
        ))}
        {TABS.slice(1, 2).map((t) => (
          <Tab key={t.href} {...t} active={t.match(pathname)} />
        ))}

        {/* center search */}
        <button
          onClick={() => window.dispatchEvent(new Event("animeflix:search"))}
          className="flex flex-col items-center gap-0.5 py-2"
          aria-label="Search"
        >
          <span className="-mt-5 flex size-12 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg shadow-primary/30">
            <Search className="size-5" />
          </span>
        </button>

        {TABS.slice(2).map((t) => (
          <Tab key={t.href} {...t} active={t.match(pathname)} />
        ))}

        <Tab
          href={session ? "/settings" : "/sign-in"}
          label={session ? "Account" : "Sign In"}
          icon={User}
          active={pathname.startsWith("/settings") || pathname.startsWith("/sign-in")}
        />
      </div>
    </nav>
  );
}

function Tab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
