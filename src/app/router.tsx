import { createBrowserRouter } from "react-router";

import { AppShell } from "@/app/layouts/AppShell";
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";
import { IncidentsPage } from "@/features/incidents/components/IncidentsPage";
import { LiveTrafficPage } from "@/features/live-traffic/components/LiveTrafficPage";
import { OverviewPage } from "@/features/overview/components/OverviewPage";
import { RequestsPage } from "@/features/requests/components/RequestsPage";
import { ServicesPage } from "@/features/services/components/ServicesPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "live-traffic",
        element: <LiveTrafficPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "requests",
        element: <RequestsPage />,
      },
      {
        path: "incidents",
        element: <IncidentsPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
]);