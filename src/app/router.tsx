import { createBrowserRouter } from "react-router";

import {
  OverviewPage,
} from "@/features/overview/components/OverviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OverviewPage />,
  },
]);