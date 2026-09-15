import type {
  HttpMethod,
  Region,
  RequestEvent,
} from "@shared/monitoring";

export type RequestStatusFilter =
  | "all"
  | "2xx"
  | "3xx"
  | "4xx"
  | "5xx";

export interface RequestFilters {
  search: string;
  method: HttpMethod | "all";
  status: RequestStatusFilter;
  region: Region | "all";
  service: string | "all";
}

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const satisfies readonly HttpMethod[];

export const REGIONS = [
  "EU",
  "US",
  "APAC",
  "SA",
] as const satisfies readonly Region[];

export const STATUS_FILTERS = [
  "2xx",
  "3xx",
  "4xx",
  "5xx",
] as const satisfies readonly RequestStatusFilter[];

export function isHttpMethod(
  value: string | null,
): value is HttpMethod {
  return HTTP_METHODS.some(
    (method) => method === value,
  );
}

export function isRegion(
  value: string | null,
): value is Region {
  return REGIONS.some(
    (region) => region === value,
  );
}

export function isStatusFilter(
  value: string | null,
): value is RequestStatusFilter {
  return STATUS_FILTERS.some(
    (status) => status === value,
  );
}

export function filterRequests(
  requests: RequestEvent[],
  filters: RequestFilters,
) {
  const search =
    filters.search
      .trim()
      .toLowerCase();

  return requests.filter(
    (request) => {
      if (
        filters.method !== "all" &&
        request.method !==
        filters.method
      ) {
        return false;
      }

      if (
        filters.region !== "all" &&
        request.region !==
        filters.region
      ) {
        return false;
      }

      if (
        filters.service !== "all" &&
        request.service !==
        filters.service
      ) {
        return false;
      }

      if (
        filters.status !== "all"
      ) {
        const statusGroup =
          `${Math.floor(
            request.status / 100,
          )}xx`;

        if (
          statusGroup !==
          filters.status
        ) {
          return false;
        }
      }

      if (!search) {
        return true;
      }

      return [
        request.id,
        request.endpoint,
        request.service,
        request.method,
        request.region,
        String(request.status),
      ].some((value) =>
        value
          .toLowerCase()
          .includes(search),
      );
    },
  );
}

export function getRequestServices(
  requests: RequestEvent[],
) {
  return Array.from(
    new Set(
      requests.map(
        (request) =>
          request.service,
      ),
    ),
  ).sort((a, b) =>
    a.localeCompare(b),
  );
}