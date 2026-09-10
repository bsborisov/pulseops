import { NavLink } from "react-router";

import { navigation } from "@/app/navigation";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <span className="text-lg font-semibold">
          PulseOps
        </span>
      </div>

      <nav className="space-y-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={18} />

              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}