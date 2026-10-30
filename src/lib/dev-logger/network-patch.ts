"use client";

import { shouldIgnoreNetworkUrl } from "./ignore-rules";
import { useLoggerStore, genLogId } from "./logger-store";

let patched = false;

const MAX_BODY_CHARS = 2000;

// Streams and file downloads must never be read into memory by the logger.
const skippedBody = (
  contentType: string,
  disposition: string,
): string | null => {
  if (contentType.includes("text/event-stream")) return "[event stream]";
  if (disposition.toLowerCase().includes("attachment"))
    return "[file download]";
  if (contentType && !/json|text|xml|javascript/i.test(contentType)) {
    return `[${contentType}]`;
  }
  return null;
};

const parseText = (text: string): unknown => {
  if (!text.trim()) return undefined;

  // Normal JSON
  try {
    return JSON.parse(text);
  } catch {
    // Continue
  }

  // Next.js RSC / React Flight
  const parsedResponses: unknown[] = [];

  for (const line of text.split("\n")) {
    const match = line.match(/^\d+:(\{.*\})$/);

    if (!match) continue;

    try {
      parsedResponses.push(JSON.parse(match[1]));
    } catch {
      // Ignore invalid JSON
    }
  }

  const apiResponse = parsedResponses.findLast(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      ("state" in item || "data" in item || "error" in item),
  );

  return apiResponse ?? parsedResponses.at(-1) ?? text.slice(0, MAX_BODY_CHARS);
};

const safeStringifyBody = (body: unknown) => {
  if (!body) return undefined;

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  if (body instanceof FormData) {
    const obj: Record<string, unknown> = {};

    body.forEach((value, key) => {
      obj[key] = value instanceof File ? `File(${value.name})` : value;
    });

    return obj;
  }

  if (body instanceof URLSearchParams) return body.toString();
  if (body instanceof Blob) return `[Blob ${body.type || "binary"}]`;
  if (body instanceof ArrayBuffer) return "[ArrayBuffer]";

  return body;
};

const patchFetch = () => {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const [input, init] = args;
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

    if (shouldIgnoreNetworkUrl(url)) {
      return originalFetch(...args);
    }

    const method =
      init?.method || (input instanceof Request ? input.method : "GET");
    const id = genLogId();
    const startedAt = Date.now();

    useLoggerStore.getState().addEntry({
      id,
      kind: "network",
      method,
      url,
      timestamp: startedAt,
      pending: true,
      requestBody: safeStringifyBody(init?.body),
    });

    try {
      const response = await originalFetch(...args);

      const skipped = skippedBody(
        response.headers.get("content-type") ?? "",
        response.headers.get("content-disposition") ?? "",
      );

      useLoggerStore.getState().updateEntry(id, {
        status: response.status,
        ok: response.ok,
        duration: Date.now() - startedAt,
        responseBody: skipped ?? undefined,
        pending: false,
      });

      // Read the body in the background so the caller is never delayed.
      if (!skipped) {
        void response
          .clone()
          .text()
          .then((text) =>
            useLoggerStore
              .getState()
              .updateEntry(id, { responseBody: parseText(text) }),
          )
          .catch(() => undefined);
      }

      return response;
    } catch (error) {
      useLoggerStore.getState().updateEntry(id, {
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startedAt,
        pending: false,
      });

      throw error;
    }
  };
};

type TrackedXhr = XMLHttpRequest & {
  __log?: { id: string; method: string; url: string; ignored: boolean };
};

const readXhrBody = (xhr: XMLHttpRequest): unknown => {
  const skipped = skippedBody(
    xhr.getResponseHeader("content-type") ?? "",
    xhr.getResponseHeader("content-disposition") ?? "",
  );

  if (skipped) return skipped;

  if (xhr.responseType === "" || xhr.responseType === "text") {
    return parseText(xhr.responseText);
  }

  if (xhr.responseType === "json") return xhr.response ?? undefined;

  return `[${xhr.responseType}]`;
};

// axios sends requests with XMLHttpRequest in the browser, not fetch.
const patchXhr = () => {
  const proto = XMLHttpRequest.prototype;
  const originalOpen = proto.open;
  const originalSend = proto.send;

  proto.open = function (
    this: TrackedXhr,
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) {
    const href = String(url);

    this.__log = {
      id: genLogId(),
      method: method.toUpperCase(),
      url: href,
      ignored: shouldIgnoreNetworkUrl(href),
    };

    return originalOpen.apply(this, [
      method,
      url,
      async ?? true,
      username,
      password,
    ] as Parameters<typeof originalOpen>);
  } as typeof proto.open;

  proto.send = function (
    this: TrackedXhr,
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const info = this.__log;

    if (info && !info.ignored) {
      const startedAt = Date.now();

      useLoggerStore.getState().addEntry({
        id: info.id,
        kind: "network",
        method: info.method,
        url: info.url,
        timestamp: startedAt,
        pending: true,
        requestBody: safeStringifyBody(body),
      });

      this.addEventListener("loadend", () => {
        const failed = this.status === 0;

        useLoggerStore.getState().updateEntry(info.id, {
          status: failed ? undefined : this.status,
          ok: !failed && this.status >= 200 && this.status < 300,
          duration: Date.now() - startedAt,
          responseBody: failed ? undefined : readXhrBody(this),
          error: failed ? "Network error or request aborted" : undefined,
          pending: false,
        });
      });
    }

    return originalSend.call(this, body);
  };
};

export const patchNetwork = () => {
  if (patched || typeof window === "undefined") return;
  patched = true;

  patchFetch();
  patchXhr();
};
