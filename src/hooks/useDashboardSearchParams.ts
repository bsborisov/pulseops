import { useCallback } from "react";

import { useSearchParams } from "react-router";

import {
  DEFAULT_ENVIRONMENT,
  DEFAULT_TIME_RANGE,
  isEnvironment,
  isTimeRange,
} from "@/app/dashboard-filters";

import type {
  Environment,
  TimeRange,
} from "@shared/monitoring";

type DashboardParam =
  | "range"
  | "env";

export function useDashboardSearchParams() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const rawTimeRange =
    searchParams.get("range");

  const rawEnvironment =
    searchParams.get("env");

  const timeRange =
    isTimeRange(rawTimeRange)
      ? rawTimeRange
      : DEFAULT_TIME_RANGE;

  const environment =
    isEnvironment(rawEnvironment)
      ? rawEnvironment
      : DEFAULT_ENVIRONMENT;

  const updateParam =
    useCallback(
      (
        key: DashboardParam,
        value: string,
        defaultValue: string,
      ) => {
        setSearchParams(
          (current) => {
            const next =
              new URLSearchParams(
                current,
              );

            if (
              value ===
              defaultValue
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
            preventScrollReset:
              true,
          },
        );
      },
      [
        setSearchParams,
      ],
    );

  const setTimeRange =
    useCallback(
      (
        value: TimeRange,
      ) => {
        updateParam(
          "range",
          value,
          DEFAULT_TIME_RANGE,
        );
      },
      [
        updateParam,
      ],
    );

  const setEnvironment =
    useCallback(
      (
        value: Environment,
      ) => {
        updateParam(
          "env",
          value,
          DEFAULT_ENVIRONMENT,
        );
      },
      [
        updateParam,
      ],
    );

  return {
    timeRange,
    setTimeRange,

    environment,
    setEnvironment,
  };
}