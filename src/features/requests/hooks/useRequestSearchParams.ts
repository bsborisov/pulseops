import {
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "react-router";

import {
  isHttpMethod,
  isRegion,
  isStatusFilter,
  type RequestFilters,
} from "@/features/requests/lib/request-filters";

type RequestParam =
  | "q"
  | "method"
  | "status"
  | "region"
  | "service"
  | "request";

export function useRequestSearchParams() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const search =
    searchParams.get("q") ?? "";

  const methodParam =
    searchParams.get("method");

  const statusParam =
    searchParams.get("status");

  const regionParam =
    searchParams.get("region");

  const service =
    searchParams.get("service") ??
    "all";

  const filters =
    useMemo<RequestFilters>(
      () => ({
        search,

        method:
          isHttpMethod(methodParam)
            ? methodParam
            : "all",

        status:
          isStatusFilter(
            statusParam,
          )
            ? statusParam
            : "all",

        region:
          isRegion(regionParam)
            ? regionParam
            : "all",

        service,
      }),
      [
        search,
        methodParam,
        statusParam,
        regionParam,
        service,
      ],
    );

  const selectedRequestId =
    searchParams.get("request");

  const updateParam =
    useCallback(
      (
        key: RequestParam,
        value: string | null,
        options?: {
          replace?: boolean;
        },
      ) => {
        setSearchParams(
          (current) => {
            const next =
              new URLSearchParams(
                current,
              );

            if (
              !value ||
              value === "all"
            ) {
              next.delete(key);
            } else {
              next.set(
                key,
                value,
              );
            }

            return next;
          },
          {
            replace:
              options?.replace ??
              false,

            preventScrollReset:
              true,
          },
        );
      },
      [
        setSearchParams,
      ],
    );

  const clearFilters =
    useCallback(() => {
      setSearchParams(
        (current) => {
          const next =
            new URLSearchParams(
              current,
            );

          next.delete("q");
          next.delete("method");
          next.delete("status");
          next.delete("region");
          next.delete("service");

          return next;
        },
        {
          preventScrollReset:
            true,
        },
      );
    }, [
      setSearchParams,
    ]);

  const setSearch =
    useCallback(
      (value: string) => {
        updateParam(
          "q",
          value,
          {
            replace: true,
          },
        );
      },
      [
        updateParam,
      ],
    );

  const setMethod =
    useCallback(
      (value: string) => {
        updateParam(
          "method",
          value,
        );
      },
      [
        updateParam,
      ],
    );

  const setStatus =
    useCallback(
      (value: string) => {
        updateParam(
          "status",
          value,
        );
      },
      [
        updateParam,
      ],
    );

  const setRegion =
    useCallback(
      (value: string) => {
        updateParam(
          "region",
          value,
        );
      },
      [
        updateParam,
      ],
    );

  const setService =
    useCallback(
      (value: string) => {
        updateParam(
          "service",
          value,
        );
      },
      [
        updateParam,
      ],
    );

  const setSelectedRequestId =
    useCallback(
      (
        value:
          | string
          | null,
      ) => {
        updateParam(
          "request",
          value,
          {
            replace: true,
          },
        );
      },
      [
        updateParam,
      ],
    );

  return {
    filters,
    selectedRequestId,

    setSearch,
    setMethod,
    setStatus,
    setRegion,
    setService,
    setSelectedRequestId,

    clearFilters,
  };
}