import classNames from 'classnames';
import React, { useCallback } from 'react';
import { IEvent, Event, useGetEvents, useEventStore } from 'entities/Event';
import CalendarIcon from 'shared/assets/icons/calendar.svg';
import { Link, Widget } from 'shared/ui';
import { Skeleton } from 'shared/ui';
import s from './CalendarWidget.module.scss';

interface INoteWidgetProps {
	className?: string;
}

export const CalendarWidget = (props: INoteWidgetProps) => {
	const { className } = props;

	const { events, isLoading, error } = useGetEvents();
	const { setSelectedEvent } = useEventStore();

	const handleNoteClick = useCallback(
		(id: IEvent['_id']) => {
			const selectedEvent = events.find((event) => id === event._id);

			if (!selectedEvent) {
				return;
			}

			setSelectedEvent(selectedEvent);
		},
		[events, setSelectedEvent],
	);

	return (
		<div className={classNames(s.CalendarWidget, className)}>
			<Widget Icon={<CalendarIcon className={s.icon} />} title={'Календарь'} to={'/calendar'}>
				<div className={s.eventsList}>
					{isLoading &&
						Array.from({ length: 2 }).map((_, index) => (
							<Skeleton className={s.skeleton} key={index} />
						))}

					{/** В данном виджете можно отобразить только 2 события */}
					{!isLoading &&
						events.slice(0, 2).map((event) => (
							<Link to={'/calendar'} key={event._id}>
								<Event.ListItem
									className={s.event}
									{...event}
									onClick={handleNoteClick}
								/>
							</Link>
						))}
				</div>
			</Widget>
		</div>
	);
};
