import {
  Activity,
  BarChart3,
  BookOpen,
  Gauge,
  Network,
  Server,
  Settings,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const mainNavigation: NavigationItem[] = [
  {
    label: "Overview",
    path: "/",
    icon: Gauge,
  },
  {
    label: "Live Traffic",
    path: "/traffic",
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
    icon: Network,
  },
  {
    label: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    label: "Documentation",
    path: "/docs",
    icon: BookOpen,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const navigation = [
  ...mainNavigation,
  ...secondaryNavigation,
];

export function getPageTitle(
  pathname: string,
): string {
  if (pathname.startsWith("/services/")) {
    return "Service";
  }

  const item = navigation.find(
    ({ path }) => path === pathname,
  );

  return item?.label ?? "PulseOps";
}