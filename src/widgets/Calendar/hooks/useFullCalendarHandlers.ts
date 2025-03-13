import type { EventChangeArg, DateSelectArg, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import { useEventApi } from 'feature/CreateUpdateEvent/api/useEventApi';
import { useEventStore, useGetEvents } from 'entities/Event';
import type { IEvent } from 'entities/Event';

interface IProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
	// eslint-disable-next-line no-unused-vars
	setIntervalStart: (interval: Date) => void;
	// eslint-disable-next-line no-unused-vars
	setIntervalEnd: (interval: Date) => void;
}

export const useFullCalendarHandlers = (props: IProps) => {
	const { currentDate, setCurrentDate, setIntervalStart, setIntervalEnd } = props;

	const { updateEvent } = useEventApi();
	const { events, mutateEvents } = useGetEvents();
	const { setSelectedEvent } = useEventStore();

	const updateCachedEvents = (newEvent: IEvent) => {
		const updatedEvents = events.filter((e) => e._id !== newEvent?._id );
		updatedEvents.push(newEvent);

		mutateEvents(updatedEvents).finally();
	};

	const handleEventChange = (info: EventChangeArg) => {
		const newEvent = {
			...info.event.extendedProps.eventData,
			startTime: info.event.start,
			endTime: info.event.end,
		};

		updateEvent({
			formValues: newEvent,
			_id: info.event.extendedProps.eventData._id,
		}).finally();

		updateCachedEvents(newEvent);
	};

	const handleDatesSet = (arg: DatesSetArg) => {
		setIntervalStart(arg.view.activeStart);
		setIntervalEnd(arg.view.activeEnd);

		const newDate = arg.view.currentStart;
		switch (arg.view.type) {
			case 'dayGridMonth':
				newDate.setDate(currentDate.getDate());
				break;
			case 'timeGridWeek':
				newDate.setDate(newDate.getDate() + (currentDate.getDay() + 6) % 7);
				break;
			default:
		}
		if (newDate.getTime() === currentDate.getTime())
			return;
		setCurrentDate(newDate);
	};

	const handleEventClick = (info: EventClickArg) => {
		setSelectedEvent(info.event.extendedProps.eventData);
	};

	const handleSelect = (info: DateSelectArg) => {
		setSelectedEvent({
			_id: 0,
			title: '',
			startTime: info.start.toISOString(),
			endTime: info.end.toISOString(),
			createdAt: '',
			updatedAt: '',
		});
	};

	return { handleEventChange, handleEventClick, handleSelect, handleDatesSet };
};
