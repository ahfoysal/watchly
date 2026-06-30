import * as Sentry from "@sentry/nextjs";

export function register() {
  const dsn = process.env.SENTRY_DSN;
  if (
    dsn &&
    (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge")
  ) {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
  }
}

export const onRequestError = Sentry.captureRequestError;
