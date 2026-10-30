"use client";

import { create } from "zustand";

export type LogLevel = "log" | "info" | "warn" | "error";
export const isNetworkEntry = (entry: LogEntry): entry is NetworkLogEntry =>
  entry.kind === "network";

export interface ConsoleLogEntry {
  id: string;
  kind: "console";
  level: LogLevel;
  message: string;
  timestamp: number;
}

export interface NetworkLogEntry {
  id: string;
  kind: "network";
  method: string;
  url: string;
  status?: number;
  ok?: boolean;
  duration?: number;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: string;
  timestamp: number;
  pending: boolean;
}

export type LogEntry = ConsoleLogEntry | NetworkLogEntry;

const MAX_ENTRIES = 300;

interface LoggerState {
  entries: LogEntry[];
  paused: boolean;
  addEntry: (entry: LogEntry) => void;
  updateEntry: (id: string, patch: Partial<NetworkLogEntry>) => void;
  clear: () => void;
  togglePaused: () => void;
}

export const useLoggerStore = create<LoggerState>(set => ({
  entries: [],
  paused: false,
  addEntry: entry =>
    set(state => {
      if (state.paused) return state;
      const next = [entry, ...state.entries];
      if (next.length > MAX_ENTRIES) next.length = MAX_ENTRIES;
      return { entries: next };
    }),
  updateEntry: (id, patch) =>
    set(state => ({
      entries: state.entries.map(e =>
        e.kind === "network" && e.id === id ? { ...e, ...patch } : e,
      ),
    })),
  clear: () => set({ entries: [] }),
  togglePaused: () => set(state => ({ paused: !state.paused })),
}));

export const genLogId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
