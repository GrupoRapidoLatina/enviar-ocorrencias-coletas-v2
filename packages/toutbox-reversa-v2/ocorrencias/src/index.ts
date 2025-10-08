import { ENV } from "./@constants/env";
import { getDB, closeDB } from "./@external/orm/drizzle";
import { CitiesService } from "./@shared/services/cities/cities.service";
import { EquipmentsService } from "./@shared/services/equipments/equipments.service";
import { EquipmentsLogsService } from "./@shared/services/equipmentsLogs/equipmentsLogs.service";
import { HistoryLogsService } from "./@shared/services/historyLogs/historyLogs.service";
import { AxiosHttpService } from "./@shared/services/http/service/axiosHttp.service";
import { ToutboxB2BService } from "./@shared/services/toutbox/toutboxB2B.service";
import { ToutboxB2CService } from "./@shared/services/toutbox/toutboxB2C.service";
import { DrizzleCitiesRepository } from "./features/cities/infra/repository/drizzle/drizzleCities.repository";
import { DrizzleEquipmentsRepository } from "./features/equipments/infra/repository/drizzle/drizzleEquipments.repository";
import { DrizzleEquipmentsLogsRepository } from "./features/equipmentsLogs/infra/repository/drizzle/drizzleEquipmentsLogs.repository";
import { DrizzleHistoryLogsRepository } from "./features/historyLogs/infra/repositories/drizzleHistoryLogs.repository";
import { DeliveryDateCalculatorService } from "./features/orderHistory/domain/services/deliveryDateCalculator.service";
import { SendOrderHistoryUsecase } from "./features/orderHistory/domain/usecase/sendOrderHistory.usecase";
import { DrizzleOrderHistoryRepository } from "./features/orderHistory/infra/repositories/drizzleOrderHistory.repository";
import { PreListaPostagemService } from "./@shared/services/preListaPostagem/preListaPostagem.service";

// biome-ignore lint/suspicious/noExplicitAny: true
export async function main(_args: any) {
  const startTime = Date.now();
  const db = await getDB();
  const drizzleOrderHistoryRepository = new DrizzleOrderHistoryRepository(db);
  const drizzleHistoryLogsRepository = new DrizzleHistoryLogsRepository(db);
  const drizzleCitiesRepository = new DrizzleCitiesRepository(db);
  const drizzleEquipmentsLogsRepository = new DrizzleEquipmentsLogsRepository(
    db
  );
  const historyLogsService = new HistoryLogsService(
    drizzleHistoryLogsRepository
  );

  const axiosHttpService = new AxiosHttpService(ENV.TOUTBOX_BASE_URL ?? "");
  const coletasAxiosHttpService = new AxiosHttpService(ENV.COLETAS_API_URL ?? "");
  const preListaPostagemService = new PreListaPostagemService(coletasAxiosHttpService);
  const toutboxStrategy = {
    "VIVO B2B": new ToutboxB2BService(axiosHttpService),
    "VIVO B2C": new ToutboxB2CService(axiosHttpService),
  }

  const usecase = new SendOrderHistoryUsecase(
    drizzleOrderHistoryRepository,
    historyLogsService,
    new DeliveryDateCalculatorService(
      new CitiesService(drizzleCitiesRepository)
    ),
    new EquipmentsService(new DrizzleEquipmentsRepository(db)),
    new EquipmentsLogsService(drizzleEquipmentsLogsRepository),
    toutboxStrategy,
    preListaPostagemService,
  );

  const result = await usecase.execute();
  const endTime = Date.now();
  await closeDB();

  const millisecondsDuration = endTime - startTime;
  const secondsDuration = millisecondsDuration / 1000;
  const minutesDuration = secondsDuration / 60;
  const executionTime = `Execution finished, took ${millisecondsDuration} milliseconds or ${secondsDuration} seconds or ${minutesDuration} minutes`;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success: true,
      executionTime,
      data: result,
    }),
  };
}
