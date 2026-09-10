import { MemoryRouter } from "react-router";
import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OverviewPage,
} from "@/features/overview/components/OverviewPage";

describe("OverviewPage", () => {
  it("renders the PulseOps dashboard", () => {
    render(
      <MemoryRouter>
        <OverviewPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        "Realtime Traffic",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "System Health",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Live Request Stream",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Endpoint Performance",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Recent Incidents",
      ),
    ).toBeInTheDocument();
  });
});