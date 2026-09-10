import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  getOverview,
} from "@/features/overview/api/overview.api";

export const overviewKeys = {
  all: ["overview"] as const,

  snapshot: () =>
    [
      ...overviewKeys.all,
      "snapshot",
    ] as const,
};

export function overviewQueryOptions() {
  return queryOptions({
    queryKey:
      overviewKeys.snapshot(),

    queryFn: ({ signal }) =>
      getOverview({
        signal,
      }),

    staleTime: 10_000,
  });
}

export function useOverviewQuery() {
  return useQuery(
    overviewQueryOptions(),
  );
}