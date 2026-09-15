import {
  useOverviewIncidentsQuery,
} from "@/features/overview/queries/overview.queries";

import { RecentIncidents } from "./RecentIncidents";

export function OverviewRecentIncidents() {
  const {
    data: incidents,
  } =
    useOverviewIncidentsQuery();

  if (!incidents) {
    return null;
  }

  return (
    <RecentIncidents
      incidents={incidents}
    />
  );
}