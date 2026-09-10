import { useState } from "react";
import {
  Outlet,
  useLocation,
} from "react-router";

import { useRealtimeMonitoring } from "@/hooks/useRealtimeMonitoring";

import { getPageTitle } from "@/app/navigation";

import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const { pathname } = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const connectionState = useRealtimeMonitoring();

  const title = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-hi">
      {/* Desktop */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={
          setSidebarCollapsed
        }
        className="hidden lg:flex"
      />

      {/* Tablet */}
      <Sidebar
        collapsed
        showCollapseButton={false}
        className="hidden md:flex lg:hidden"
      />

      <MobileNavigation
        open={mobileNavigationOpen}
        onClose={() =>
          setMobileNavigationOpen(false)
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          connectionState={
            connectionState
          }
          onOpenMobileNavigation={() =>
            setMobileNavigationOpen(
              true,
            )
          }
        />

        <main
          id="main-content"
          className="min-w-0 flex-1 overflow-y-auto"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}