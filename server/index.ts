import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";

import { getOverviewSnapshot } from "./data/overview.ts";
import { getServiceDetail } from "./data/services.ts";
import { createRealtimeServer } from "./realtime/websocket.ts";
import { startMonitoringSimulator } from "./realtime/simulator.ts";

const HOST = "127.0.0.1";
const PORT = Number(
  process.env.PORT ?? 4000,
);

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
) {
  response.writeHead(status, {
    "Content-Type":
      "application/json; charset=utf-8",

    "Cache-Control": "no-store",
  });

  response.end(JSON.stringify(body));
}

function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const url = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? `${HOST}:${PORT}`}`,
  );

  if (
    request.method === "GET" &&
    url.pathname === "/api/health"
  ) {
    sendJson(response, 200, {
      status: "ok",
    });

    return;
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/overview"
  ) {
    const snapshot =
      getOverviewSnapshot();

    sendJson(
      response,
      200,
      snapshot,
    );

    return;
  }

  if (
    request.method === "GET" &&
    url.pathname.startsWith(
      "/api/services/",
    )
  ) {
    const serviceId =
      decodeURIComponent(
        url.pathname.slice(
          "/api/services/".length,
        ),
      );

    const service =
      getServiceDetail(
        serviceId,
      );

    if (!service) {
      sendJson(
        response,
        404,
        {
          error:
            "Service not found",
        },
      );

      return;
    }

    sendJson(
      response,
      200,
      service,
    );

    return;
  }

  sendJson(response, 404, {
    error: "Not found",
  });
}

const server =
  createServer(handleRequest);

const realtime =
  createRealtimeServer(server);

const stopSimulator =
  startMonitoringSimulator(
    realtime.broadcast,
  );

server.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `PulseOps API listening on http://${HOST}:${PORT}`,
    );
  },
);

function shutdown() {
  stopSimulator();

  server.close(() => {
    process.exit(0);
  });
}

process.once(
  "SIGINT",
  shutdown,
);

process.once(
  "SIGTERM",
  shutdown,
);