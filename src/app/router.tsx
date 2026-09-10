import { createBrowserRouter } from "react-router";

import { AppShell } from "@/app/layouts/AppShell";

export const router = createBrowserRouter([
  {
    element: <AppShell />,

    children: [
      {
        index: true,
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/overview/components/OverviewPage"
              )
            ).OverviewPage,
        },
      },

      {
        path: "traffic",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/live-traffic/components/LiveTrafficPage"
              )
            ).LiveTrafficPage,
        },
      },

      {
        path: "services",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/services/components/ServicesPage"
              )
            ).ServicesPage,
        },
      },

      {
        path: "services/:id",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/services/components/ServiceDetailPage"
              )
            ).ServiceDetailPage,
        },
      },

      {
        path: "requests",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/requests/components/RequestsPage"
              )
            ).RequestsPage,
        },
      },

      {
        path: "incidents",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/incidents/components/IncidentsPage"
              )
            ).IncidentsPage,
        },
      },

      {
        path: "analytics",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/analytics/components/AnalyticsPage"
              )
            ).AnalyticsPage,
        },
      },

      {
        path: "docs",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/documentation/components/DocumentationPage"
              )
            ).DocumentationPage,
        },
      },

      {
        path: "settings",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/features/settings/components/SettingsPage"
              )
            ).SettingsPage,
        },
      },

      {
        path: "*",
        lazy: {
          Component: async () =>
            (
              await import(
                "@/app/components/NotFoundPage"
              )
            ).NotFoundPage,
        },
      },
    ],
  },
]);