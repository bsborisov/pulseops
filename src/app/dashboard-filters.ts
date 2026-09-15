import type {
  Environment,
  TimeRange,
} from "@shared/monitoring";

export const TIME_RANGES = [
  "1m",
  "5m",
  "15m",
  "1h",
] as const satisfies readonly TimeRange[];

export const ENVIRONMENTS = [
  "production",
  "staging",
  "development",
] as const satisfies readonly Environment[];

export const DEFAULT_TIME_RANGE:
  TimeRange = "5m";

export const DEFAULT_ENVIRONMENT:
  Environment = "production";

export function isTimeRange(
  value: string | null,
): value is TimeRange {
  return TIME_RANGES.some(
    (range) => range === value,
  );
}

export function isEnvironment(
  value: string | null,
): value is Environment {
  return ENVIRONMENTS.some(
    (environment) =>
      environment === value,
  );
}