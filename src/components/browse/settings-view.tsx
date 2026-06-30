"use client";

import { useHydrated } from "@/lib/use-hydrated";
import { usePlayerPrefs } from "@/store/player-prefs";
import { useTitleLang } from "@/store/title-lang";
import { useHidden } from "@/store/hidden";
import { useContinueWatching } from "@/store/continue-watching";
import { Button } from "@/components/ui/button";

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={on} className="shrink-0">
      <span
        className={`relative block h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function SettingsView() {
  const hydrated = useHydrated();
  const prefs = usePlayerPrefs();
  const lang = useTitleLang((s) => s.lang);
  const setLang = useTitleLang((s) => s.setLang);
  const hiddenCount = useHidden((s) => Object.keys(s.ids).length);
  const clearHidden = useHidden((s) => s.clear);
  const clearCW = useContinueWatching((s) => s.clearAll);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <section className="rounded-xl bg-card/50 p-4 ring-1 ring-border/50">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Playback
        </h2>
        <div className="divide-y divide-border/40">
          <Row label="Autoplay next episode" desc="Auto-advance when an episode ends">
            <Toggle on={prefs.autoplayNext} onClick={() => prefs.setAutoplayNext(!prefs.autoplayNext)} />
          </Row>
          <Row label="Auto-skip intro" desc="Skip the opening automatically">
            <Toggle on={prefs.autoSkipIntro} onClick={() => prefs.setAutoSkipIntro(!prefs.autoSkipIntro)} />
          </Row>
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-card/50 p-4 ring-1 ring-border/50">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Display
        </h2>
        <Row label="Title language" desc="Show English or Japanese (romaji) titles">
          <div className="inline-flex overflow-hidden rounded-md ring-1 ring-border">
            {(["en", "jp"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs font-bold uppercase transition ${
                  lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Row>
      </section>

      <section className="mt-6 rounded-xl bg-card/50 p-4 ring-1 ring-border/50">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Data & Privacy
        </h2>
        <div className="divide-y divide-border/40">
          <Row
            label="Hidden titles"
            desc={hydrated ? `${hiddenCount} hidden via “Not interested”` : "…"}
          >
            <Button variant="secondary" size="sm" onClick={clearHidden} disabled={!hiddenCount}>
              Reset
            </Button>
          </Row>
          <Row label="Continue watching" desc="Clear your local resume history">
            <Button variant="secondary" size="sm" onClick={clearCW}>
              Clear
            </Button>
          </Row>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          No dark patterns: preferences are stored locally; signed-in watchlist &amp;
          progress live in your account and can be cleared anytime.
        </p>
      </section>
    </div>
  );
}
