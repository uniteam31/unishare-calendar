import { useCallback, useState } from 'react';
import { TEventFormFields, IEvent } from 'entities/Event';
import { axiosInstance } from 'shared/api';
import { getApiResponseErrorMessage } from 'shared/lib';
import type { ApiResponse } from 'shared/types';


interface ICreateEventProps {
	formValues: Partial<TEventFormFields>;
	_id?: number;
}

interface IUpdateEventProps {
	formValues: Partial<TEventFormFields>;
	_id?: number;
}

interface IDeleteEventProps {
	_id?: number;
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
			const response = await axiosInstance.post<TApiEventResponse>(
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

	const updateEvent = useCallback(async (props: IUpdateEventProps) => {
		const { formValues, _id = '' } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.put<TApiEventResponse>(
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

	const deleteEvent = useCallback(async (props: IDeleteEventProps) => {
		const { _id = '' } = props;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosInstance.delete<TApiEventResponse>(
				`/calendars/events/${_id}`,
			);

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
