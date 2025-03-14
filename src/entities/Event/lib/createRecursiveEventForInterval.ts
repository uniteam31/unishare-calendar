import { DAY_MS, fullMonthsBetween, WEEK_MS } from 'shared/lib';
import { IEvent } from '../model/types/event';

const mapPeriodToTime = {
	'day': DAY_MS,
	'week': WEEK_MS,
};

interface IProps {
	event: IEvent;
	intervalStart: Date;
	intervalEnd: Date;
}

export const createRecursiveEventForInterval = (props: IProps) => {
	const { event, intervalStart, intervalEnd } = props;
	const { startTime, endTime, period, interval, days } = event;

	if (!interval || !period)
		return;

	const events: IEvent[] = [];

	if (period === 'day' || period === 'week' && !days?.length) {
		const actualPeriod = interval * mapPeriodToTime[period];

		const eventEndNumber = new Date(endTime).getTime();
		const eventStartNumber = new Date(startTime).getTime();

		const begin = intervalStart.getTime() - eventEndNumber;
		const end = intervalEnd.getTime() - eventStartNumber;

		// Номер первого повторяющегося события в интервале
		const n1 = begin < 0 ? 0 : Math.ceil(begin / actualPeriod);
		// Номер последнего повторяющегося события в интервале
		const n2 = Math.floor(end / actualPeriod);

		for (let n = n1; n <= n2; n++) {
			events.push({
				...event,
				startTime: new Date(eventStartNumber + n * actualPeriod).toISOString(),
				endTime: new Date(eventEndNumber + n * actualPeriod).toISOString(),
			});
		}

		return events;
	}

	if (period === 'week' && days?.length) {
		const eventStart = new Date(startTime);
		eventStart.setDate(eventStart.getDate() - eventStart.getDay() + 1);

		const eventEnd = new Date(endTime);
		eventEnd.setDate(eventEnd.getDate() - eventEnd.getDay() + 1);

		const originalWeekStart = new Date(startTime);
		originalWeekStart.setHours(0, 0, 0, 0);
		originalWeekStart.setDate(originalWeekStart.getDate() - originalWeekStart.getDay() + 1);

		if (intervalEnd.getTime() - intervalStart.getTime() === DAY_MS) {
			const currentWeekStart = new Date(intervalStart);
			currentWeekStart.setDate(currentWeekStart.getDate() - (currentWeekStart.getDay() || 6)  + 1);
			const currentWeekDay = (intervalStart.getDay() + 6) % 7;

			const diff = Math.round((currentWeekStart.getTime() - originalWeekStart.getTime()) / WEEK_MS);

			if (diff >= 0 && diff % interval === 0 && days.includes(currentWeekDay)) {
				return [{
					...event,
					startTime: new Date(eventStart.getTime() + diff * WEEK_MS + currentWeekDay * DAY_MS).toISOString(),
					endTime: new Date(eventEnd.getTime() + diff * WEEK_MS + currentWeekDay * DAY_MS).toISOString(),
				}];
			}

			return [];
		}

		const events: IEvent[] = [];

		const diff = Math.round((intervalStart.getTime() - originalWeekStart.getTime()) / WEEK_MS);
		const weeksInInterval = Math.round((intervalEnd.getTime() - intervalStart.getTime()) / WEEK_MS);

		for (let n = diff < 0 ? 0 : diff; n < diff + weeksInInterval; n++) {
			if (n % interval === 0) {
				days.forEach((day) => {
					if (n === 0 && new Date(startTime).getDay() -1 > day)
						return;

					events.push({
						...event,
						startTime: new Date(eventStart.getTime() + n * WEEK_MS + day * DAY_MS).toISOString(),
						endTime: new Date(eventEnd.getTime() + n * WEEK_MS + day * DAY_MS).toISOString(),
					});
				});
			}
		}

		return events;
	}

	if (period === 'month') {
		const eventDuration = new Date(endTime).getTime() - new Date(startTime).getTime();
		const date = new Date(startTime).getDate();

		for (let n = intervalStart.getMonth(); n <= intervalEnd.getMonth() + ((intervalEnd.getFullYear() - intervalStart.getFullYear()) * 12); n++) {
			const eventStart = new Date(startTime);
			eventStart.setFullYear(intervalStart.getFullYear());
			eventStart.setMonth(n);

			if (eventStart.getDate() !== date) {
				eventStart.setDate(0);
			}

			const eventEnd = new Date(eventStart.getTime() + eventDuration);

			const diff = fullMonthsBetween(startTime, eventStart);

			if (
				diff >= 0 &&
				diff % interval === 0 &&
				(eventStart.getTime() <= intervalEnd.getTime() && eventStart.getTime() >= intervalStart.getTime() ||
					eventStart.getTime() <= intervalEnd.getTime() && eventStart.getTime() >= intervalStart.getTime())
			) {
				events.push({
					...event,
					startTime: eventStart.toISOString(),
					endTime: eventEnd.toISOString(),
				});
			}
		}

		return events;
	}

	if (period === 'year') {
		const eventStart = new Date(startTime);
		const eventDuration = new Date(endTime).getTime() - eventStart.getTime();

		for (let n = intervalStart.getFullYear(); n <= intervalEnd.getFullYear(); n++) {
			eventStart.setFullYear(n);
			const eventEnd = new Date(eventStart.getTime() + eventDuration);

			const diff = n - new Date(startTime).getFullYear();

			if (
				diff >= 0 &&
				diff % interval === 0 &&
				(eventStart.getTime() <= intervalEnd.getTime() && eventStart.getTime() >= intervalStart.getTime() ||
				eventStart.getTime() <= intervalEnd.getTime() && eventStart.getTime() >= intervalStart.getTime())
			) {
				events.push({
					...event,
					startTime: eventStart.toISOString(),
					endTime: eventEnd.toISOString(),
				});
			}
		}

		return events;
	}
};
