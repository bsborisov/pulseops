import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";

import {
  getOverviewSnapshot,
} from "./data/overview.ts";

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

  sendJson(response, 404, {
    error: "Not found",
  });
}

const server =
  createServer(handleRequest);

server.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `PulseOps API listening on http://${HOST}:${PORT}`,
    );
  },
);