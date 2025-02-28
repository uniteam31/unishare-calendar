import { DatesSetArg } from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useRef } from 'react';
import type { IEvent } from 'entities/Event';

interface ICalendarProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (newDate: Date) => void;
	events: IEvent[];
}

export const Calendar = (props: ICalendarProps) => {
	const { currentDate, setCurrentDate, events } = props;
	const calendarRef = useRef<FullCalendar>(null);

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(currentDate);
		}
	}, [currentDate]);

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

	const calendarEvents = events.map((e) => ({
		start: e.startTime,
		end: e.endTime,
		title: e.title,
		allDay: e.allDay,
	}));

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin ]}
			initialView={'dayGridMonth'}
			themeSystem="yeti"
			headerToolbar={{
				left: 'prev,today,next',
				center: 'title',
				right: 'timeGridWeek dayGridMonth timeGridDay'
			}}
			height="100%"
			nowIndicator={true}
			navLinks={true}
			firstDay={1}
			locale={ruLocale}
			events={calendarEvents}
			datesSet={handleDatesSet}
		/>
	);
};