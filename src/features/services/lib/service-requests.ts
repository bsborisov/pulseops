import type { RequestEvent } from "@shared/monitoring";

export function getServiceRequests(
  requests: RequestEvent[],
  serviceNames: string[],
  limit = 12,
) {
  const allowed =
    new Set(
      serviceNames,
    );

  return requests
    .filter(
      (request) =>
        allowed.has(
          request.service,
        ),
    )
    .slice(
      0,
      limit,
    );
}