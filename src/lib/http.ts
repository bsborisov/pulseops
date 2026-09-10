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

interface GetJsonOptions {
  signal?: AbortSignal;
}

export async function getJson<T>(
  url: string,
  options: GetJsonOptions = {},
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },

    signal: options.signal,
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}