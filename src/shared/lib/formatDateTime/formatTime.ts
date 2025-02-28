export const formatTime = (time: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	};

	return time.toLocaleString('en-US', options);
};
