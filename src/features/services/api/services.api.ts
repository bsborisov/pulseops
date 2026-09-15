import { getJson } from "@/lib/http";
import type { ServiceDetail } from "@shared/monitoring";

interface GetServiceDetailOptions {
  signal?: AbortSignal;
}

export function getServiceDetail(
  serviceId: string,
  options:
    GetServiceDetailOptions = {},
) {
  return getJson<ServiceDetail>(
    `/api/services/${encodeURIComponent(
      serviceId,
    )}`,
    {
      signal:
        options.signal,
    },
  );
}