export interface FullLeefOptions {
  baseURL?: string;
  headers?: LeefHeaders;
  timeout: number;
  bodySerializer: (_: any) => string;
  defaultContentType: string;
}

export type LeefOptions = Partial<FullLeefOptions>;

export interface LeefHeaders {
  [key: string]: string | number;
}

export type HttpMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH";

export interface LeefResponse {
  data: any;
  headers: { [header: string]: string };
  status: number;
  fetchResponse: Response;
}
