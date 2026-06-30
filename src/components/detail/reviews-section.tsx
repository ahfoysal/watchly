"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { reviews } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`size-7 transition ${
              n <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </span>
  );
}

export function ReviewsSection({ mediaId, kind }: { mediaId: string; kind: string }) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", mediaId, kind],
    queryFn: () => reviews.list(mediaId, kind),
  });

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  const mine = data?.mine;
  const showForm = !!session && (editing || !mine);

  async function submit() {
    if (rating < 1) return;
    setBusy(true);
    try {
      await reviews.save(mediaId, kind, rating, body);
      await qc.invalidateQueries({ queryKey: ["reviews", mediaId, kind] });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await reviews.remove(mediaId, kind);
      await qc.invalidateQueries({ queryKey: ["reviews", mediaId, kind] });
      setRating(0);
      setBody("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-bold">Reviews</h2>
        {data && data.count > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Stars value={Math.round(data.average)} />
            {data.average.toFixed(1)} · {data.count} review{data.count > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Write / edit */}
      {!session ? (
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      ) : showForm ? (
        <div className="mb-6 rounded-lg bg-card/60 p-4 ring-1 ring-border/50">
          <StarInput value={rating || mine?.rating || 0} onChange={setRating} />
          <textarea
            value={body || mine?.body || ""}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts (optional)…"
            rows={3}
            className="mt-3 w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={submit} disabled={busy || (rating || mine?.rating || 0) < 1}>
              {mine ? "Update review" : "Post review"}
            </Button>
            {mine && (
              <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        mine && (
          <div className="mb-6 flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Your rating:</span>
            <Stars value={mine.rating} />
            <button onClick={() => { setEditing(true); setRating(mine.rating); setBody(mine.body || ""); }} className="text-primary hover:underline">
              Edit
            </button>
            <button onClick={remove} disabled={busy} className="text-destructive hover:underline">
              Delete
            </button>
          </div>
        )
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.reviews.length ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first.</p>
      ) : (
        <div className="space-y-3">
          {data.reviews.map((r) => (
            <div key={r.id} className="rounded-lg bg-card/40 p-4 ring-1 ring-border/40">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {r.user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="text-sm font-semibold">{r.user.name}</span>
                {r.isMine && (
                  <span className="rounded bg-secondary px-1.5 text-[10px] text-muted-foreground">You</span>
                )}
                <span className="ml-auto">
                  <Stars value={r.rating} size="size-3.5" />
                </span>
              </div>
              {r.body && <p className="mt-2 text-sm text-foreground/80">{r.body}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
