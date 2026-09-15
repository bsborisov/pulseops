export class ApiError extends Error {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

interface JsonRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  signal?: AbortSignal;
  headers?: HeadersInit;
  body?: unknown;
}

export async function requestJson<T>(
  url: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const headers =
    new Headers(
      options.headers,
    );

  headers.set(
    "Accept",
    "application/json",
  );

  let body:
    | string
    | undefined;

  if (
    options.body !==
    undefined
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );

    body =
      JSON.stringify(
        options.body,
      );
  }

  const response =
    await fetch(url, {
      method:
        options.method ??
        "GET",

      headers,
      body,

      signal:
        options.signal,
    });

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      const data =
        (await response.json()) as {
          error?: unknown;
        };

      if (
        typeof data.error ===
        "string"
      ) {
        message =
          data.error;
      }
    } catch {
      // Keep the generic message.
    }

    throw new ApiError(
      message,
      response.status,
    );
  }

  if (
    response.status ===
    204
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

interface GetJsonOptions {
  signal?: AbortSignal;
}

export function getJson<T>(
  url: string,
  options: GetJsonOptions = {},
) {
  return requestJson<T>(
    url,
    {
      method: "GET",
      signal:
        options.signal,
    },
  );
}

interface PatchJsonOptions {
  signal?: AbortSignal;
}

export function patchJson<
  TResponse,
  TBody,
>(
  url: string,
  body: TBody,
  options:
    PatchJsonOptions = {},
) {
  return requestJson<TResponse>(
    url,
    {
      method: "PATCH",
      body,
      signal:
        options.signal,
    },
  );
}