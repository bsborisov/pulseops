import type {
  Region,
  RequestEvent,
} from "@shared/monitoring";

export interface StatusDistribution {
  label: string;
  count: number;
  percentage: number;
  statusGroup: 2 | 3 | 4 | 5;
}

export interface RegionDistribution {
  region: Region;
  count: number;
  percentage: number;
}

const regions: Region[] = [
  "EU",
  "US",
  "APAC",
  "SA",
];

export function getStatusDistribution(
  requests: RequestEvent[],
): StatusDistribution[] {
  const sample =
    requests.slice(0, 500);

  const total =
    sample.length || 1;

  const counts = {
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const request of sample) {
    const group =
      Math.floor(
        request.status / 100,
      );

    if (
      group === 2 ||
      group === 3 ||
      group === 4 ||
      group === 5
    ) {
      counts[group] += 1;
    }
  }

  return (
    [
      {
        label: "2xx Success",
        statusGroup: 2,
        count: counts[2],
      },
      {
        label: "3xx Redirect",
        statusGroup: 3,
        count: counts[3],
      },
      {
        label: "4xx Client Error",
        statusGroup: 4,
        count: counts[4],
      },
      {
        label: "5xx Server Error",
        statusGroup: 5,
        count: counts[5],
      },
    ] as const
  ).map((item) => ({
    ...item,

    percentage:
      (item.count / total) *
      100,
  }));
}

export function getRegionDistribution(
  requests: RequestEvent[],
): RegionDistribution[] {
  const sample =
    requests.slice(0, 500);

  const total =
    sample.length || 1;

  const counts =
    new Map<Region, number>(
      regions.map(
        (region) => [
          region,
          0,
        ],
      ),
    );

  for (const request of sample) {
    counts.set(
      request.region,
      (counts.get(
        request.region,
      ) ?? 0) + 1,
    );
  }

  return regions
    .map((region) => {
      const count =
        counts.get(region) ?? 0;

      return {
        region,
        count,

        percentage:
          (count / total) *
          100,
      };
    })
    .sort(
      (a, b) =>
        b.count - a.count,
    );
}