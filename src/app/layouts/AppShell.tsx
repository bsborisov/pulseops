import { Outlet } from "react-router";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}