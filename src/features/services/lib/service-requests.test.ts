import {
  describe,
  expect,
  it,
} from "vitest";

import type { RequestEvent } from "@shared/monitoring";
import { getServiceRequests } from "./service-requests";

const requests:
  RequestEvent[] = [
    {
      id: "1",
      time: "10:00:00",
      method: "POST",
      endpoint:
        "/api/checkout",
      status: 200,
      latency: 84,
      region: "EU",
      service: "Payments",
    },

    {
      id: "2",
      time: "10:00:01",
      method: "GET",
      endpoint:
        "/api/products",
      status: 200,
      latency: 42,
      region: "US",
      service: "Catalog",
    },
  ];

describe(
  "getServiceRequests",
  () => {
    it(
      "returns only requests belonging to the service",
      () => {
        const result =
          getServiceRequests(
            requests,
            [
              "Payments",
            ],
          );

        expect(
          result,
        ).toHaveLength(1);

        expect(
          result[0]?.service,
        ).toBe(
          "Payments",
        );
      },
    );
  },
);