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
