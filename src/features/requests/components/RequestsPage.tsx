import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import { useOverviewQuery } from "@/features/overview/queries/overview.queries";
import { RequestExplorer } from "./RequestExplorer";

export function RequestsPage() {
  const {
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } =
    useOverviewQuery();

  if (isPending) {
    return (
      <MonitoringPageSkeleton />
    );
  }

  if (isError) {
    return (
      <MonitoringPageError
        error={error}
        retrying={
          isFetching
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-3 p-4 sm:p-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-hi">
          Requests
        </h2>

        <p className="mt-1 text-[11px] text-lo">
          Inspect and filter realtime request traffic.
        </p>
      </div>

      <RequestExplorer />
    </div>
  );
}