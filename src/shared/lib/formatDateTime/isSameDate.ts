type DateType = Date | string | number;

export const isSameDate = (date1: DateType, date2: DateType): boolean => {
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	d1.setHours(0, 0, 0, 0);
	d2.setHours(0, 0, 0, 0);

	return d1.getTime() === d2.getTime();
};
