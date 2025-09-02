import type { ICitiesRepository } from "../../../features/cities/domain/contracts/cities.repository.interface";
import type { ICitiesService } from "../../interfaces/cities.service.interface";

export class CitiesService implements ICitiesService {
	constructor(private readonly repository: ICitiesRepository) {}

	async getCitySla(city: string): Promise<number> {
		return this.repository.getCitySla(city);
	}
}
