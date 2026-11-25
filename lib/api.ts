// Browser API client. Requests go to /api on this site and Next.js forwards them
// to the backend (see next.config.mjs), so the session cookie is first-party.
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

let csrfToken: string | null = null;
export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
};

// Fired when the server says our access changed, so the UI can reload it.
export const ACCESS_CHANGED = "mh:access-changed";

export async function api<T = any>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(csrfToken && method !== "GET" && { "X-CSRF-Token": csrfToken }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && !path.startsWith("/auth/")) {
      window.dispatchEvent(new Event(ACCESS_CHANGED));
    }
    const details = Array.isArray(data?.details)
      ? data.details.map((d: any) => d.message ?? d.name).filter(Boolean)
      : data?.details?.missing;
    const message = data?.error ?? "Cannot reach the server";
    throw new ApiError(res.status, details?.length ? `${message}: ${details.join(", ")}` : message);
  }
  return data;
}