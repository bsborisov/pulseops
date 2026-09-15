import {
  useOverviewEndpointsQuery,
} from "@/features/overview/queries/overview.queries";

import { EndpointPerformance } from "./EndpointPerformance";

export function OverviewEndpointPerformance() {
  const {
    data: endpoints,
  } =
    useOverviewEndpointsQuery();

  if (!endpoints) {
    return null;
  }

  return (
    <EndpointPerformance
      endpoints={endpoints}
    />
  );
}