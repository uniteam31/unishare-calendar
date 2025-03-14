import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useMemo, useRef, useState } from 'react';
import { type IEvent, mapEventToFullCalendarEvent, createRecursiveEvent } from 'entities/Event';
import { useFullCalendarHandlers } from '../../hooks/useFullCalendarHandlers';
import './calendar.scss';


type TInterval = {
	start: Date;
	end: Date;
}

interface ICalendarProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
	events: IEvent[];
}

export const Calendar = (props: ICalendarProps) => {
	const { events } = props;

	const calendarRef = useRef<FullCalendar>(null);
	const [interval, setInterval] = useState<TInterval>({
		start: new Date(),
		end: new Date(),
	});

	const {
		handleEventChange,
		handleEventClick,
		handleSelect,
		handleDatesSet
	} = useFullCalendarHandlers({ ...props, interval, setInterval, calendarRef });

	const calendarEvents = useMemo(() => {
		return events.filter(e => !e.period).map(mapEventToFullCalendarEvent);
	}, [events]);

	const recursiveEvents = useMemo(() => {
		return createRecursiveEvent({ events, interval });
	}, [events, interval]);

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