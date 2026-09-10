import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router";

import {
  mainNavigation,
  secondaryNavigation,
  type NavigationItem,
} from "@/app/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange?: (
    collapsed: boolean,
  ) => void;
  showCollapseButton?: boolean;
  className?: string;
}

interface SidebarNavigationItemProps {
  item: NavigationItem;
  collapsed: boolean;
}

function SidebarNavigationItem({
  item,
  collapsed,
}: SidebarNavigationItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-md border px-3 py-2",
          "text-[13px] font-medium transition-colors",
          isActive
            ? "border-white/[0.07] bg-white/[0.06] text-hi"
            : "border-transparent text-lo hover:bg-white/[0.03] hover:text-mid",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={16}
            strokeWidth={1.75}
            className={cn(
              "shrink-0 transition-colors",
              isActive
                ? "text-accent"
                : "text-lo group-hover:text-mid",
            )}
          />

          {!collapsed && (
            <>
              <span className="truncate">
                {item.label}
              </span>

              {isActive && (
                <span className="ml-auto size-1 rounded-full bg-accent" />
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
  showCollapseButton = true,
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative shrink-0 flex-col border-r border-edge bg-surface",
        "transition-[width] duration-200",
        collapsed ? "w-14" : "w-56",
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-edge px-3">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/20">
          <span className="text-[11px] font-bold text-accent">
            P
          </span>
        </div>

        {!collapsed && (
          <span className="text-[14px] font-semibold tracking-tight text-hi">
            PulseOps
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {mainNavigation.map((item) => (
          <SidebarNavigationItem
            key={item.path}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-edge p-2">
        {secondaryNavigation.map((item) => (
          <SidebarNavigationItem
            key={item.path}
            item={item}
            collapsed={collapsed}
          />
        ))}

        <button
          type="button"
          className={cn(
            "mt-1 flex items-center gap-2.5 rounded-md px-3 py-2",
            "text-left transition-colors hover:bg-white/[0.03]",
            collapsed ? "justify-center" : "",
          )}
        >
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600">
            <span className="text-[10px] font-bold text-white">
              JD
            </span>
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-hi">
                Jamie D.
              </div>

              <div className="truncate text-[10px] text-lo">
                Admin
              </div>
            </div>
          )}
        </button>
      </div>

      {showCollapseButton &&
        onCollapsedChange && (
          <button
            type="button"
            onClick={() =>
              onCollapsedChange(!collapsed)
            }
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={cn(
              "absolute -right-3 top-14 z-20",
              "flex size-6 items-center justify-center",
              "rounded-full border border-edge bg-surface",
              "text-lo transition-colors",
              "hover:bg-panel hover:text-mid",
            )}
          >
            {collapsed ? (
              <ChevronRight
                size={11}
                strokeWidth={2.5}
              />
            ) : (
              <ChevronLeft
                size={11}
                strokeWidth={2.5}
              />
            )}
          </button>
        )}
    </aside>
  );
}