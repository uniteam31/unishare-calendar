import type { EventChangeArg, DateSelectArg, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { useEventApi } from 'feature/CreateUpdateEvent/api/useEventApi';
import { RefObject, useEffect } from 'react';
import { EMPTY_EVENT, useEventStore } from 'entities/Event';
import { LOCAL_STORAGE } from 'shared/const';

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
	const { setSelectedEvent } = useEventStore();

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(currentDate);
		}
		localStorage.setItem(LOCAL_STORAGE.CALENDAR_CURRENT_DATE, currentDate.toString());
	}, [currentDate]);

	const handleEventChange = (info: EventChangeArg) => {
		const newEvent = {
			startTime: info.event.start?.toISOString(),
			endTime: info.event.end?.toISOString(),
		};

		updateEvent({
			formValues: newEvent,
			_id: info.event.extendedProps.eventData._id,
		}).finally();
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

		localStorage.setItem(LOCAL_STORAGE.CALENDAR_CURRENT_VIEW, type);

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
			...EMPTY_EVENT,
			startTime: info.start.toISOString(),
			endTime: info.end.toISOString(),
		});
	};

	return { handleEventChange, handleEventClick, handleSelect, handleDatesSet };
};
