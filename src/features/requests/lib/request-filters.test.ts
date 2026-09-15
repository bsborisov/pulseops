import {
  describe,
  expect,
  it,
} from "vitest";

import type { RequestEvent } from "@shared/monitoring";

import {
  filterRequests,
  getRequestServices,
} from "./request-filters";

const requests:
  RequestEvent[] = [
    {
      id: "1",
      time: "10:00:00",
      method: "GET",
      endpoint:
        "/api/products",
      status: 200,
      latency: 42,
      region: "EU",
      service: "Catalog",
    },

    {
      id: "2",
      time: "10:00:01",
      method: "POST",
      endpoint:
        "/api/checkout",
      status: 500,
      latency: 340,
      region: "US",
      service: "Payments",
    },

    {
      id: "3",
      time: "10:00:02",
      method: "POST",
      endpoint:
        "/api/auth/login",
      status: 401,
      latency: 67,
      region: "EU",
      service:
        "Authentication",
    },
  ];

describe(
  "request filters",
  () => {
    it(
      "filters by multiple criteria",
      () => {
        const result =
          filterRequests(
            requests,
            {
              search: "",
              method: "POST",
              status: "5xx",
              region: "US",
              service:
                "Payments",
            },
          );

        expect(
          result,
        ).toHaveLength(1);

        expect(
          result[0]?.id,
        ).toBe("2");
      },
    );

    it(
      "searches endpoints and services",
      () => {
        expect(
          filterRequests(
            requests,
            {
              search:
                "checkout",
              method: "all",
              status: "all",
              region: "all",
              service: "all",
            },
          ),
        ).toHaveLength(1);

        expect(
          filterRequests(
            requests,
            {
              search:
                "authentication",
              method: "all",
              status: "all",
              region: "all",
              service: "all",
            },
          )[0]?.id,
        ).toBe("3");
      },
    );

    it(
      "returns unique sorted services",
      () => {
        expect(
          getRequestServices(
            requests,
          ),
        ).toEqual([
          "Authentication",
          "Catalog",
          "Payments",
        ]);
      },
    );
  },
);