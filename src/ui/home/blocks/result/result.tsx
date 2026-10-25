"use client";

import { useEffect, useRef } from "react";
import { useVideoStore } from "@/store";
import { useResult } from "@/hooks";
import { ResultCard } from "./result-card";
import { ResultError } from "./result-error";
import { ResultSkeleton } from "./skeleton";

export const Result = () => {
  const { status, video, error } = useVideoStore();
  const { retry, download } = useResult();
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
        <ResultError message={error ?? undefined} onRetry={retry} />
      )}
      {status === "success" && video && (
        <ResultCard video={video} onDownload={download} />
      )}{" "}
    </div>
  );
};
