type DateType = Date | string | number;

export const fullMonthsBetween = (date1: DateType, date2: DateType) => {
	const begin = new Date(date1);
	const end = new Date(date2);

	let months = (end.getFullYear() - begin.getFullYear()) * 12;
	months -= begin.getMonth();
	months += end.getMonth();

	if (end.getDate() < begin.getDate()) {
		months--;
	}

	return months;
};

