import type { ICalendarEvent, IEvent } from '../model/types/event';

export const mapEventToFullCalendarEvent = (event: IEvent): ICalendarEvent => ({
	start: event.startTime,
	end: event.endTime,
	title: event.title,
	eventData: event,
	color: event.color,
});
