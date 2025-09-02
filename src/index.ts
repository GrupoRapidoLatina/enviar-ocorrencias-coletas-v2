import * as fs from "node:fs";
import { ENV } from "./@constants/env";
import { connection } from "./@external/orm/drizzle";
import { CitiesService } from "./@shared/services/cities/cities.service";
import { EquipmentsService } from "./@shared/services/equipments/equipments.service";
import { EquipmentsLogsService } from "./@shared/services/equipmentsLogs/equipmentsLogs.service";
import { HistoryLogsService } from "./@shared/services/historyLogs/historyLogs.service";
import { AxiosHttpService } from "./@shared/services/http/service/axiosHttp.service";
import { ToutboxService } from "./@shared/services/toutbox/toutbox.service";
import { DrizzleCitiesRepository } from "./features/cities/infra/repository/drizzle/drizzleCities.repository";
import { DrizzleEquipmentsRepository } from "./features/equipments/infra/repository/drizzle/drizzleEquipments.repository";
import { DrizzleEquipmentsLogsRepository } from "./features/equipmentsLogs/infra/repository/drizzle/drizzleEquipmentsLogs.repository";
import { DrizzleHistoryLogsRepository } from "./features/historyLogs/infra/repositories/drizzleHistoryLogs.repository";
import { DeliveryDateCalculatorService } from "./features/orderHistory/domain/services/deliveryDateCalculator.service";
import { SendOrderHistoryUsecase } from "./features/orderHistory/domain/usecase/sendOrderHistory.usecase";
import { DrizzleOrderHistoryRepository } from "./features/orderHistory/infra/repositories/drizzleOrderHistory.repository";

// biome-ignore lint/suspicious/noExplicitAny: true
export async function main(..._args: any[]) {
	const startTime = Date.now();
	const drizzleOrderHistoryRepository = new DrizzleOrderHistoryRepository();
	const drizzleHistoryLogsRepository = new DrizzleHistoryLogsRepository();
	const drizzleCitiesRepository = new DrizzleCitiesRepository();
	const drizzleEquipmentsLogsRepository = new DrizzleEquipmentsLogsRepository();
	const historyLogsService = new HistoryLogsService(
		drizzleHistoryLogsRepository,
	);
	const usecase = new SendOrderHistoryUsecase(
		drizzleOrderHistoryRepository,
		historyLogsService,
		new DeliveryDateCalculatorService(
			new CitiesService(drizzleCitiesRepository),
		),
		new EquipmentsService(new DrizzleEquipmentsRepository()),
		new ToutboxService(new AxiosHttpService(ENV.TOUTBOX_BASE_URL ?? "")),
		new EquipmentsLogsService(drizzleEquipmentsLogsRepository),
	);

	const result = await usecase.execute();
	console.log(result?.length);
	const endTime = Date.now();
	fs.writeFileSync(`result-${endTime}.json`, JSON.stringify(result, null, 2));
	await connection.end();

	const millisecondsDuration = endTime - startTime;
	const secondsDuration = millisecondsDuration / 1000;
	const minutesDuration = secondsDuration / 60;
	console.log(
		`Execution finished, took ${millisecondsDuration} milliseconds or ${secondsDuration} seconds or ${minutesDuration} minutes`,
	);
	return {
		body: result,
	};
}

main();
