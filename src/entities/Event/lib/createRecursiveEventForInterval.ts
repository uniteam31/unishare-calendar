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

	if (period === 'day' || period === 'week' && (!days || !days?.length)) {
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

	if (period === 'week') {
		// TBD
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
