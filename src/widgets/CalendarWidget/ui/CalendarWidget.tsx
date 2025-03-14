import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { type IEvent, Event, useGetEvents, useEventStore } from 'entities/Event';
import CalendarIcon from 'shared/assets/icons/calendar.svg';
import { isSameDate } from 'shared/lib';
import { Link, Warning, Widget } from 'shared/ui';
import { Skeleton } from 'shared/ui';
import s from './CalendarWidget.module.scss';

const TODAY = new Date();

interface INoteWidgetProps {
	className?: string;
}

export const CalendarWidget = (props: INoteWidgetProps) => {
	const { className } = props;

	const { events, isLoading } = useGetEvents();
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

	const todayEvents = useMemo(() => {
		const now = new Date();
		return events.filter(event =>
			isSameDate(event.startTime, now) && new Date(event.startTime).getTime() > now.getTime()
		);
	}, [events]);

	return (
		<div className={classNames(s.CalendarWidget, className)}>
			<Widget Icon={<CalendarIcon className={s.icon} />} title={'Календарь'} to={'/calendar'}>
				<div className={s.eventsList}>
					{isLoading &&
						Array.from({ length: 2 }).map((_, index) => (
							<Skeleton className={s.skeleton} key={index} />
						))}

					{!isLoading &&
						todayEvents.slice(0, 2).map((event) => (
							<Link to={'/calendar'} key={event._id}>
								<Event.ListItem
									className={s.event}
									{...event}
									onClick={handleNoteClick}
								/>
							</Link>
						))}

					{!isLoading &&
						!todayEvents.length && (
							<Warning
								title={'На сегодня событий больше нет'}
								theme={'blue'}
							/>
						)}
				</div>
			</Widget>
		</div>
	);
};
