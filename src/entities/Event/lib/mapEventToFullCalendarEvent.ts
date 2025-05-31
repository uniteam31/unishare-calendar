import type { ICalendarEvent, IEvent } from '../model/types/event';

const DEFAULT_EVENT_TITLE = 'Новое событие';

export const mapEventToFullCalendarEvent = (event: IEvent): ICalendarEvent => ({
	start: event.startTime,
	end: event.endTime,
	title: event.title || DEFAULT_EVENT_TITLE,
	eventData: event,
	color: event.color,
});
