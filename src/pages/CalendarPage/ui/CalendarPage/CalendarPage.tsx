import { EventModal } from 'feature/CreateUpdateEvent';
import React, { useEffect, useState } from 'react';
import { MiniCalendar, FullCalendar } from 'widgets/Calendar';
import { SpacesFilter } from 'widgets/SpacesFilter';
import { useEventStore, useGetEvents } from 'entities/Event';
import { Button } from 'shared/ui';
import { Divider } from 'shared/ui';
import s from './CalendarPage.module.scss';

const CalendarPage = () => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const { events } = useGetEvents();
	const { selectedEvent, setSelectedEvent } = useEventStore();

	useEffect(() => {
		if (selectedEvent)
			setIsEventModalOpen(true);
	}, [selectedEvent]);

	const handleClickNewEvent = () => {
		setIsEventModalOpen(true);
		setSelectedEvent(null);
	};

	const handleCloseModal = () => {
		setIsEventModalOpen(false);
		setSelectedEvent(null);
	};

	return (
		<div className={s.CalendarPage}>
			<div className={s.menu}>
				<Button className={s.createButton} onClick={handleClickNewEvent}>
					Новое событие
				</Button>

				<MiniCalendar
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
				/>

				<div>
					Пространства
				</div>

				<SpacesFilter />

			</div>

			<Divider/>

			<div className={s.calendar}>
				<FullCalendar
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
					events={events}
				/>
			</div>

			{isEventModalOpen && (
				<EventModal isOpen={isEventModalOpen} onClose={handleCloseModal} />
			)}
		</div>
	);
};

export default CalendarPage;
