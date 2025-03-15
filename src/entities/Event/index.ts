import { ListItem } from './ui/ListItem/ListItem';

export type { IEvent, TEventFormFields } from './model/types/event';

export { EMPTY_EVENT } from './model/emptyEvent';

type TEventComponents = {
	ListItem: typeof ListItem;
};

/** Экспортируем обертку для компонентов, которые связаны логически */
export const Event: TEventComponents = {
	ListItem,
};

export { useEventStore } from './model/slice/useEventStore';

export { useGetEvents } from './api/useGetEvents';

export { mapEventToFullCalendarEvent } from './lib/mapEventToFullCalendarEvent';
export { createRecursiveEvent } from './lib/createRecursiveEvents';
