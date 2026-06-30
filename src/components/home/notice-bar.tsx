"use client";

import { Info } from "lucide-react";

const SHARES = [
  { label: "Share", color: "bg-[#1877f2]", href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { label: "Post", color: "bg-black", href: (u: string) => `https://twitter.com/intent/tweet?url=${u}` },
  { label: "Share", color: "bg-[#25d366]", href: (u: string) => `https://wa.me/?text=${u}` },
  { label: "Share", color: "bg-[#ff4500]", href: (u: string) => `https://www.reddit.com/submit?url=${u}` },
  { label: "Share", color: "bg-[#229ed9]", href: (u: string) => `https://t.me/share/url?url=${u}` },
];

export function NoticeBar() {
  function share(make: (u: string) => string) {
    const u = encodeURIComponent(
      typeof window !== "undefined" ? window.location.origin : "",
    );
    window.open(make(u), "_blank", "noopener,width=640,height=540");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-card/60 p-3 ring-1 ring-border/50 sm:flex-row sm:items-center">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" />
        If you enjoy the site, please consider sharing it with your friends. Thank you!
      </p>
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        {SHARES.map((s, i) => (
          <button
            key={i}
            onClick={() => share(s.href)}
            className={`rounded px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 ${s.color}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
