"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ProgressSync } from "@/components/system/progress-sync";
import { ServiceWorkerRegister } from "@/components/system/sw-register";

// Code-split: the command palette only matters on user interaction (⌘K),
// so keep it out of the initial bundle.
const CommandPalette = dynamic(
  () => import("@/components/system/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <ServiceWorkerRegister />
      <ProgressSync />
      <CommandPalette />
      {children}
    </QueryClientProvider>
  );
}
