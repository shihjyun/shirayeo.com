import { error } from "@sveltejs/kit";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function assertLocalRequest(url: URL): void {
  if (!LOCAL_HOSTS.has(url.hostname)) {
    throw error(403, "Admin is available only on localhost.");
  }
}
