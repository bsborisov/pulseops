import {
  useOverviewServicesQuery,
} from "@/features/overview/queries/overview.queries";

import { SystemHealth } from "./SystemHealth";

export function OverviewSystemHealth() {
  const {
    data: services,
  } = useOverviewServicesQuery();

  if (!services) {
    return null;
  }

  return (
    <SystemHealth
      services={services}
    />
  );
}