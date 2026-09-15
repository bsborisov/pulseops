import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  getOverview,
} from "@/features/overview/api/overview.api";

import type {
  OverviewSnapshot,
} from "@shared/monitoring";

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

function selectKpi(
  data: OverviewSnapshot,
) {
  return data.kpi;
}

function selectChart(
  data: OverviewSnapshot,
) {
  return data.chart;
}

function selectServices(
  data: OverviewSnapshot,
) {
  return data.services;
}

function selectRequests(
  data: OverviewSnapshot,
) {
  return data.requests;
}

function selectEndpoints(
  data: OverviewSnapshot,
) {
  return data.endpoints;
}

function selectIncidents(
  data: OverviewSnapshot,
) {
  return data.incidents;
}

export function useOverviewKpiQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectKpi,
  });
}

export function useOverviewChartQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectChart,
  });
}

export function useOverviewServicesQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectServices,
  });
}

export function useOverviewRequestsQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectRequests,
  });
}

export function useOverviewEndpointsQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectEndpoints,
  });
}

export function useOverviewIncidentsQuery() {
  return useQuery({
    ...overviewQueryOptions(),
    select: selectIncidents,
  });
}