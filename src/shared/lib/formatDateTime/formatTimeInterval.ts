export const formatTimeInterval = (startTime: Date, endTime: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	};

	const formattedStart = startTime.toLocaleString('en-US', options);
	const formattedEnd = endTime.toLocaleString('en-US', options);

	return `${formattedStart} - ${formattedEnd}`;
};
