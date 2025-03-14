import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type IEvent, mapEventToFullCalendarEvent, createRecursiveEvent } from 'entities/Event';
import { useFullCalendarHandlers } from '../../hooks/useFullCalendarHandlers';
import './calendar.scss';

interface ICalendarProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
	events: IEvent[];
}

export const Calendar = (props: ICalendarProps) => {
	const { currentDate, events } = props;
	const [intervalStart, setIntervalStart] = useState<Date>(new Date());
	const [intervalEnd, setIntervalEnd] = useState<Date>(new Date());
	const {
		handleEventChange,
		handleEventClick,
		handleSelect,
		handleDatesSet
	} = useFullCalendarHandlers({
		...props,
		setIntervalStart,
		setIntervalEnd,
	});
	const calendarRef = useRef<FullCalendar>(null);

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(currentDate);
		}
	}, [currentDate]);

	const calendarEvents = useMemo(() => {
		return events.filter(e => !e.period).map(mapEventToFullCalendarEvent);
	}, [events]);

	const recursiveEvents = useMemo(() => {
		return createRecursiveEvent({ events, intervalStart, intervalEnd });
	}, [events, intervalStart, intervalEnd]);

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin ]}
			initialView={'dayGridMonth'}
			scrollTime="06:00:00"
			themeSystem="yeti"
			headerToolbar={{
				left: 'prev,today,next',
				center: 'title',
				right: 'timeGridWeek dayGridMonth timeGridDay'
			}}
			height="100%"
			nowIndicator={true}
			navLinks={true}
			selectable={true}
			editable={true}
			droppable={true}
			firstDay={1}
			locale={ruLocale}
			events={[...calendarEvents, ...recursiveEvents]}
			eventClick={handleEventClick}
			eventDrop={handleEventChange}
			eventResize={handleEventChange}
			select={handleSelect}
			datesSet={handleDatesSet}
		/>
	);
};