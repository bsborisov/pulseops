import {
  useCallback,
  useRef,
} from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import {
  MethodBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import type { RequestEvent } from "@shared/monitoring";
import { cn } from "@/lib/utils";

interface RequestTableProps {
  requests: RequestEvent[];

  selectedRequestId:
  string | null;

  onSelect:
  (requestId: string) => void;
}

const ROW_HEIGHT = 38;

export function RequestTable({
  requests,
  selectedRequestId,
  onSelect,
}: RequestTableProps) {
  const scrollRef =
    useRef<HTMLDivElement>(
      null,
    );

  const getItemKey =
    useCallback(
      (index: number) =>
        requests[index]?.id ??
        index,
      [
        requests,
      ],
    );

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count:
      requests.length,

    getScrollElement:
      () =>
        scrollRef.current,

    estimateSize:
      () => ROW_HEIGHT,

    getItemKey,

    overscan: 12,

    useFlushSync: false,

    initialRect: {
      width: 900,
      height: 600,
    },
  });

  return (
    <section className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid min-w-200 grid-cols-[75px_65px_minmax(220px,1fr)_110px_65px_75px_55px] gap-3 border-b border-edge bg-panel px-4 py-2">
        {[
          "Time",
          "Method",
          "Endpoint",
          "Service",
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

      <div
        ref={scrollRef}
        data-testid="request-scroll-container"
        className={cn(
          "h-[calc(100vh-285px)] min-h-105",
          "overflow-auto",
        )}
      >
        <div className="min-w-200">
          {requests.length >
            0 ? (
            <div
              className="relative"
              style={{
                height:
                  virtualizer.getTotalSize(),
              }}
            >
              {virtualizer
                .getVirtualItems()
                .map((virtualRow) => {
                  const request =
                    requests[
                    virtualRow.index
                    ];

                  if (!request) {
                    return null;
                  }

                  const selected =
                    selectedRequestId ===
                    request.id;

                  return (
                    <button
                      key={virtualRow.key}
                      type="button"
                      data-testid="request-row"
                      onClick={() =>
                        onSelect(
                          request.id,
                        )
                      }
                      className={cn(
                        "absolute left-0 top-0 grid w-full",
                        "grid-cols-[75px_65px_minmax(220px,1fr)_110px_65px_75px_55px]",
                        "items-center gap-3 border-b border-edge/60 px-4",
                        "text-left transition-colors",
                        selected
                          ? "bg-accent/6"
                          : "hover:bg-slate-900/2.5",
                      )}
                      style={{
                        height:
                          ROW_HEIGHT,

                        transform:
                          `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <span className="font-mono text-[10px] text-lo tabular-nums">
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
                        className="truncate font-mono text-[10px] text-mid"
                      >
                        {
                          request.endpoint
                        }
                      </span>

                      <span
                        title={
                          request.service
                        }
                        className="truncate text-[11px] text-mid"
                      >
                        {
                          request.service
                        }
                      </span>

                      <StatusBadge
                        status={
                          request.status
                        }
                      />

                      <span
                        className={cn(
                          "font-mono text-[10px] tabular-nums",

                          request.latency >
                            300
                            ? "text-err"
                            : request.latency >
                              150
                              ? "text-warn"
                              : "text-mid",
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
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center">
              <div className="text-center">
                <div className="text-[13px] font-medium text-mid">
                  No requests found
                </div>

                <div className="mt-1 text-[11px] text-lo">
                  Try changing the active filters.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}