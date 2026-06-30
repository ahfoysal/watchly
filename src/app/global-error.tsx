"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "#0e0e0e",
          color: "#e6e6e6",
          fontFamily: "Nunito, system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Something went wrong</h1>
        <p style={{ color: "#9a9a9a" }}>
          An unexpected error occurred. Please try again.
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          style={{
            marginTop: 8,
            padding: "10px 18px",
            borderRadius: 999,
            background: "#8c5ece",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Go home
        </a>
      </body>
    </html>
  );
}
