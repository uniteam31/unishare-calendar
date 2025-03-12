import { IEvent } from '../model/types/event';

export const mapEventToFullCalendarEvent = (event: IEvent) => ({
	start: event.startTime,
	end: event.endTime,
	title: event.title,
	allDay: event.allDay,
	eventData: event,
});
