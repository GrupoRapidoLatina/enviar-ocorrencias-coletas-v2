import axios, { type AxiosInstance } from "axios";
import type {
	IHttpService,
	IRequestConfig,
	IResponse,
} from "../../../interfaces/httpService.interface";
import { Response } from "../response";

export class AxiosHttpService implements IHttpService {
	private instance: AxiosInstance;

	constructor(baseURL: string) {
		this.instance = axios.create({
			baseURL,
			timeout: 10000,
			headers: { "Content-Type": "application/json" },
		});
	}

	public async delete(
		url: string,
		config?: IRequestConfig,
	): Promise<IResponse> {
		throw new Error("Method not implemented.");
	}

	public async get(url: string, config?: IRequestConfig) {
		try {
			const response = await this.instance.get(url, config);
			return new Response({
				error: false,
				data: response.data,
				status: response.status,
				message: response.statusText,
			});
		} catch (error) {
			return new Response({
				error: true,
				data: error.response?.data,
				status: error.response?.status ?? 500,
				message: error.message,
			});
		}
	}

	public async post<Y, T>(url: string, data: Y, config?: IRequestConfig) {
		try {
			const response = await this.instance.post(url, data, config);
			return new Response<T>({
				error: false,
				data: response.data,
				status: response.status,
				message: response.statusText,
			});
		} catch (error) {
			const errorResponse = error.response?.data ?? error.message;
			console.log(JSON.stringify(errorResponse, null, 2));
			return new Response({
				error: true,
				data: errorResponse,
				status: error.response?.status ?? 500,
				message: error.message,
			});
		}
	}

	public async put<Y, T>(url: string, data: Y, config?: IRequestConfig) {
		try {
			const response = await this.instance.put(url, data, config);
			return new Response<T>({
				error: false,
				data: response.data,
				status: response.status,
				message: response.statusText,
			});
		} catch (error) {
			const errorResponse = error.response?.data ?? error.message;
			console.log(JSON.stringify(errorResponse, null, 2));
			return new Response({
				error: true,
				data: errorResponse,
				status: error.response?.status ?? 500,
				message: error.message,
			});
		}
	}
}
