import { mapEventToFullCalendarEvent } from 'entities/Event';
import { createRecursiveEventForInterval } from '../lib/createRecursiveEventForInterval';
import { ICalendarEvent, IEvent } from '../model/types/event';


interface IProps {
	events: IEvent[];
	interval: {
		start: Date;
		end: Date;
	};
}

export const createRecursiveEvent = (props: IProps) => {
	const { events, interval } = props;
	const { start: intervalStart, end: intervalEnd } = interval;

	let result: ICalendarEvent[] = [];

	events.forEach(event => {
		const recursiveEvents = createRecursiveEventForInterval({ intervalStart, intervalEnd, event });

		if (recursiveEvents) {
			const calendarEvents: ICalendarEvent[] = recursiveEvents.map(recursive => mapEventToFullCalendarEvent({
				...event,
				startTime: recursive.startTime,
				endTime: recursive.endTime,
			}));

			result = [...result, ...calendarEvents];
		}
	});

	return result;
};
