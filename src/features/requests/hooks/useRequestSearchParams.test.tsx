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

import { useRequestSearchParams } from "./useRequestSearchParams";

function Harness() {
  const {
    filters,
    setMethod,
    setRegion,
    clearFilters,
  } =
    useRequestSearchParams();

  const location =
    useLocation();

  return (
    <>
      <div>
        Method:
        {filters.method}
      </div>

      <div>
        Region:
        {filters.region}
      </div>

      <div data-testid="search">
        {location.search}
      </div>

      <button
        type="button"
        onClick={() =>
          setMethod("POST")
        }
      >
        POST
      </button>

      <button
        type="button"
        onClick={() =>
          setRegion("EU")
        }
      >
        EU
      </button>

      <button
        type="button"
        onClick={
          clearFilters
        }
      >
        Clear
      </button>
    </>
  );
}

describe(
  "useRequestSearchParams",
  () => {
    it(
      "preserves dashboard search params",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter
            initialEntries={[
              "/requests?range=1h&env=staging",
            ]}
          >
            <Harness />
          </MemoryRouter>,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "POST",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "EU",
            },
          ),
        );

        const search =
          screen.getByTestId(
            "search",
          );

        expect(
          search,
        ).toHaveTextContent(
          "range=1h",
        );

        expect(
          search,
        ).toHaveTextContent(
          "env=staging",
        );

        expect(
          search,
        ).toHaveTextContent(
          "method=POST",
        );

        expect(
          search,
        ).toHaveTextContent(
          "region=EU",
        );
      },
    );

    it(
      "clears request filters without clearing dashboard state",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter
            initialEntries={[
              "/requests?range=15m&method=POST&region=EU",
            ]}
          >
            <Harness />
          </MemoryRouter>,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Clear",
            },
          ),
        );

        const search =
          screen.getByTestId(
            "search",
          );

        expect(
          search,
        ).toHaveTextContent(
          "range=15m",
        );

        expect(
          search,
        ).not.toHaveTextContent(
          "method=POST",
        );

        expect(
          search,
        ).not.toHaveTextContent(
          "region=EU",
        );
      },
    );
  },
);