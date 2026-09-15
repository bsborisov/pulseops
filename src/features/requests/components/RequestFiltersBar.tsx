import {
  Search,
  X,
} from "lucide-react";

import {
  HTTP_METHODS,
  REGIONS,
  STATUS_FILTERS,
  type RequestFilters,
} from "@/features/requests/lib/request-filters";

interface RequestFiltersBarProps {
  filters: RequestFilters;

  services: string[];

  onSearchChange:
  (value: string) => void;

  onMethodChange:
  (value: string) => void;

  onStatusChange:
  (value: string) => void;

  onRegionChange:
  (value: string) => void;

  onServiceChange:
  (value: string) => void;

  onClear: () => void;
}

const selectClassName = [
  "rounded-md border border-edge bg-surface",
  "px-2.5 py-2 text-[11px] text-mid",
  "outline-none transition-colors",
  "hover:border-slate-400",
  "focus:border-accent/50",
].join(" ");

export function RequestFiltersBar({
  filters,
  services,
  onSearchChange,
  onMethodChange,
  onStatusChange,
  onRegionChange,
  onServiceChange,
  onClear,
}: RequestFiltersBarProps) {
  const hasFilters =
    filters.search !== "" ||
    filters.method !== "all" ||
    filters.status !== "all" ||
    filters.region !== "all" ||
    filters.service !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-edge bg-surface p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative min-w-55 flex-1 lg:max-w-sm">
        <Search
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lo"
        />

        <input
          value={
            filters.search
          }
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Search endpoint, service, ID..."
          aria-label="Search requests"
          className={[
            "w-full rounded-md border border-edge bg-panel",
            "py-2 pl-8 pr-3",
            "text-[11px] text-hi",
            "outline-none transition-colors",
            "placeholder:text-lo",
            "focus:border-accent/50 focus:bg-surface",
          ].join(" ")}
        />
      </div>

      <select
        aria-label="Method"
        value={filters.method}
        onChange={(event) =>
          onMethodChange(
            event.target.value,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="all">
          All methods
        </option>

        {HTTP_METHODS.map(
          (method) => (
            <option
              key={method}
              value={method}
            >
              {method}
            </option>
          ),
        )}
      </select>

      <select
        aria-label="Status"
        value={filters.status}
        onChange={(event) =>
          onStatusChange(
            event.target.value,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="all">
          All statuses
        </option>

        {STATUS_FILTERS.map(
          (status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ),
        )}
      </select>

      <select
        aria-label="Region"
        value={filters.region}
        onChange={(event) =>
          onRegionChange(
            event.target.value,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="all">
          All regions
        </option>

        {REGIONS.map(
          (region) => (
            <option
              key={region}
              value={region}
            >
              {region}
            </option>
          ),
        )}
      </select>

      <select
        aria-label="Service"
        value={filters.service}
        onChange={(event) =>
          onServiceChange(
            event.target.value,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="all">
          All services
        </option>

        {services.map(
          (service) => (
            <option
              key={service}
              value={service}
            >
              {service}
            </option>
          ),
        )}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className={[
            "flex items-center gap-1.5 rounded-md",
            "border border-edge px-2.5 py-2",
            "text-[11px] font-medium text-lo",
            "transition-colors",
            "hover:bg-panel hover:text-hi",
          ].join(" ")}
        >
          <X size={12} />

          Clear
        </button>
      )}
    </div>
  );
}