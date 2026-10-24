"use client";

import { useEffect, useRef } from "react";
import { useVideoStore } from "@/store/video-store";
import { ResultCard } from "./result-card";
import { ResultError } from "./result-error";
import { ResultSkeleton } from "./skeleton";

export const Result = () => {
  const { status, video, error, url, fetchInfo } = useVideoStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  if (status === "idle") return null;

  return (
    <div ref={ref} className="mx-auto w-full max-w-2xl scroll-mt-20 px-6 pb-12">
      {status === "loading" && <ResultSkeleton />}

      {status === "error" && (
        <ResultError
          message={error ?? undefined}
          onRetry={url ? () => fetchInfo(url) : undefined}
        />
      )}

      {status === "success" && video && <ResultCard video={video} />}
    </div>
  );
};
