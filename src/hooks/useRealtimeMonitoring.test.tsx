import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  act,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  overviewKeys,
} from "@/features/overview/queries/overview.queries";

import {
  useRealtimeMonitoring,
} from "@/hooks/useRealtimeMonitoring";

import type { OverviewSnapshot } from "@shared/monitoring";
import type { RealtimeEvent } from "@shared/realtime";

type Listener = (
  event: Event,
) => void;

class FakeWebSocket {
  static instances:
    FakeWebSocket[] = [];

  readonly url: string;

  private readonly listeners =
    new Map<
      string,
      Set<Listener>
    >();

  constructor(
    url: string | URL,
  ) {
    this.url =
      String(url);

    FakeWebSocket.instances.push(
      this,
    );
  }

  addEventListener(
    type: string,
    listener:
      | EventListener
      | EventListenerObject,
  ) {
    const callback: Listener =
      typeof listener ===
        "function"
        ? listener
        : (event) =>
          listener.handleEvent(
            event,
          );

    const listeners =
      this.listeners.get(type) ??
      new Set<Listener>();

    listeners.add(callback);

    this.listeners.set(
      type,
      listeners,
    );
  }

  close() {
    this.emit(
      "close",
      new Event("close"),
    );
  }

  emitOpen() {
    this.emit(
      "open",
      new Event("open"),
    );
  }

  emitClose() {
    this.emit(
      "close",
      new Event("close"),
    );
  }

  emitMessage(
    data: string,
  ) {
    this.emit(
      "message",
      new MessageEvent(
        "message",
        {
          data,
        },
      ),
    );
  }

  private emit(
    type: string,
    event: Event,
  ) {
    const listeners =
      this.listeners.get(type);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(event);
    }
  }
}

function createSnapshot(): OverviewSnapshot {
  return {
    kpi: {
      rps: 1842,
      activeUsers: 438,
      errorRate: 0.42,
      latency: 128,
      eventsPerSecond: 24,
      rpsSparkline: [1842],
      usersSparkline: [438],
      errorSparkline: [0.42],
      latencySparkline: [128],
    },

    chart: [],
    services: [],
    requests: [],
    endpoints: [],
    incidents: [],
  };
}

function RealtimeHarness() {
  const state =
    useRealtimeMonitoring();

  return (
    <div>{state}</div>
  );
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

let originalWebSocket:
  typeof WebSocket;

beforeEach(() => {
  originalWebSocket =
    globalThis.WebSocket;

  FakeWebSocket.instances = [];

  globalThis.WebSocket =
    FakeWebSocket as unknown as typeof WebSocket;

  vi.spyOn(
    window.navigator,
    "onLine",
    "get",
  ).mockReturnValue(true);
});

afterEach(() => {
  globalThis.WebSocket =
    originalWebSocket;

  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe(
  "useRealtimeMonitoring",
  () => {
    it(
      "updates the query cache from realtime events",
      () => {
        const queryClient =
          createQueryClient();

        queryClient.setQueryData(
          overviewKeys.snapshot(),
          createSnapshot(),
        );

        render(
          <QueryClientProvider
            client={queryClient}
          >
            <RealtimeHarness />
          </QueryClientProvider>,
        );

        const socket =
          FakeWebSocket
            .instances[0];

        expect(
          socket,
        ).toBeDefined();

        act(() => {
          socket?.emitOpen();
        });

        expect(
          screen.getByText(
            "live",
          ),
        ).toBeInTheDocument();

        const event =
          {
            type: "kpi.updated",

            payload: {
              rps: 2100,
              activeUsers: 480,
              errorRate: 0.35,
              latency: 112,
              eventsPerSecond: 30,
            },
          } satisfies RealtimeEvent;

        act(() => {
          socket?.emitMessage(
            JSON.stringify(
              event,
            ),
          );
        });

        const updated =
          queryClient.getQueryData<OverviewSnapshot>(
            overviewKeys.snapshot(),
          );

        expect(
          updated?.kpi.rps,
        ).toBe(2100);

        expect(
          updated?.kpi.latency,
        ).toBe(112);
      },
    );

    it(
      "reconnects after a socket closes",
      () => {
        vi.useFakeTimers();

        const queryClient =
          createQueryClient();

        render(
          <QueryClientProvider
            client={queryClient}
          >
            <RealtimeHarness />
          </QueryClientProvider>,
        );

        const firstSocket =
          FakeWebSocket
            .instances[0];

        act(() => {
          firstSocket?.emitOpen();
        });

        expect(
          screen.getByText(
            "live",
          ),
        ).toBeInTheDocument();

        act(() => {
          firstSocket?.emitClose();
        });

        expect(
          screen.getByText(
            "reconnecting",
          ),
        ).toBeInTheDocument();

        expect(
          FakeWebSocket.instances,
        ).toHaveLength(1);

        act(() => {
          vi.advanceTimersByTime(
            1_000,
          );
        });

        expect(
          FakeWebSocket.instances,
        ).toHaveLength(2);

        const secondSocket =
          FakeWebSocket
            .instances[1];

        act(() => {
          secondSocket?.emitOpen();
        });

        expect(
          screen.getByText(
            "live",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);