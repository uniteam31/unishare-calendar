import { useCallback, useState } from 'react';
import type { TEventFormFields, IEvent } from 'entities/Event';
import { axiosInstance } from 'shared/api';
import { getApiResponseErrorMessage } from 'shared/lib';
import type { ApiResponse, TMeta } from 'shared/types';

interface ICreateEventProps {
	formValues: Partial<TEventFormFields>;
}

interface IUpdateEventProps {
	formValues: Partial<TEventFormFields>;
	id: TMeta['id'];
}

interface IDeleteEventProps {
	id: TMeta['id'];
}

type TApiEventResponse = ApiResponse<IEvent>;

export const useEventApi = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>();

	const createEvent = useCallback(async (props: ICreateEventProps) => {
		const { formValues } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.post<TApiEventResponse>('/events', formValues);

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

	const updateEvent = useCallback(async (props: IUpdateEventProps) => {
		const { formValues, id = '' } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.put<TApiEventResponse>(
				`/events/${id}`,
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

	const deleteEvent = useCallback(async (props: IDeleteEventProps) => {
		const { id = '' } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.delete<TApiEventResponse>(`/events/${id}`);

			const deletedEvent = response.data.data;

			return deletedEvent;
		} catch (error) {
			const errorMessage =
				getApiResponseErrorMessage(error) ||
				'Произошла неизвестная ошибка при удалении заметки';

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
		deleteEvent,
	};
};
