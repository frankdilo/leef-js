export interface Options {}

export interface LeefResponse<T = any>  {
  data: T;
  status: number;
}

export async function request<T = any, R = LeefResponse<T>>(url: string, options?: Options): Promise<LeefResponse<T>> {
  return new Promise((resolve, reject) => {
    resolve({
      data: "hello" as any,
      status: 200
    })
  })
}