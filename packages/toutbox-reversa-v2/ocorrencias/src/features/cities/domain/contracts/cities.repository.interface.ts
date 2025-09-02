export interface ICitiesRepository {
	getCitySla(city: string): Promise<number>;
}
