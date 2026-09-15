import { useMemo } from "react";
import { useOverviewRequestsQuery } from "@/features/overview/queries/overview.queries";
import { RequestDetailPanel } from "./RequestDetailPanel";
import { RequestFiltersBar } from "./RequestFiltersBar";
import { RequestTable } from "./RequestTable";
import { useRequestSearchParams } from "@/features/requests/hooks/useRequestSearchParams";
import {
  filterRequests,
  getRequestServices,
} from "@/features/requests/lib/request-filters";

export function RequestExplorer() {
  const {
    data: requests,
  } = useOverviewRequestsQuery();

  const {
    filters,
    selectedRequestId,

    setSearch,
    setMethod,
    setStatus,
    setRegion,
    setService,

    setSelectedRequestId,

    clearFilters,
  } = useRequestSearchParams();

  const sourceRequests = requests ?? [];

  const services =
    useMemo(
      () =>
        getRequestServices(
          sourceRequests,
        ),
      [
        sourceRequests,
      ],
    );

  const filteredRequests =
    useMemo(
      () =>
        filterRequests(
          sourceRequests,
          filters,
        ),
      [
        sourceRequests,
        filters,
      ],
    );

  const selectedRequest =
    useMemo(
      () =>
        selectedRequestId
          ? sourceRequests.find(
            (request) =>
              request.id ===
              selectedRequestId,
          )
          : undefined,
      [
        sourceRequests,
        selectedRequestId,
      ],
    );

  const statistics =
    useMemo(() => {
      if (
        filteredRequests.length ===
        0
      ) {
        return {
          avgLatency: 0,
          errorRate: 0,
        };
      }

      const totalLatency =
        filteredRequests.reduce(
          (
            total,
            request,
          ) =>
            total +
            request.latency,
          0,
        );

      const errors =
        filteredRequests.filter(
          (request) =>
            request.status >=
            400,
        ).length;

      return {
        avgLatency:
          Math.round(
            totalLatency /
            filteredRequests.length,
          ),

        errorRate:
          (errors /
            filteredRequests.length) *
          100,
      };
    }, [
      filteredRequests,
    ]);

  return (
    <>
      <RequestFiltersBar
        filters={filters}
        services={services}
        onSearchChange={
          setSearch
        }
        onMethodChange={
          setMethod
        }
        onStatusChange={
          setStatus
        }
        onRegionChange={
          setRegion
        }
        onServiceChange={
          setService
        }
        onClear={
          clearFilters
        }
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] text-lo">
        <span>
          Showing{" "}
          <strong className="font-mono font-medium text-hi tabular-nums">
            {
              filteredRequests.length
            }
          </strong>{" "}
          of{" "}
          <strong className="font-mono font-medium text-hi tabular-nums">
            {
              sourceRequests.length
            }
          </strong>{" "}
          buffered requests
        </span>

        <span>
          Avg latency{" "}
          <strong className="font-mono font-medium text-hi tabular-nums">
            {
              statistics.avgLatency
            }
            ms
          </strong>
        </span>

        <span>
          Errors{" "}
          <strong
            className={[
              "font-mono font-medium tabular-nums",

              statistics.errorRate >
                1
                ? "text-err"
                : "text-hi",
            ].join(" ")}
          >
            {statistics.errorRate.toFixed(
              2,
            )}
            %
          </strong>
        </span>

        <span className="ml-auto flex items-center gap-1.5 text-ok">
          <span className="size-1.5 rounded-full bg-ok animate-pulse-dot" />

          Live
        </span>
      </div>

      <RequestTable
        requests={
          filteredRequests
        }
        selectedRequestId={
          selectedRequestId
        }
        onSelect={
          setSelectedRequestId
        }
      />

      <RequestDetailPanel
        request={
          selectedRequest
        }
        onClose={() =>
          setSelectedRequestId(
            null,
          )
        }
      />
    </>
  );
}