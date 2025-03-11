import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useRef } from 'react';
import { type IEvent, mapEventToFullCalendarEvent } from 'entities/Event';
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
	const {
		handleEventChange,
		handleEventClick,
		handleSelect,
		handleDatesSet
	} = useFullCalendarHandlers(props);
	const calendarRef = useRef<FullCalendar>(null);

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(currentDate);
		}
	}, [currentDate]);

	const calendarEvents = events.map(mapEventToFullCalendarEvent);

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin ]}
			initialView={'dayGridMonth'}
			scrollTime="09:00:00"
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
			events={calendarEvents}
			eventClick={handleEventClick}
			eventDrop={handleEventChange}
			eventResize={handleEventChange}
			select={handleSelect}
			datesSet={handleDatesSet}
		/>
	);
};