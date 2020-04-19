import { computeRequestURL, convertHeaders, explodeHeaders } from "./utils";
import { HttpMethod, LeefOptions, LeefHeaders, LeefResponse, FullLeefOptions } from "./types";
import { TimeoutError } from "./errors";

const defaultOptions = {
  timeout: 30000,
  bodySerializer: (value: any) => JSON.stringify(value),
  defaultContentType: "application/json",
};

function defaultHeaders(method: HttpMethod, options: LeefOptions): LeefHeaders {
  const headers = {};
  if (["POST", "PUT", "PATCH"].includes(method)) {
    headers["content-type"] = options.defaultContentType;
  }
  return headers;
}

async function performFetchRequest(
  method: HttpMethod,
  url: string,
  instanceOptions?: LeefOptions,
  requestOptions?: LeefOptions,
  body?: any
): Promise<LeefResponse> {
  const opts: FullLeefOptions = { ...defaultOptions, ...instanceOptions, ...requestOptions };
  const headers = convertHeaders({ ...defaultHeaders(method, opts), ...opts.headers });
  const computedURL = computeRequestURL(url, opts?.baseURL);
  const abortController = new AbortController();

  const fetchArgs: any = {
    method: method,
    body: opts.bodySerializer(body),
    headers: headers,
    signal: abortController.signal,
  };

  try {
    const timeout = setTimeout(() => abortController.abort(), opts.timeout);
    const response = await fetch(computedURL, fetchArgs);
    clearTimeout(timeout);

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return buildLeefResponse(data, response);
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const data = await response.formData();
      return buildLeefResponse(data, response);
    } else {
      const data = await response.text();
      return buildLeefResponse(data, response);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      throw new TimeoutError();
    } else {
      throw err;
    }
  }
}

function buildLeefResponse(data: any, fetchResponse: Response) {
  return {
    data,
    status: fetchResponse.status,
    headers: explodeHeaders(fetchResponse.headers as any),
    fetchResponse: fetchResponse,
  };
}

function buildInstance(options?: LeefOptions) {
  let instanceOptions = options;

  return {
    get: async function(url: string, options?: LeefOptions) {
      return performFetchRequest("GET", url, instanceOptions, options);
    },
    post: async function(url: string, data?: any, options?: LeefOptions) {
      return performFetchRequest("POST", url, instanceOptions, options, data);
    },
    put: async function(url: string, data?: any, options?: LeefOptions) {
      return performFetchRequest("PUT", url, instanceOptions, options, data);
    },
    patch: async function(url: string, data?: any, options?: LeefOptions) {
      return performFetchRequest("PATCH", url, instanceOptions, options, data);
    },
    delete: async function(url: string, options?: LeefOptions) {
      return performFetchRequest("DELETE", url, instanceOptions, options);
    },
    head: async function(url: string, options?: LeefOptions) {
      return performFetchRequest("HEAD", url, instanceOptions, options);
    },
    options: async function(url: string, options?: LeefOptions) {
      return performFetchRequest("OPTIONS", url, instanceOptions, options);
    },
    instance: buildInstance,
  };
}

const leef = buildInstance();

export default leef;
