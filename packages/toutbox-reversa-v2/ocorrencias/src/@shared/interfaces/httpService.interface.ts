export interface IResponse<T = unknown> {
  error: boolean;
  data: T;
  status: number;
  message?: string;
}

export interface IRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface IHttpService {
  get<ResponseBody>(
    url: string,
    config?: IRequestConfig
  ): Promise<IResponse<ResponseBody>>;
  post<RequestBody, ResponseBody>(
    url: string,
    data: RequestBody,
    config?: IRequestConfig
  ): Promise<IResponse<ResponseBody>>;
  put<RequestBody, ResponseBody>(
    url: string,
    data: RequestBody,
    config?: IRequestConfig
  ): Promise<IResponse<ResponseBody>>;
  delete(url: string, config?: IRequestConfig): Promise<IResponse>;
}
