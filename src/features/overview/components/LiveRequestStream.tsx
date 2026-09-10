import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import {
  MethodBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import type { RequestEvent } from "@shared/monitoring";

interface LiveRequestStreamProps {
  requests: RequestEvent[];
  eventsPerSecond: number;
}

const REQUEST_ROW_HEIGHT = 28;
const REQUEST_HEADER_HEIGHT = 28;

export function LiveRequestStream({
  requests,
  eventsPerSecond,
}: LiveRequestStreamProps) {
  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

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

  const getItemKey =
    useCallback(
      (index: number) =>
        filteredRequests[index]?.id ??
        index,
      [filteredRequests],
    );

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count:
      filteredRequests.length,

    getScrollElement: () =>
      scrollContainerRef.current,

    estimateSize: () =>
      REQUEST_ROW_HEIGHT,

    getItemKey,

    overscan: 8,

    scrollMargin:
      REQUEST_HEADER_HEIGHT,

    useFlushSync: false,

    initialRect: {
      width: 650,
      height: 300,
    },
  });

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
            className={[
              "size-1.5 rounded-full",

              paused
                ? "bg-warn"
                : "bg-ok animate-pulse",
            ].join(" ")}
          />

          {paused
            ? "Paused"
            : `${eventsPerSecond} events/sec`}
        </div>

        <input
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value,
            )
          }
          placeholder="Filter..."
          aria-label="Filter requests"
          className={[
            "w-24 rounded border border-edge bg-bg px-2 py-1",
            "font-mono text-[11px] text-hi outline-none",
            "placeholder:text-lo focus:border-accent/50",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={togglePause}
          className={[
            "rounded border px-2 py-1 text-[11px] font-medium transition-colors",

            paused
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400",
          ].join(" ")}
        >
          {paused
            ? "Resume"
            : "Pause"}
        </button>

        <button
          type="button"
          onClick={clearRequests}
          className="rounded border border-edge px-2 py-1 text-[11px] font-medium text-lo transition-colors hover:text-mid"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto"
      >
        <div className="min-w-[650px]">
          <div
            className={[
              "sticky top-0 z-10 grid h-7 items-center gap-2",
              "border-b border-edge bg-surface px-4",
            ].join(" ")}
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

          {filteredRequests.length >
            0 ? (
            <div
              className="relative"
              style={{
                height:
                  rowVirtualizer.getTotalSize(),
              }}
            >
              {rowVirtualizer
                .getVirtualItems()
                .map(
                  (virtualRow) => {
                    const request =
                      filteredRequests[
                      virtualRow.index
                      ];

                    if (!request) {
                      return null;
                    }

                    return (
                      <div
                        key={
                          virtualRow.key
                        }
                        data-index={
                          virtualRow.index
                        }
                        data-testid="request-row"
                        className={[
                          "absolute left-0 top-0 grid w-full items-center gap-2",
                          "border-b border-edge/50 px-4",
                          "transition-colors hover:bg-white/[0.02]",
                        ].join(" ")}
                        style={{
                          height:
                            REQUEST_ROW_HEIGHT,

                          gridTemplateColumns:
                            "70px 55px minmax(160px,1fr) 55px 65px 45px",

                          transform:
                            `translateY(${virtualRow.start -
                            REQUEST_HEADER_HEIGHT
                            }px)`,
                        }}
                      >
                        <span className="font-mono text-[11px] text-lo tabular-nums">
                          {
                            request.time
                          }
                        </span>

                        <MethodBadge
                          method={
                            request.method
                          }
                        />

                        <span
                          title={
                            request.endpoint
                          }
                          className="truncate font-mono text-[11px] text-mid"
                        >
                          {
                            request.endpoint
                          }
                        </span>

                        <StatusBadge
                          status={
                            request.status
                          }
                        />

                        <span
                          className={[
                            "font-mono text-[11px] tabular-nums",

                            request.latency >
                              300
                              ? "text-err"
                              : request.latency >
                                150
                                ? "text-warn"
                                : "text-mid",
                          ].join(
                            " ",
                          )}
                        >
                          {
                            request.latency
                          }
                          ms
                        </span>

                        <span className="text-[10px] font-medium text-lo">
                          {
                            request.region
                          }
                        </span>
                      </div>
                    );
                  },
                )}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-[13px] text-lo">
              No requests match filter
            </div>
          )}
        </div>
      </div>
    </section>
  );
}