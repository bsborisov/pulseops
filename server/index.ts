import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";

import { getOverviewSnapshot } from "./data/overview.ts";
import { getServiceDetail } from "./data/services.ts";
import { createRealtimeServer } from "./realtime/websocket.ts";
import { startMonitoringSimulator } from "./realtime/simulator.ts";

import type { IncidentStatus } from "../shared/monitoring.ts";
import type { BroadcastRealtimeEvent } from "./realtime/websocket.ts";
import { updateIncidentStatus } from "./data/overview.ts";

const HOST = "127.0.0.1";
const PORT = Number(
  process.env.PORT ?? 4000,
);

let broadcastRealtimeEvent: BroadcastRealtimeEvent = () => undefined;

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

async function handleRequest(
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

  if (
    request.method ===
    "PATCH" &&
    url.pathname.startsWith(
      "/api/incidents/",
    )
  ) {
    const incidentId =
      decodeURIComponent(
        url.pathname.slice(
          "/api/incidents/"
            .length,
        ),
      );

    try {
      const body =
        await readJsonBody(
          request,
        );

      if (
        typeof body !==
        "object" ||
        body === null ||
        !("status" in body) ||
        !isIncidentStatus(
          body.status,
        )
      ) {
        sendJson(
          response,
          400,
          {
            error:
              "Invalid incident status",
          },
        );

        return;
      }

      const incident =
        updateIncidentStatus(
          incidentId,
          body.status,
        );

      if (!incident) {
        sendJson(
          response,
          404,
          {
            error:
              "Incident not found",
          },
        );

        return;
      }

      broadcastRealtimeEvent({
        type:
          "incident.updated",

        payload:
          incident,
      });

      sendJson(
        response,
        200,
        incident,
      );
    } catch {
      sendJson(
        response,
        400,
        {
          error:
            "Invalid request body",
        },
      );
    }

    return;
  }

  sendJson(response, 404, {
    error: "Not found",
  });
}

const server = createServer(handleRequest);

const realtime = createRealtimeServer(server);
broadcastRealtimeEvent = realtime.broadcast;

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

async function readJsonBody(
  request: IncomingMessage,
): Promise<unknown> {
  const chunks:
    Buffer[] = [];

  let size = 0;

  for await (
    const chunk of request
  ) {
    const buffer =
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk);

    size += buffer.length;

    if (size > 16_384) {
      throw new Error(
        "Request body is too large",
      );
    }

    chunks.push(buffer);
  }

  if (
    chunks.length === 0
  ) {
    throw new Error(
      "Request body is required",
    );
  }

  return JSON.parse(
    Buffer.concat(chunks)
      .toString("utf8"),
  ) as unknown;
}

function isIncidentStatus(
  value: unknown,
): value is IncidentStatus {
  return (
    value ===
    "investigating" ||
    value ===
    "identified" ||
    value ===
    "monitoring" ||
    value ===
    "resolved"
  );
}