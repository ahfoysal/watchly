import Link from "next/link";

const LETTERS = [
  "All",
  "#",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
];

export function AzBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h2 className="mb-3 text-lg font-bold">A–Z List</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Browse the full catalog alphabetically.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href="/az"
            className="min-w-8 rounded-md bg-secondary px-2.5 py-1.5 text-center text-sm font-semibold text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            {l}
          </Link>
        ))}
      </div>
    </section>
  );
}
