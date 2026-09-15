import {
  useOverviewKpiQuery,
  useOverviewRequestsQuery,
} from "@/features/overview/queries/overview.queries";

import { LiveRequestStream } from "./LiveRequestStream";

export function OverviewRequestStream() {
  const {
    data: requests,
  } =
    useOverviewRequestsQuery();

  const {
    data: kpi,
  } =
    useOverviewKpiQuery();

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