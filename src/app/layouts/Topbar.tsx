import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import { useState } from "react";

import {
  ConnectionIndicator,
  type ConnectionState,
} from "@/components/ui/ConnectionIndicator";
import { cn } from "@/lib/utils";

export type Environment =
  | "production"
  | "staging"
  | "development";

export type TimeRange =
  | "1m"
  | "5m"
  | "15m"
  | "1h";

interface TopbarProps {
  title: string;
  onOpenMobileNavigation: () => void;
}

const timeRanges: TimeRange[] = [
  "1m",
  "5m",
  "15m",
  "1h",
];

export function Topbar({
  title,
  onOpenMobileNavigation,
}: TopbarProps) {
  const [timeRange, setTimeRange] =
    useState<TimeRange>("5m");

  const [environment, setEnvironment] =
    useState<Environment>("production");

  // Temporary until the WebSocket layer exists.
  const connectionState: ConnectionState =
    "live";

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-edge bg-surface/50 px-3 backdrop-blur-sm sm:px-4">
      <button
        type="button"
        onClick={onOpenMobileNavigation}
        aria-label="Open navigation"
        className="flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-white/[0.04] hover:text-mid md:hidden"
      >
        <Menu size={17} />
      </button>

      <h1 className="mr-auto truncate text-[14px] font-semibold text-hi">
        {title}
      </h1>

      <div className="hidden items-center gap-0.5 rounded-md border border-edge bg-bg p-0.5 lg:flex">
        {timeRanges.map((range) => (
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
        onChange={(event) =>
          setEnvironment(
            event.target
              .value as Environment,
          )
        }
        aria-label="Environment"
        className={cn(
          "hidden rounded-md border border-edge bg-bg px-3 py-1.5",
          "text-xs font-medium text-hi outline-none transition-colors",
          "hover:border-mid/40 md:block",
        )}
      >
        <option value="production">
          Production
        </option>

        <option value="staging">
          Staging
        </option>

        <option value="development">
          Development
        </option>
      </select>

      <button
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
        className="relative flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-white/[0.04] hover:text-mid"
      >
        <Bell
          size={15}
          strokeWidth={1.75}
        />

        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-err" />
      </button>

      <div className="border-l border-edge pl-3">
        <ConnectionIndicator
          state={connectionState}
        />
      </div>
    </header>
  );
}