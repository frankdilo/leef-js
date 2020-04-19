export interface LeefOptions {
  baseURL?: string;
  headers?: LeefHeaders;
  bodyEncoder?: (_: any) => string;
  defaultContentType?: string;
}

export interface LeefHeaders {
  [key: string]: string | number;
}

export type HttpMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH";
