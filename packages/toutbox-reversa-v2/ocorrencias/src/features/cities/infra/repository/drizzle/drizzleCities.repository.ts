import { eq } from "drizzle-orm";
import { citiesSchema } from "../../../../../@external/orm/drizzle/schemas";
import type { ICitiesRepository } from "../../../domain/contracts/cities.repository.interface";

export class DrizzleCitiesRepository implements ICitiesRepository {
	constructor(private readonly drizzle: any) {}
	async getCitySla(city: string): Promise<number> {
		const result = await this.drizzle
			.select()
			.from(citiesSchema)
			.where(eq(citiesSchema.cidade, city))
			.limit(1);

		return result[0]?.periodo_dias ?? 1;
	}
}
