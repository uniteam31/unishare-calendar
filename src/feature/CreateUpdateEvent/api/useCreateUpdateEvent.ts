import { useCallback, useState } from 'react';
import { TEventFormFields, IEvent } from 'entities/Event';
import { axiosInstance } from 'shared/api';
import { getApiResponseErrorMessage } from 'shared/lib';
import type { ApiResponse } from 'shared/types';

interface ICreateUpdateEventProps {
	formValues: Partial<TEventFormFields>;
	_id?: number;
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

			const createdEvent = response.data.data;

			return createdEvent;
		} catch (error) {
			const errorMessage =
				getApiResponseErrorMessage(error) ||
				'Произошла неизвестная ошибка при создании события';

			setError(errorMessage);

			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateEvent = useCallback(async (props: ICreateUpdateEventProps) => {
		const { formValues, _id = '' } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.put<TCreateUpdateEventResponse>(
				`/calendars/events/${_id}`,
				formValues,
			);

			const updatedEvent = response.data.data;

			return updatedEvent;
		} catch (error) {
			const errorMessage =
				getApiResponseErrorMessage(error) ||
				'Произошла неизвестная ошибка при редактировании заметки';

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
		updateEvent,
	};
};
