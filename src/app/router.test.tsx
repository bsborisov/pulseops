
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
  OverviewPage
} from "@/features/overview/components/OverviewPage";


describe("OverviewPage", () => {
  it("renders the PulseOps dashboard", () => {
    render(<OverviewPage />);

    expect(
      screen.getByRole("heading", {
        name: "PulseOps",
      }),
    ).toBeInTheDocument();
  });
});