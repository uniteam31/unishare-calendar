import React from 'react';

export const formatApiErrorMessages = (error: string | string[]) => {
	if (Array.isArray(error)) {
		const formattedArray = error.map((error, index) => (
			<React.Fragment key={index}>
				{index + 1}. {error}
				<br />
			</React.Fragment>
		));

		return formattedArray;
	}

	return error;
};
