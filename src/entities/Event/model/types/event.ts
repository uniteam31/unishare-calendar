import type { TMeta } from 'shared/types';

type TimeString = string;

/** Экземпляр обычного события в календаре */
interface EventBase {
	title: string;
	description?: string;
	startTime: TimeString;
	endTime?: TimeString;
	allDay?: boolean;
}

/** Экземпляр повторяющегося события */
// interface EventRecur {
// 	startRecur?: TimeString;
// 	endRecur?: TimeString;
// 	daysOfWeek?: number[];
// }

/** Экземпляр данных для формы события */
export interface TEventFormFields extends EventBase {}

/** Целый экземпляр */
export interface IEvent extends TEventFormFields, TMeta {}
