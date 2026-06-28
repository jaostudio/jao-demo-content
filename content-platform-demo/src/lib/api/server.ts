import "server-only";
import app from "@content-platform/backend/app";

type FetchAPIOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: FetchAPIOptions["query"]) {
  const url = new URL(path, "http://likha.internal");

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

export async function fetchAPI<T>(
  path: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const { query, headers, ...init } = options;

  const req = new Request(buildUrl(path, query), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(headers ?? {}),
    },
  });

  const res = await app.request(req);

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : null;

    const message =
      body?.error?.message ??
      body?.message ??
      `API error: ${res.status}`;

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return isJson ? ((await res.json()) as T) : ((await res.text()) as T);
}
