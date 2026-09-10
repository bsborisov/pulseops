import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  it,
} from "vitest";

import { LiveRequestStream } from "./LiveRequestStream";
import type { RequestEvent } from "@shared/monitoring";

const firstRequest:
  RequestEvent = {
  id: "request-1",
  time: "15:30:00",
  method: "GET",
  endpoint: "/api/users",
  status: 200,
  latency: 42,
  region: "EU",
  service: "Users",
};

const secondRequest:
  RequestEvent = {
  id: "request-2",
  time: "15:30:01",
  method: "POST",
  endpoint: "/api/orders",
  status: 201,
  latency: 65,
  region: "US",
  service: "Orders",
};

describe(
  "LiveRequestStream",
  () => {
    it(
      "freezes requests while paused and catches up when resumed",
      async () => {
        const user =
          userEvent.setup();

        const {
          rerender,
        } = render(
          <LiveRequestStream
            requests={[
              firstRequest,
            ]}
            eventsPerSecond={24}
          />,
        );

        expect(
          screen.getByText(
            "/api/users",
          ),
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Pause",
            },
          ),
        );

        rerender(
          <LiveRequestStream
            requests={[
              secondRequest,
              firstRequest,
            ]}
            eventsPerSecond={24}
          />,
        );

        expect(
          screen.queryByText(
            "/api/orders",
          ),
        ).not.toBeInTheDocument();

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Resume",
            },
          ),
        );

        expect(
          screen.getByText(
            "/api/orders",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "keeps cleared requests hidden while allowing new ones",
      async () => {
        const user =
          userEvent.setup();

        const {
          rerender,
        } = render(
          <LiveRequestStream
            requests={[
              firstRequest,
            ]}
            eventsPerSecond={24}
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Clear",
            },
          ),
        );

        expect(
          screen.queryByText(
            "/api/users",
          ),
        ).not.toBeInTheDocument();

        rerender(
          <LiveRequestStream
            requests={[
              secondRequest,
              firstRequest,
            ]}
            eventsPerSecond={24}
          />,
        );

        expect(
          screen.getByText(
            "/api/orders",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "/api/users",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);