import { AxiosRequestConfig } from 'axios';

export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
