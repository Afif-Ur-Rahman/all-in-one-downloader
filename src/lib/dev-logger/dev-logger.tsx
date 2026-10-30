"use client";

import {
  Bug,
  X,
  Trash2,
  Pause,
  Play,
  ChevronDown,
  Search,
  Copy,
  Check,
  Terminal,
  Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { cn } from "@/lib";
import { isNetworkEntry, LogEntry, useLoggerStore } from "./logger-store";
import { patchConsole } from "./console-patch";
import { patchNetwork } from "./network-patch";

type FilterTab = "all" | "console" | "network" | "errors";

const LEVEL_COLOR: Record<string, string> = {
  log: "text-foreground",
  info: "text-sky-500",
  warn: "text-amber-500",
  error: "text-red-500",
};

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "console", label: "Console" },
  { value: "network", label: "Network" },
  { value: "errors", label: "Errors" },
];

const iconButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground";

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const stringifyPretty = (value: unknown) => {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const isEntryError = (entry: LogEntry) => {
  if (isNetworkEntry(entry)) {
    return Boolean(entry.error) || Boolean(entry.status && entry.status >= 400);
  }
  return entry.level === "error";
};

const EntryRow = ({ entry }: { entry: LogEntry }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const network = isNetworkEntry(entry);
  const isError = isEntryError(entry);

  const summary = network
    ? `${entry.method} ${entry.url}`
    : entry.message.split("\n")[0];

  const statusBadge = network
    ? entry.pending
      ? "…"
      : entry.error
        ? "ERR"
        : entry.status
    : null;

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    const payload = isNetworkEntry(entry)
      ? JSON.stringify(
          {
            method: entry.method,
            url: entry.url,
            status: entry.status,
            requestBody: entry.requestBody,
            responseBody: entry.responseBody,
            error: entry.error,
          },
          null,
          2,
        )
      : entry.message;

    navigator.clipboard
      .writeText(payload)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  return (
    <div
      className={cn(
        "border-b border-border px-3 py-2 text-xs transition-colors hover:bg-surface-muted",
        isError && "bg-red-500/5",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className="flex w-full cursor-pointer items-start gap-2 rounded-md text-left"
      >
        {network ? (
          <Wifi className="mt-0.5 size-3.5 shrink-0 text-sky-500" aria-hidden />
        ) : (
          <Terminal
            className={cn("mt-0.5 size-3.5 shrink-0", LEVEL_COLOR[entry.level])}
            aria-hidden
          />
        )}

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate font-mono",
              network ? "text-foreground" : LEVEL_COLOR[entry.level],
            )}
          >
            {summary}
          </span>
          <span className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted">
            {formatTime(entry.timestamp)}
            {network && entry.duration !== undefined && (
              <span>· {entry.duration}ms</span>
            )}
          </span>
        </span>

        {statusBadge !== null && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
              isError
                ? "bg-red-500/10 text-red-500"
                : "bg-green-500/10 text-green-600 dark:text-green-400",
            )}
          >
            {statusBadge}
          </span>
        )}

        <span className="relative shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex size-6 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Copy entry"
          >
            {copied ? (
              <Check className="size-3 text-green-500" aria-hidden />
            ) : (
              <Copy className="size-3" aria-hidden />
            )}
          </button>

          {copied && (
            <span
              role="status"
              className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-medium whitespace-nowrap text-background shadow-lg"
            >
              Copied!
            </span>
          )}
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            "mt-0.5 size-3.5 shrink-0 text-muted transition-transform",
            expanded && "rotate-180",
          )}
        />
      </div>

      {expanded && (
        <div className="mt-2 space-y-2 rounded-xl border border-border bg-surface-muted p-2">
          {network ? (
            <>
              {entry.requestBody !== undefined && (
                <div>
                  <p className="mb-1 font-mono text-[10px] font-semibold tracking-widest text-muted uppercase">
                    Request
                  </p>
                  <pre className="font-mono text-[11px] break-all whitespace-pre-wrap text-foreground">
                    {stringifyPretty(entry.requestBody)}
                  </pre>
                </div>
              )}
              {entry.responseBody !== undefined && (
                <div>
                  <p className="mb-1 font-mono text-[10px] font-semibold tracking-widest text-muted uppercase">
                    Response
                  </p>
                  <pre className="font-mono text-[11px] break-all whitespace-pre-wrap text-foreground">
                    {stringifyPretty(entry.responseBody)}
                  </pre>
                </div>
              )}
              {entry.error && (
                <p className="font-mono text-[11px] text-red-500">
                  {entry.error}
                </p>
              )}
            </>
          ) : (
            <pre className="font-mono text-[11px] break-all whitespace-pre-wrap text-foreground">
              {entry.message}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const DevLogger = () => {
  const { entries, paused, clear, togglePaused } = useLoggerStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    patchConsole();
    patchNetwork();
  }, []);

  const errorCount = useMemo(
    () => entries.filter(isEntryError).length,
    [entries],
  );

  const filtered = useMemo(() => {
    let list = entries;

    if (tab === "console") list = list.filter((e) => e.kind === "console");
    if (tab === "network") list = list.filter((e) => e.kind === "network");
    if (tab === "errors") list = list.filter(isEntryError);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        (isNetworkEntry(e) ? `${e.method} ${e.url}` : e.message)
          .toLowerCase()
          .includes(q),
      );
    }

    return list;
  }, [entries, tab, search]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-5 bottom-5 z-9999 flex size-12 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-accent shadow-xl transition-colors hover:bg-surface-muted active:scale-95"
        aria-label="Toggle dev logger"
        aria-expanded={open}
      >
        <Bug className="size-5" aria-hidden />
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {errorCount > 99 ? "99+" : errorCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Dev logger"
          className="fixed right-5 bottom-20 z-9999 flex h-125 w-95 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-surface text-foreground shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-sm font-bold tracking-tight">
              Dev Logger
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={togglePaused}
                className={iconButton}
                aria-label={paused ? "Resume logging" : "Pause logging"}
              >
                {paused ? (
                  <Play className="size-3.5" aria-hidden />
                ) : (
                  <Pause className="size-3.5" aria-hidden />
                )}
              </button>

              <button
                type="button"
                onClick={clear}
                className={iconButton}
                aria-label="Clear logs"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={iconButton}
                aria-label="Close dev logger"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          </div>

          <div className="border-b border-border px-3 py-2">
            <div
              role="tablist"
              aria-label="Log filter"
              className="inline-flex rounded-xl bg-surface-muted p-1"
            >
              {TABS.map((t) => {
                const isActive = tab === t.value;

                return (
                  <button
                    key={t.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(t.value)}
                    className={cn(
                      "h-7 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-b border-border px-3 py-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5 transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 hover:border-foreground/25">
              <Search className="size-3.5 shrink-0 text-muted" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter logs..."
                aria-label="Filter logs"
                className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted/70 focus-visible:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted">
                {paused ? "Logging paused" : "No logs yet"}
              </p>
            ) : (
              filtered.map((entry) => <EntryRow key={entry.id} entry={entry} />)
            )}
          </div>
        </div>
      )}
    </>
  );
};
