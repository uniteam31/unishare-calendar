import { createRecursiveEventForInterval } from '../lib/createRecursiveEventForInterval';
import { ICalendarEvent, IEvent } from '../model/types/event';


interface IProps {
	events: IEvent[];
	intervalStart: Date;
	intervalEnd: Date;
}

export const createRecursiveEvent = (props: IProps) => {
	const { events, intervalStart, intervalEnd } = props;

	let result: ICalendarEvent[] = [];

	events.forEach(event => {
		const recursiveEvents = createRecursiveEventForInterval({ intervalStart, intervalEnd, event });

		if (recursiveEvents) {
			const calendarEvents: ICalendarEvent[] = recursiveEvents.map(recursive => ({
				start: recursive.startTime,
				end: recursive.endTime,
				title: event.title,
				allDay: event.allDay,
				eventData: event,
			}));

			result = [...result, ...calendarEvents];
		}
	});

	return result;
};
