import {
  useOverviewKpiQuery,
  useOverviewRequestsQuery,
} from "@/features/overview/queries/overview.queries";

import { LiveRequestStream } from "@/features/requests/components/LiveRequestStream";

export function TrafficEvents() {
  const {
    data: requests,
  } = useOverviewRequestsQuery();

  const {
    data: kpi,
  } = useOverviewKpiQuery();

  if (!requests || !kpi) {
    return null;
  }

  return (
    <LiveRequestStream
      requests={requests}
      eventsPerSecond={
        kpi.eventsPerSecond
      }
    />
  );
}