"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const name = String(fd.get("name") || "");

    const res = isSignup
      ? await signUp.email({ email, password, name })
      : await signIn.email({ email, password });

    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Something went wrong");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <Link href="/" className="mb-6 text-center text-2xl font-extrabold tracking-tight">
        <span className="text-primary">ANIME</span>
        <span>FLIX</span>
      </Link>

      <div className="rounded-xl bg-card/60 p-6 ring-1 ring-border/50">
        <h1 className="text-xl font-bold">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignup
            ? "Sign up to sync your watchlist across devices."
            : "Sign in to access your watchlist."}
        </p>

        {googleEnabled && (
          <>
            <Button
              type="button"
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
            >
              Continue with Google
            </Button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className={`${googleEnabled ? "" : "mt-5"} space-y-3`}>
          {isSignup && (
            <Input name="name" placeholder="Name" required autoComplete="name" />
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (min 8 chars)"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : isSignup ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={isSignup ? "/sign-in" : "/sign-up"}
            className="font-semibold text-primary hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
