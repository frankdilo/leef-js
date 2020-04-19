import { LeefHeaders } from "./types";

/**
 * Given a user-provided path/URL and a base URL, returns the URL where the request
 * should be performed.
 */
export function computeRequestURL(pathOrURL: string, baseURL?: string): string {
  if (!baseURL) {
    return pathOrURL;
  }

  // even if baseURL provided, pathOrURL is a full URL
  if (/(http|https|ftp):\/\//.test(pathOrURL)) {
    return pathOrURL;
  }

  // remove trailing slash for baseURL
  let base = baseURL.endsWith("/") ? baseURL.slice(0, baseURL.length - 1) : baseURL;
  // add leading slash to path
  let path = pathOrURL.startsWith("/") ? pathOrURL : `/${pathOrURL}`;

  return `${base}${path}`;
}

export function convertHeaders(headers: LeefHeaders): Headers {
  const res = new Headers();

  for (const key in headers) {
    res.set(key, headers[key].toString());
  }

  return res;
}

export function explodeHeaders(
  headers: Headers & { entries: () => Iterable<[string, string]> }
): { [header: string]: string } {
  const res = {};

  for (const keyValue of Array.from(headers.entries())) {
    const key = keyValue[0];
    const value = keyValue[1];
    if (value) res[key] = value;
  }

  return res;
}
