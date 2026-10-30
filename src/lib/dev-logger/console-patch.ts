"use client";

import { shouldIgnoreConsoleMessage } from "./ignore-rules";
import { useLoggerStore, genLogId } from "./logger-store";

let patched = false;

const stringifyArg = (arg: unknown): string => {
  if (typeof arg === "string") return arg;
  if (arg instanceof Error) return arg.stack || arg.message;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
};

export const patchConsole = () => {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  (["log", "info", "warn", "error"] as const).forEach(level => {
    console[level] = (...args: unknown[]) => {
      original[level](...args);

      const message = args.map(stringifyArg).join(" ");

      if (shouldIgnoreConsoleMessage(message)) return;

      useLoggerStore.getState().addEntry({
        id: genLogId(),
        kind: "console",
        level,
        message,
        timestamp: Date.now(),
      });
    };
  });

  window.addEventListener("error", event => {
    if (shouldIgnoreConsoleMessage(event.message)) return;

    useLoggerStore.getState().addEntry({
      id: genLogId(),
      kind: "console",
      level: "error",
      message: event.message,
      timestamp: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", event => {
    const message = `Unhandled promise rejection: ${stringifyArg(event.reason)}`;

    if (shouldIgnoreConsoleMessage(message)) return;

    useLoggerStore.getState().addEntry({
      id: genLogId(),
      kind: "console",
      level: "error",
      message,
      timestamp: Date.now(),
    });
  });
};
