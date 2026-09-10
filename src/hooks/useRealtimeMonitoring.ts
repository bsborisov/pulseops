import {
  useEffect,
  useState,
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { OverviewSnapshot } from "@shared/monitoring";
import type { RealtimeEvent } from "@shared/realtime";
import type { ConnectionState } from "@/types/realtime";

import {
  overviewKeys,
} from "@/features/overview/queries/overview.queries";

import {
  applyOverviewEvent,
} from "@/features/overview/realtime/applyOverviewEvent";

const realtimeEventTypes =
  new Set<RealtimeEvent["type"]>([
    "kpi.updated",
    "chart.point",
    "request.created",
    "service.updated",
    "incident.updated",
  ]);

function isRealtimeEvent(
  value: unknown,
): value is RealtimeEvent {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  if (
    !("type" in value) ||
    !("payload" in value)
  ) {
    return false;
  }

  return (
    typeof value.type === "string" &&
    realtimeEventTypes.has(
      value.type as RealtimeEvent["type"],
    )
  );
}

function getWebSocketUrl() {
  const protocol =
    window.location.protocol ===
      "https:"
      ? "wss:"
      : "ws:";

  return `${protocol}//${window.location.host}/ws`;
}

export function useRealtimeMonitoring() {
  const queryClient =
    useQueryClient();

  const [
    connectionState,
    setConnectionState,
  ] =
    useState<ConnectionState>(
      "connecting",
    );

  useEffect(() => {
    let socket: WebSocket | null =
      null;

    let reconnectTimer:
      | number
      | undefined;

    let reconnectAttempt = 0;
    let disposed = false;

    function connect() {
      if (disposed) {
        return;
      }

      socket = new WebSocket(
        getWebSocketUrl(),
      );

      socket.addEventListener(
        "open",
        () => {
          reconnectAttempt = 0;

          setConnectionState(
            "live",
          );
        },
      );

      socket.addEventListener(
        "message",
        (message) => {
          try {
            const parsed: unknown =
              JSON.parse(
                String(
                  message.data,
                ),
              );

            if (
              !isRealtimeEvent(
                parsed,
              )
            ) {
              return;
            }

            queryClient.setQueryData<OverviewSnapshot>(
              overviewKeys.snapshot(),
              (current) => {
                if (!current) {
                  return current;
                }

                return applyOverviewEvent(
                  current,
                  parsed,
                );
              },
            );
          } catch {
            console.warn(
              "Invalid realtime message received",
            );
          }
        },
      );

      socket.addEventListener(
        "close",
        () => {
          if (disposed) {
            return;
          }

          reconnectAttempt += 1;

          if (
            !navigator.onLine
          ) {
            setConnectionState(
              "offline",
            );
          } else {
            setConnectionState(
              "reconnecting",
            );
          }

          const delay =
            Math.min(
              1_000 *
              2 **
              Math.min(
                reconnectAttempt -
                1,
                4,
              ),
              15_000,
            );

          reconnectTimer =
            window.setTimeout(
              connect,
              delay,
            );
        },
      );

      socket.addEventListener(
        "error",
        () => {
          socket?.close();
        },
      );
    }

    connect();

    return () => {
      disposed = true;

      if (
        reconnectTimer !==
        undefined
      ) {
        window.clearTimeout(
          reconnectTimer,
        );
      }

      socket?.close();
    };
  }, [
    queryClient,
  ]);

  return connectionState;
}