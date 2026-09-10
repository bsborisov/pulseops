import { getJson } from "@/lib/http";
import type { OverviewSnapshot } from "@shared/monitoring";

interface GetOverviewOptions {
  signal?: AbortSignal;
}

export function getOverview(
  options: GetOverviewOptions = {},
) {
  return getJson<OverviewSnapshot>(
    "/api/overview",
    {
      signal: options.signal,
    },
  );
}