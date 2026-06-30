import { Suspense } from "react";
import { SearchResults } from "@/components/browse/search-results";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SearchResults />
    </Suspense>
  );
}
