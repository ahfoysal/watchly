import { Suspense } from "react";
import { BrowseView } from "@/components/browse/browse-view";

export const metadata = { title: "A–Z List" };

export default function AzPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <BrowseView />
    </Suspense>
  );
}
