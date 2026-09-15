import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  RequestEvent,
} from "@shared/monitoring";

import {
  getRegionDistribution,
  getStatusDistribution,
} from "./traffic-stats";

const requests:
  RequestEvent[] = [
    {
      id: "1",
      time: "10:00:00",
      method: "GET",
      endpoint: "/a",
      status: 200,
      latency: 40,
      region: "EU",
      service: "A",
    },
    {
      id: "2",
      time: "10:00:01",
      method: "GET",
      endpoint: "/b",
      status: 201,
      latency: 45,
      region: "EU",
      service: "B",
    },
    {
      id: "3",
      time: "10:00:02",
      method: "POST",
      endpoint: "/c",
      status: 404,
      latency: 60,
      region: "US",
      service: "C",
    },
    {
      id: "4",
      time: "10:00:03",
      method: "POST",
      endpoint: "/d",
      status: 500,
      latency: 300,
      region: "APAC",
      service: "D",
    },
  ];

describe(
  "traffic stats",
  () => {
    it(
      "calculates status distribution",
      () => {
        const result =
          getStatusDistribution(
            requests,
          );

        expect(
          result.find(
            (item) =>
              item.statusGroup ===
              2,
          ),
        ).toMatchObject({
          count: 2,
          percentage: 50,
        });

        expect(
          result.find(
            (item) =>
              item.statusGroup ===
              4,
          ),
        ).toMatchObject({
          count: 1,
          percentage: 25,
        });

        expect(
          result.find(
            (item) =>
              item.statusGroup ===
              5,
          ),
        ).toMatchObject({
          count: 1,
          percentage: 25,
        });
      },
    );

    it(
      "calculates regional distribution",
      () => {
        const result =
          getRegionDistribution(
            requests,
          );

        expect(
          result[0],
        ).toMatchObject({
          region: "EU",
          count: 2,
          percentage: 50,
        });
      },
    );
  },
);