import { useCallback } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router";

export function useDashboardNavigate() {
  const navigate =
    useNavigate();

  const {
    search,
  } = useLocation();

  return useCallback(
    (
      pathname: string,
    ) => {
      void navigate({
        pathname,
        search,
      });
    },
    [
      navigate,
      search,
    ],
  );
}