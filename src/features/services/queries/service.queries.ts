import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { getServiceDetail } from "@/features/services/api/services.api";

export const serviceKeys = {
  all: ["services"] as const,

  details: () =>
    [
      ...serviceKeys.all,
      "detail",
    ] as const,

  detail: (
    serviceId: string,
  ) =>
    [
      ...serviceKeys.details(),
      serviceId,
    ] as const,
};

export function serviceDetailQueryOptions(
  serviceId: string,
) {
  return queryOptions({
    queryKey:
      serviceKeys.detail(
        serviceId,
      ),

    queryFn: ({ signal }) =>
      getServiceDetail(
        serviceId,
        {
          signal,
        },
      ),

    staleTime: 30_000,
  });
}

export function useServiceDetailQuery(
  serviceId: string,
) {
  return useQuery(
    serviceDetailQueryOptions(
      serviceId,
    ),
  );
}