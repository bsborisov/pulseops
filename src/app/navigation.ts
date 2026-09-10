import {
  Activity,
  BarChart3,
  Gauge,
  Server,
  Siren,
  Waypoints,
} from "lucide-react";

export const navigation = [
  {
    label: "Overview",
    path: "/",
    icon: Gauge,
  },
  {
    label: "Live Traffic",
    path: "/live-traffic",
    icon: Activity,
  },
  {
    label: "Services",
    path: "/services",
    icon: Server,
  },
  {
    label: "Requests",
    path: "/requests",
    icon: Waypoints,
  },
  {
    label: "Incidents",
    path: "/incidents",
    icon: Siren,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
] as const;