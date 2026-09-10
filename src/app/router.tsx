import { createBrowserRouter } from "react-router";

import { AppShell } from "@/app/layouts/AppShell";
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";
import { IncidentsPage } from "@/features/incidents/components/IncidentsPage";
import { LiveTrafficPage } from "@/features/live-traffic/components/LiveTrafficPage";
import { OverviewPage } from "@/features/overview/components/OverviewPage";
import { RequestsPage } from "@/features/requests/components/RequestsPage";
import { ServiceDetailPage } from "@/features/services/components/ServiceDetailPage";
import { ServicesPage } from "@/features/services/components/ServicesPage";

function DocumentationPage() {
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-hi">
        Documentation
      </h2>

      <p className="mt-2 text-sm text-lo">
        Documentation will be added later.
      </p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-hi">
        Settings
      </h2>

      <p className="mt-2 text-sm text-lo">
        Settings will be added later.
      </p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
      <div className="font-mono text-3xl font-semibold text-lo">
        404
      </div>

      <p className="text-sm text-mid">
        Page not found.
      </p>
    </div>
  );
}

export const router =
  createBrowserRouter([
    {
      element: <AppShell />,

      children: [
        {
          index: true,
          element: <OverviewPage />,
        },

        {
          path: "traffic",
          element: <LiveTrafficPage />,
        },

        {
          path: "services",
          element: <ServicesPage />,
        },

        {
          path: "services/:id",
          element: <ServiceDetailPage />,
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

        {
          path: "docs",
          element: <DocumentationPage />,
        },

        {
          path: "settings",
          element: <SettingsPage />,
        },

        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);