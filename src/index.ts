import "isomorphic-fetch";
import { computeRequestURL, convertHeaders } from "./utils";
import { HttpMethod, LeefOptions, LeefHeaders } from "./types";

const defaultOptions: LeefOptions = {
  bodyEncoder: (value: any) => JSON.stringify(value),
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
) {
  const opts = { ...defaultOptions, ...instanceOptions, ...requestOptions };
  const headers = convertHeaders({ ...defaultHeaders(method, opts), ...opts.headers });
  const computedURL = computeRequestURL(url, opts?.baseURL);

  const fetchArgs: any = { method, headers };
  if (body && opts.bodyEncoder) fetchArgs.body = opts.bodyEncoder(body);

  try {
    const res = await fetch(computedURL, fetchArgs);

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return {
        data: await res.json(),
        status: res.status,
      };
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      return {
        data: await res.formData(),
        status: res.status,
      };
    } else {
      return {
        data: await res.text(),
        status: res.status,
      };
    }
  } catch (err) {
    throw err;
  }
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
