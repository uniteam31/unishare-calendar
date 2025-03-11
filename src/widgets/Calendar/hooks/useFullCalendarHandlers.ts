import { EventChangeArg, DateSelectArg, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import { useCreateUpdateEvent } from 'feature/CreateUpdateEvent/api/useCreateUpdateEvent';
import { IEvent, useEventStore, useGetEvents } from 'entities/Event';

interface IProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
}

export const useFullCalendarHandlers = (props: IProps) => {
	const { currentDate, setCurrentDate } = props;

	const { updateEvent } = useCreateUpdateEvent();
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
