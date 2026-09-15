import {
  Link,
  useLocation,
  useParams,
} from "react-router";

import { RealtimeChart } from "@/components/charts/RealtimeChart";
import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import { MethodBadge } from "@/components/ui/Badge";
import { useServiceDetailQuery } from "@/features/services/queries/service.queries";
import { ApiError } from "@/lib/http";
import type {
  ServiceDetail,
  ServiceStatus,
} from "@shared/monitoring";

import { ServiceLiveRequests } from "./ServiceLiveRequests";
import { cn } from "@/lib/utils";

const statusStyles:
  Record<
    ServiceStatus,
    {
      dot: string;
      text: string;
      background: string;
    }
  > = {
  healthy: {
    dot: "bg-ok",
    text: "text-ok",
    background:
      "border-ok/20 bg-ok/10",
  },

  degraded: {
    dot: "bg-warn",
    text: "text-warn",
    background:
      "border-warn/20 bg-warn/10",
  },

  offline: {
    dot: "bg-err",
    text: "text-err",
    background:
      "border-err/20 bg-err/10",
  },
};

interface MetricProps {
  label: string;
  value: string;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div className="mt-2 font-mono text-xl font-semibold text-hi tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ServiceNotFound() {
  const {
    search,
  } =
    useLocation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-5">
      <div className="font-mono text-3xl font-semibold text-lo">
        404
      </div>

      <h2 className="text-sm font-semibold text-hi">
        Service not found
      </h2>

      <Link
        to={{
          pathname:
            "/services",
          search,
        }}
        className="text-xs font-medium text-accent hover:underline"
      >
        Back to services
      </Link>
    </div>
  );
}

function ServiceDetailContent({
  serviceId,
}: {
  serviceId: string;
}) {
  const {
    data,
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } =
    useServiceDetailQuery(
      serviceId,
    );

  const {
    search,
  } =
    useLocation();

  if (isPending) {
    return (
      <MonitoringPageSkeleton />
    );
  }

  if (isError) {
    if (
      error instanceof
      ApiError &&
      error.status === 404
    ) {
      return (
        <ServiceNotFound />
      );
    }

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
    <div className="w-full space-y-5 p-4 sm:p-5">
      <div>
        <Link
          to={{
            pathname:
              "/services",
            search,
          }}
          className="text-[11px] font-medium text-lo transition-colors hover:text-accent"
        >
          ← Services
        </Link>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-hi">
                {data.name}
              </h2>

              <ServiceStatus
                service={
                  data
                }
              />
            </div>

            <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-lo">
              {
                data.description
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            <span className="text-lo">
              Version
            </span>

            <span className="font-mono text-mid">
              {
                data.version
              }
            </span>

            <span className="text-lo">
              Region
            </span>

            <span className="text-mid">
              {
                data.region
              }
            </span>

            <span className="text-lo">
              Instances
            </span>

            <span className="font-mono text-mid">
              {
                data.instances
              }
            </span>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric
          label="Throughput"
          value={`${data.rps.toLocaleString()} rps`}
        />

        <Metric
          label="P95 latency"
          value={`${data.p95}ms`}
        />

        <Metric
          label="Error rate"
          value={`${data.errorRate.toFixed(2)}%`}
        />

        <Metric
          label="Uptime"
          value={`${data.uptime.toFixed(2)}%`}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-3">
          <div className="mb-4">
            <h3 className="text-[13px] font-semibold text-hi">
              Throughput
            </h3>

            <p className="mt-0.5 text-[11px] text-lo">
              Recent service traffic
            </p>
          </div>

          <RealtimeChart
            data={
              data.chart
            }
            height={220}
          />
        </div>

        <ServiceMetadata
          service={data}
        />
      </section>

      <ServiceEndpoints
        service={data}
      />

      <ServiceLiveRequests
        serviceNames={
          data.requestServices
        }
      />
    </div>
  );
}

function ServiceStatus({
  service,
}: {
  service: ServiceDetail;
}) {
  const style =
    statusStyles[
    service.status
    ];

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2 py-1",
        "text-[10px] font-medium capitalize",
        style.background,
        style.text,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          style.dot,
        )}
      />

      {service.status}
    </span>
  );
}

function ServiceMetadata({
  service,
}: {
  service: ServiceDetail;
}) {
  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-2">
      <h3 className="text-[13px] font-semibold text-hi">
        Service Information
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
            Last deployed
          </div>

          <div className="mt-1 font-mono text-[11px] text-mid">
            {new Date(
              service.lastDeployedAt,
            ).toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
            Dependencies
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {service.dependencies
              .length > 0 ? (
              service.dependencies.map(
                (
                  dependency,
                ) => (
                  <span
                    key={
                      dependency
                    }
                    className="rounded border border-edge bg-panel px-2 py-1 text-[10px] font-medium text-mid"
                  >
                    {
                      dependency
                    }
                  </span>
                ),
              )
            ) : (
              <span className="text-[11px] text-lo">
                No service dependencies
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceEndpoints({
  service,
}: {
  service: ServiceDetail;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-edge px-4 py-3">
        <h3 className="text-[13px] font-semibold text-hi">
          Endpoint Performance
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-160">
          <div className="grid grid-cols-[65px_minmax(200px,1fr)_100px_100px_100px] gap-3 border-b border-edge bg-panel px-4 py-2">
            {[
              "Method",
              "Endpoint",
              "RPS",
              "P95",
              "Errors",
            ].map(
              (heading) => (
                <span
                  key={
                    heading
                  }
                  className="text-[10px] font-medium uppercase tracking-wider text-lo"
                >
                  {heading}
                </span>
              ),
            )}
          </div>

          {service.endpoints.map(
            (endpoint) => (
              <div
                key={`${endpoint.method}-${endpoint.endpoint}`}
                className="grid grid-cols-[65px_minmax(200px,1fr)_100px_100px_100px] items-center gap-3 border-b border-edge/60 px-4 py-2.5 last:border-0"
              >
                <MethodBadge
                  method={
                    endpoint.method
                  }
                />

                <span className="truncate font-mono text-[11px] text-mid">
                  {
                    endpoint.endpoint
                  }
                </span>

                <span className="font-mono text-[11px] text-mid tabular-nums">
                  {
                    endpoint.rps
                  }
                </span>

                <span className="font-mono text-[11px] text-mid tabular-nums">
                  {
                    endpoint.p95
                  }
                  ms
                </span>

                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",

                    endpoint.errorRate >
                      1
                      ? "text-err"
                      : endpoint.errorRate >
                        0.1
                        ? "text-warn"
                        : "text-ok",
                  )}
                >
                  {
                    endpoint.errorRate
                  }
                  %
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function ServiceDetailPage() {
  const {
    id,
  } =
    useParams<"id">();

  if (!id) {
    return (
      <ServiceNotFound />
    );
  }

  return (
    <ServiceDetailContent
      serviceId={id}
    />
  );
}