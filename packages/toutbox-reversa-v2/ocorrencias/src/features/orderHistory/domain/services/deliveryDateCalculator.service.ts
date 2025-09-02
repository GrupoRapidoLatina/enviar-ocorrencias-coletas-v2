import { DATE_FORMAT_CONFIG } from "../../../../@constants/dateFormatConfig";
import { HOLIDAYS } from "../../../../@constants/holidays";
import type { ICitiesService } from "../../../../@shared/interfaces/cities.service.interface";
import {
	SchedulePeriod,
	type TSchedulePeriod,
} from "../../../../@shared/services/toutbox/command/scheduleOrder.command";

export class DeliveryDateCalculatorService {
	private citiesWith30DaysSla = {
		FLORIANOPOLIS: {
			CUT_DATE: 27,
		},
		MANAUS: {
			CUT_DATE: 20,
		},
	};
	constructor(private readonly citiesService: ICitiesService) {}

	public async calculate(city: string) {
		let cityDeliverySla = await this.citiesService.getCitySla(city);

		if (!cityDeliverySla) {
			cityDeliverySla = 7;
		}

		const today = new Date();
		const formattedToday = new Date(
			today.toLocaleString("en-US", DATE_FORMAT_CONFIG),
		);
		let deliveryDate: Date = formattedToday;

		if (
			cityDeliverySla === 30 &&
			city.toUpperCase() in this.citiesWith30DaysSla
		) {
			const cutDate = this.citiesWith30DaysSla[city.toUpperCase()].CUT_DATE;
			const dateForDelivery = this.getDateForDelivery(formattedToday, cutDate);

			deliveryDate = this.getLastBusinnesDayOfMonth(dateForDelivery);
		} else {
			deliveryDate = this.addDaysToDeliveryDate(formattedToday, cityDeliverySla);
		}

		const deliveryDay = this.formatDate(deliveryDate, "YYYY-MM-DD");
		const deliveryHour = this.formatDate(deliveryDate, "HH:mm:ss");

		return {
			deliveryDate: `${deliveryDay}T${deliveryHour}`,
			period: this.getSchedulePeriod(`${deliveryDay}T${deliveryHour}`),
		};
	}

	private getDateForDelivery(formattedToday: Date, cutDate: number): Date {
		return formattedToday.getDate() <= cutDate
			? formattedToday
			: new Date(
					formattedToday.getFullYear(),
					formattedToday.getMonth() + 1,
					1,
				);
	}

	private getSchedulePeriod(dateString: string): TSchedulePeriod {
		const scheduleHour = dateString.split("T")[1].substring(0, 2);
		const isAfternoon = Number(scheduleHour) > 12;

		return isAfternoon ? SchedulePeriod.AFTERNOON : SchedulePeriod.MORNING;
	}

	private addDaysToDeliveryDate(deliveryDate: Date, days: number) {
		let addedDays = 0;
		while (addedDays < days) {
			deliveryDate.setDate(deliveryDate.getDate() + 1);
			const isBusinessDay = this.isBusinessDay(deliveryDate);

			if (isBusinessDay) {
				addedDays++;
			}
		}

		return deliveryDate;
	}

	private getLastBusinnesDayOfMonth(date: Date): Date {
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		while (!this.isBusinessDay(lastDay)) {
			lastDay.setDate(lastDay.getDate() - 1);
		}

		return lastDay;
	}

	private formatDate(date: Date, format: string): string {
		const pad = (n: number) => n.toString().padStart(2, "0");

		return format
			.replace("YYYY", date.getFullYear().toString())
			.replace("MM", pad(date.getMonth() + 1))
			.replace("DD", pad(date.getDate()))
			.replace("HH", pad(date.getHours()))
			.replace("mm", pad(date.getMinutes()))
			.replace("ss", pad(date.getSeconds()));
	}

	private isBusinessDay(date: Date): boolean {
		const day = date.getDay();
		const isWeekend = day === 0 || day === 6;
		const isHoliday = HOLIDAYS.includes(this.formatDate(date, 'MM-DD'));
		
		return !isWeekend && !isHoliday;
	}
}
