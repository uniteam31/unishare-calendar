import { useCallback, useState } from 'react';
import type { TEventFormFields, IEvent } from 'entities/Event';
import { axiosInstance } from 'shared/api';
import { getApiResponseErrorMessage } from 'shared/lib';
import type { ApiResponse } from 'shared/types';

interface ICreateUpdateEventProps {
	formValues: Partial<TEventFormFields>;
}

type TCreateUpdateEventResponse = ApiResponse<IEvent>;

export const useCreateUpdateEvent = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>();

	const createEvent = useCallback(async (props: ICreateUpdateEventProps) => {
		const { formValues } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.post<TCreateUpdateEventResponse>(
				'/calendars/events',
				formValues,
			);

			// TODO возвращать или нет?
			const updatedPersonalData = response.data.data;

			return updatedPersonalData;
		} catch (error) {
			const errorMessage =
				getApiResponseErrorMessage(error) ||
				'Произошла неизвестная ошибка при входе в аккаунт';

			setError(errorMessage);

			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		isLoading,
		error,
		createEvent,
	};
};
