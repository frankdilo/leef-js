import "cross-fetch/polyfill";
import { computeRequestURL, convertHeaders, explodeHeaders } from "./utils";
import { HttpMethod, LeefOptions, LeefHeaders, LeefResponse } from "./types";

const defaultOptions: LeefOptions = {
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
  const opts = { ...defaultOptions, ...instanceOptions, ...requestOptions };
  const headers = convertHeaders({ ...defaultHeaders(method, opts), ...opts.headers });
  const computedURL = computeRequestURL(url, opts?.baseURL);

  const fetchArgs: any = { method, headers };
  if (body && opts.bodySerializer) fetchArgs.body = opts.bodySerializer(body);

  try {
    const res = await fetch(computedURL, fetchArgs);

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await res.json();
      return buildLeefResponse(data, res);
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const data = await res.formData();
      return buildLeefResponse(data, res);
    } else {
      const data = await res.text();
      return buildLeefResponse(data, res);
    }
  } catch (err) {
    throw err;
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
