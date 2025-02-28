import React, { useState } from 'react';
import { MiniCalendar, FullCalendar } from 'widgets/Calendar';
import { SpacesFilter } from 'widgets/SpacesFilter';
import { useGetEvents } from 'entities/Event';
import { Button } from 'shared/ui';
import { Divider } from 'shared/ui';
import s from './CalendarPage.module.scss';

const CalendarPage = () => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const { events } = useGetEvents();

	return (
		<div className={s.CalendarPage}>
			<div className={s.menu}>
				<Button className={s.createButton}>
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
		</div>
	);
};

export default CalendarPage;
