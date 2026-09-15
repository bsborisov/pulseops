import {
  //Bell,
  Menu,
  //Search,
} from "lucide-react";

import { ConnectionIndicator } from "@/components/ui/ConnectionIndicator";
import { cn } from "@/lib/utils";
import type { ConnectionState } from "@/types/realtime";
import {
  ENVIRONMENTS,
  isEnvironment,
  TIME_RANGES,
} from "@/app/dashboard-filters";

import { useDashboardSearchParams } from "@/hooks/useDashboardSearchParams";

interface TopbarProps {
  title: string;
  connectionState: ConnectionState;
  onOpenMobileNavigation:
  () => void;
}

export function Topbar({
  title,
  connectionState,
  onOpenMobileNavigation,
}: TopbarProps) {
  const {
    timeRange,
    setTimeRange,
    environment,
    setEnvironment,
  } = useDashboardSearchParams();

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-edge bg-surface/90 px-3 backdrop-blur-sm sm:px-4">
      <button
        type="button"
        onClick={onOpenMobileNavigation}
        aria-label="Open navigation"
        className="flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-slate-900/4 hover:text-mid md:hidden"
      >
        <Menu size={17} />
      </button>

      <h1 className="mr-auto truncate text-[14px] font-semibold text-hi">
        {title}
      </h1>

      <div className="hidden items-center gap-0.5 rounded-md border border-edge bg-bg p-0.5 lg:flex">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() =>
              setTimeRange(range)
            }
            className={cn(
              "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
              timeRange === range
                ? "bg-accent/15 text-accent"
                : "text-lo hover:text-mid",
            )}
          >
            {range}
          </button>
        ))}
      </div>

      <select
        value={environment}
        onChange={(event) => {
          const value = event.target.value;

          if (
            isEnvironment(value)
          ) {
            setEnvironment(value);
          }
        }}
        aria-label="Environment"
        className={cn(
          "hidden rounded-md border border-edge bg-bg px-3 py-1.5",
          "text-xs font-medium text-hi outline-none transition-colors",
          "hover:border-mid/40 md:block",
        )}
      >
        {ENVIRONMENTS.map(
          (value) => (
            <option
              key={value}
              value={value}
            >
              {value
                .charAt(0)
                .toUpperCase() +
                value.slice(1)}
            </option>
          ),
        )}
      </select>

      {/* <button
        type="button"
        aria-label="Search"
        className={cn(
          "hidden items-center gap-2 rounded-md border border-edge bg-bg",
          "px-3 py-1.5 text-xs text-lo transition-colors",
          "hover:border-mid/40 hover:text-mid xl:flex",
        )}
      >
        <Search size={12} />

        <span>Search</span>

        <kbd className="ml-1 font-mono text-[10px] text-lo/60">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-slate-900/4 hover:text-mid"
      >
        <Bell
          size={15}
          strokeWidth={1.75}
        />

        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-err" />
      </button> */}

      <div className="border-l border-edge pl-3">
        <ConnectionIndicator
          state={connectionState}
        />
      </div>
    </header>
  );
}