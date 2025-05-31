import React from 'react';
import Calendar, { type OnArgs } from 'react-calendar';
import './calendar.scss';

interface ICalendarProps {
	currentDate: Date;
	// eslint-disable-next-line no-unused-vars
	setCurrentDate: (date: Date) => void;
}

export const MiniCalendar = ({ currentDate, setCurrentDate }: ICalendarProps) => {

	const handleChange = (arg: OnArgs) => {
		const newDate = arg.activeStartDate;
		if (arg.value && 'getDate' in arg.value) {
			newDate?.setDate(arg.value.getDate());
		}
		setCurrentDate(newDate ?? new Date());
	};

	return (
		<Calendar
			value={currentDate}
			activeStartDate={currentDate}
			onActiveStartDateChange={handleChange}
		/>
	);
};
