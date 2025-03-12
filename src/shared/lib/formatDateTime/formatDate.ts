export const formatDate = (date: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	};

	const formattedDate = date.toLocaleString('en-US', options);

	return formattedDate.replace(/\//g, '.');
};
