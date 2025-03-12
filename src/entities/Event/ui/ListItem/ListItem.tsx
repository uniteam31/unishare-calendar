import classNames from 'classnames';
import React, { FC, memo, useCallback } from 'react';
import { formatTime } from 'shared/lib/formatDateTime/formatTime';
import { formatTimeInterval } from 'shared/lib/formatDateTime/formatTimeInterval';
import { IEvent } from '../../model/types/event';
import s from './ListItem.module.scss';

interface IListItemProps extends Partial<IEvent> {
	onClick?: (id: IEvent['_id']) => void;
	//
	className?: string;
}

// TODO добавить автора
export const ListItem: FC<IListItemProps> = memo((props) => {
	const { title, startTime, endTime, className } = props;
	//
	const { _id, onClick } = props;

	const handleClick = useCallback(() => {
		if (!_id) {
			return;
		}

		onClick?.(_id);
	}, [_id, onClick]);

	const timeInterval = startTime?.length ? endTime?.length
		? formatTimeInterval(new Date(startTime), new Date(endTime))
		: formatTime(new Date(startTime))
		: 'Без времени';

	// TODO добавить валидатор длины полей и скрывать под хайд и ...
	return (
		<div className={classNames(s.ListItem, className)} onClick={handleClick}>
			<div className={s.title}>{title?.length ? title : 'Нет названия'}</div>
			<div className={s.time}>
				{timeInterval}
			</div>
		</div>
	);
});
