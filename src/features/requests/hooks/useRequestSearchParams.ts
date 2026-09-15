import { useCallback } from "react";
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

  const methodParam =
    searchParams.get("method");

  const statusParam =
    searchParams.get("status");

  const regionParam =
    searchParams.get("region");

  const filters: RequestFilters = {
    search:
      searchParams.get("q") ??
      "",

    method:
      isHttpMethod(methodParam)
        ? methodParam
        : "all",

    status:
      isStatusFilter(statusParam)
        ? statusParam
        : "all",

    region:
      isRegion(regionParam)
        ? regionParam
        : "all",

    service:
      searchParams.get(
        "service",
      ) ?? "all",
  };

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

  return {
    filters,

    selectedRequestId,

    setSearch: (
      value: string,
    ) =>
      updateParam(
        "q",
        value,
        {
          // Do not create one history entry
          // per typed character.
          replace: true,
        },
      ),

    setMethod: (
      value: string,
    ) =>
      updateParam(
        "method",
        value,
      ),

    setStatus: (
      value: string,
    ) =>
      updateParam(
        "status",
        value,
      ),

    setRegion: (
      value: string,
    ) =>
      updateParam(
        "region",
        value,
      ),

    setService: (
      value: string,
    ) =>
      updateParam(
        "service",
        value,
      ),

    setSelectedRequestId: (
      value: string | null,
    ) =>
      updateParam(
        "request",
        value,
        {
          replace: true,
        },
      ),

    clearFilters,
  };
}