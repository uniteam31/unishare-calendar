import type { EventChangeArg, DateSelectArg, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { useEventApi } from 'feature/CreateUpdateEvent/api/useEventApi';
import { RefObject, useEffect } from 'react';
import { useEventStore, useGetEvents } from 'entities/Event';
import type { IEvent } from 'entities/Event';

type TInterval = {
	start: Date;
	end: Date;
}

interface IProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
	// eslint-disable-next-line no-unused-vars
	interval: TInterval;
	setInterval: (arg: TInterval) => void;
	calendarRef: RefObject<FullCalendar>;
}

export const useFullCalendarHandlers = (props: IProps) => {
	const { currentDate, setCurrentDate, interval, setInterval, calendarRef } = props;

	const { updateEvent } = useEventApi();
	const { events, mutateEvents } = useGetEvents();
	const { setSelectedEvent } = useEventStore();

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(currentDate);
		}
	}, [calendarRef, currentDate]);

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
		const { activeStart, activeEnd, currentStart, type } = arg.view;

		if (activeStart.getTime() === interval.start.getTime() ||
			activeEnd.getTime() === interval.end.getTime()) {
			return;
		}
		setInterval({
			start: activeStart,
			end: activeEnd,
		});

		const newDate = currentStart;
		switch (type) {
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
		setCurrentDate(info.start);

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
