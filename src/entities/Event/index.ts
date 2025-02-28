import { ListItem } from './ui/ListItem/ListItem';

export type { IEvent, TEventFormFields } from './model/types/event';

type TEventComponents = {
	ListItem: typeof ListItem;
};

/** Экспортируем обертку для компонентов, которые связаны логически */
export const Event: TEventComponents = {
	ListItem,
};

export { useEventStore } from './model/slice/useEventStore';

export { useGetEvents } from './api/useGetEvents';
