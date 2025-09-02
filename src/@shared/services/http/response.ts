import type { IResponse } from "../../interfaces/httpService.interface";

export class Response<T> implements IResponse<T> {
  error: boolean;
  data: T;
  status: number;
  message?: string;

  constructor({ error, data, status, message }: IResponse<T>) {
    this.error = error;
    this.data = data;
    this.status = status;
    this.message = message;
  }
}
