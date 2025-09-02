export interface ICitiesService {
	getCitySla(city: string): Promise<number>;
}
