import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
  useLocation,
} from "react-router";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  useDashboardSearchParams,
} from "./useDashboardSearchParams";

function Harness() {
  const {
    timeRange,
    setTimeRange,
    environment,
    setEnvironment,
  } =
    useDashboardSearchParams();

  const location =
    useLocation();

  return (
    <>
      <div>
        Range:{timeRange}
      </div>

      <div>
        Environment:
        {environment}
      </div>

      <div data-testid="search">
        {location.search}
      </div>

      <button
        type="button"
        onClick={() =>
          setTimeRange("15m")
        }
      >
        Set 15m
      </button>

      <button
        type="button"
        onClick={() =>
          setTimeRange("5m")
        }
      >
        Set default range
      </button>

      <button
        type="button"
        onClick={() =>
          setEnvironment(
            "staging",
          )
        }
      >
        Set staging
      </button>

      <button
        type="button"
        onClick={() =>
          setEnvironment(
            "production",
          )
        }
      >
        Set default environment
      </button>
    </>
  );
}

describe(
  "useDashboardSearchParams",
  () => {
    it(
      "uses dashboard defaults when search params are absent",
      () => {
        render(
          <MemoryRouter>
            <Harness />
          </MemoryRouter>,
        );

        expect(
          screen.getByText(
            "Range:5m",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Environment:production",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "updates URL state while preserving unrelated parameters",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter
            initialEntries={[
              "/?region=EU",
            ]}
          >
            <Harness />
          </MemoryRouter>,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Set 15m",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "search",
          ),
        ).toHaveTextContent(
          "region=EU",
        );

        expect(
          screen.getByTestId(
            "search",
          ),
        ).toHaveTextContent(
          "range=15m",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Set staging",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "search",
          ),
        ).toHaveTextContent(
          "env=staging",
        );
      },
    );

    it(
      "removes default values from the URL",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter
            initialEntries={[
              "/?range=15m&env=staging",
            ]}
          >
            <Harness />
          </MemoryRouter>,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Set default range",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Set default environment",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "search",
          ),
        ).toHaveTextContent(
          "",
        );
      },
    );

    it(
      "falls back safely for invalid URL values",
      () => {
        render(
          <MemoryRouter
            initialEntries={[
              "/?range=banana&env=unknown",
            ]}
          >
            <Harness />
          </MemoryRouter>,
        );

        expect(
          screen.getByText(
            "Range:5m",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Environment:production",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);