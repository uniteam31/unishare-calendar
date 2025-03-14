import type { TMeta } from 'shared/types';

type TimeString = string;

type TPeriod = 'day' | 'week' | 'month' | 'year';

/** Экземпляр обычного события в календаре */
interface EventBase {
	title: string;
	description?: string;
	startTime: TimeString;
	endTime: TimeString;
	allDay?: boolean;
}

/** Экземпляр повторяющегося события */
interface EventRecursive {
	interval?: number | null;
	period?: TPeriod | null;
	days?: number[];
}

/** Экземпляр данных для формы события */
export interface TEventFormFields extends EventBase, EventRecursive {}

/** Целый экземпляр */
export interface IEvent extends TEventFormFields, TMeta {}

/** Тип для события FullCalendar */
export interface ICalendarEvent {
	start: TimeString;
	end: TimeString;
	title: string;
	allDay?: boolean;
	eventData: IEvent;
}
