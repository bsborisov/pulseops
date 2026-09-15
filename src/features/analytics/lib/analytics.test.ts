import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  ChartPoint,
  EndpointStat,
  ServiceHealth,
} from "@shared/monitoring";

import {
  getEndpointAnalytics,
  getServiceThroughput,
  getTrafficAnalytics,
} from "./analytics";

describe(
  "analytics",
  () => {
    it(
      "calculates rolling traffic metrics",
      () => {
        const chart: ChartPoint[] = [
          {
            timestamp: 1_726_397_200_000,
            label: "10:00",
            total: 100,
            success: 98,
            failed: 2,
          },

          {
            timestamp: 1_726_397_260_000,
            label: "10:01",
            total: 200,
            success: 190,
            failed: 10,
          },
        ];

        const result =
          getTrafficAnalytics(
            chart,
          );

        expect(
          result.totalRequests,
        ).toBe(300);

        expect(
          result.averageRps,
        ).toBe(150);

        expect(
          result.peakRps,
        ).toBe(200);

        expect(
          result.successRate,
        ).toBeCloseTo(
          96,
        );

        expect(
          result.errorRate,
        ).toBeCloseTo(
          4,
        );
      },
    );

    it(
      "calculates traffic-weighted endpoint metrics",
      () => {
        const endpoints:
          EndpointStat[] = [
            {
              endpoint:
                "/api/a",
              method: "GET",
              service: "A",
              rps: 100,
              p95: 100,
              errorRate: 1,
              volumePercent: 50,
            },

            {
              endpoint:
                "/api/b",
              method: "POST",
              service: "B",
              rps: 300,
              p95: 200,
              errorRate: 3,
              volumePercent: 50,
            },
          ];

        const result =
          getEndpointAnalytics(
            endpoints,
          );

        expect(
          result.weightedP95,
        ).toBe(175);

        expect(
          result.weightedErrorRate,
        ).toBe(2.5);

        expect(
          result.slowestEndpoint
            ?.endpoint,
        ).toBe(
          "/api/b",
        );
      },
    );

    it(
      "orders services by throughput",
      () => {
        const services =
          [
            {
              id: "a",
              name: "A",
              rps: 100,
              latency: 40,
              status:
                "healthy",
              uptime:
                99.99,
            },

            {
              id: "b",
              name: "B",
              rps: 400,
              latency: 80,
              status:
                "healthy",
              uptime:
                99.9,
            },
          ] satisfies ServiceHealth[];

        const result =
          getServiceThroughput(
            services,
          );

        expect(
          result.map(
            (service) =>
              service.id,
          ),
        ).toEqual([
          "b",
          "a",
        ]);
      },
    );
  },
);