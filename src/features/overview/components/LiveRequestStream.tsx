import {
  useMemo,
  useState,
} from "react";

import {
  MethodBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import type { RequestEvent } from "@shared/monitoring";

import { cn } from "@/lib/utils";

interface LiveRequestStreamProps {
  requests: RequestEvent[];
  eventsPerSecond: number;
}

export function LiveRequestStream({
  requests,
  eventsPerSecond,
}: LiveRequestStreamProps) {
  const [
    pausedRequests,
    setPausedRequests,
  ] = useState<RequestEvent[] | null>(
    null,
  );

  const [
    clearedThroughId,
    setClearedThroughId,
  ] = useState<string | null>(
    null,
  );

  const [filter, setFilter] =
    useState("");

  const paused =
    pausedRequests !== null;

  const liveRequests =
    useMemo(() => {
      if (!clearedThroughId) {
        return requests;
      }

      const boundaryIndex =
        requests.findIndex(
          (request) =>
            request.id ===
            clearedThroughId,
        );

      if (boundaryIndex === -1) {
        return requests;
      }

      return requests.slice(
        0,
        boundaryIndex,
      );
    }, [
      requests,
      clearedThroughId,
    ]);

  const displayRequests =
    pausedRequests ??
    liveRequests;

  const filteredRequests =
    useMemo(() => {
      const value =
        filter
          .trim()
          .toLowerCase();

      if (!value) {
        return displayRequests;
      }

      return displayRequests.filter(
        (request) =>
          request.endpoint
            .toLowerCase()
            .includes(value) ||
          request.service
            .toLowerCase()
            .includes(value),
      );
    }, [
      filter,
      displayRequests,
    ]);

  function togglePause() {
    if (paused) {
      setPausedRequests(null);

      return;
    }

    setPausedRequests(
      liveRequests,
    );
  }

  function clearRequests() {
    const newestRequest =
      requests[0];

    setClearedThroughId(
      newestRequest?.id ?? null,
    );

    if (paused) {
      setPausedRequests([]);
    }
  }

  return (
    <section className="flex h-[360px] min-w-0 flex-col overflow-hidden rounded-lg border border-edge bg-surface">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-edge px-4 py-3">
        <h2 className="mr-auto text-[13px] font-semibold text-hi">
          Live Request Stream
        </h2>

        <div className="flex items-center gap-1 text-[11px] text-lo">
          <span
            className={cn(
              "size-1.5 rounded-full",
              paused
                ? "bg-warn"
                : "bg-ok animate-pulse",
            )}
          />

          {paused
            ? "Paused"
            : `${eventsPerSecond} events/sec`}
        </div>

        <input
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          placeholder="Filter..."
          aria-label="Filter requests"
          className={cn(
            "w-24 rounded border border-edge bg-bg px-2 py-1",
            "font-mono text-[11px] text-hi outline-none",
            "placeholder:text-lo focus:border-accent/50",
          )}
        />

        <button
          type="button"
          onClick={togglePause}
          className={cn(
            "rounded border px-2 py-1 text-[11px] font-medium transition-colors",
            paused
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400",
          )}
        >
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          type="button"
          onClick={clearRequests}
          className="rounded border border-edge px-2 py-1 text-[11px] font-medium text-lo transition-colors hover:text-mid"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[650px]">
          <div
            className="grid gap-2 border-b border-edge px-4 py-1.5"
            style={{
              gridTemplateColumns:
                "70px 55px minmax(160px,1fr) 55px 65px 45px",
            }}
          >
            {[
              "Time",
              "Method",
              "Endpoint",
              "Status",
              "Latency",
              "Region",
            ].map((heading) => (
              <span
                key={heading}
                className="text-[10px] font-medium uppercase tracking-wider text-lo"
              >
                {heading}
              </span>
            ))}
          </div>

          {filteredRequests.map(
            (request) => (
              <div
                key={request.id}
                className="grid gap-2 border-b border-edge/50 px-4 py-1.5 transition-colors hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns:
                    "70px 55px minmax(160px,1fr) 55px 65px 45px",
                }}
              >
                <span className="font-mono text-[11px] text-lo tabular-nums">
                  {request.time}
                </span>

                <MethodBadge
                  method={request.method}
                />

                <span className="truncate font-mono text-[11px] text-mid">
                  {request.endpoint}
                </span>

                <StatusBadge
                  status={request.status}
                />

                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    request.latency > 300
                      ? "text-err"
                      : request.latency > 150
                        ? "text-warn"
                        : "text-mid",
                  )}
                >
                  {request.latency}ms
                </span>

                <span className="text-[10px] font-medium text-lo">
                  {request.region}
                </span>
              </div>
            ),
          )}

          {filteredRequests.length === 0 && (
            <div className="flex h-40 items-center justify-center text-[13px] text-lo">
              No requests match filter
            </div>
          )}
        </div>
      </div>
    </section>
  );
}