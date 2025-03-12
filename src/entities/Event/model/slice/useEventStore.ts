import { create } from 'zustand';
import { IEvent } from '../types/event';

interface IEventStore {
	selectedEvent: IEvent | null;
	setSelectedEvent: (event: IEvent | null) => void;
}

export const useEventStore = create<IEventStore>((set) => ({
	selectedEvent: null,
	setSelectedEvent: (Event) => {
		set((state) => {
			return { ...state, selectedEvent: Event };
		});
	},
}));
