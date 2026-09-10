import type {
  Server,
} from "node:http";

import {
  WebSocket,
  WebSocketServer,
} from "ws";

import type {
  RealtimeEvent,
} from "../../shared/realtime.ts";

export type BroadcastRealtimeEvent = (
  event: RealtimeEvent,
) => void;

export interface RealtimeServer {
  broadcast: BroadcastRealtimeEvent;
}

export function createRealtimeServer(
  server: Server,
): RealtimeServer {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    perMessageDeflate: false,
  });

  wss.on(
    "connection",
    (socket) => {
      socket.on(
        "error",
        (error) => {
          console.error(
            "WebSocket error:",
            error,
          );
        },
      );

      console.log(
        `WebSocket connected (${wss.clients.size} clients)`,
      );

      socket.on(
        "close",
        () => {
          console.log(
            `WebSocket disconnected (${wss.clients.size} clients)`,
          );
        },
      );
    },
  );

  function broadcast(
    event: RealtimeEvent,
  ) {
    const message =
      JSON.stringify(event);

    for (const client of wss.clients) {
      if (
        client.readyState ===
        WebSocket.OPEN
      ) {
        client.send(message);
      }
    }
  }

  return {
    broadcast,
  };
}