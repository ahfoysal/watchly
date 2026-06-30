"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, UserCheck } from "lucide-react";
import { follow } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function FollowButton({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data } = useQuery({
    queryKey: ["follow", userId],
    queryFn: () => follow.state(userId),
  });

  const isSelf = session?.user.id === userId;
  const followers = data?.followers ?? 0;
  const isFollowing = data?.isFollowing ?? false;

  async function toggle() {
    if (!session) return;
    setBusy(true);
    try {
      if (isFollowing) await follow.remove(userId);
      else await follow.add(userId);
      await qc.invalidateQueries({ queryKey: ["follow", userId] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {followers} follower{followers === 1 ? "" : "s"}
      </span>
      {session && !isSelf && (
        <Button size="sm" variant={isFollowing ? "secondary" : "default"} onClick={toggle} disabled={busy} className="gap-1.5">
          {isFollowing ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  );
}
