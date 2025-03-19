import useSWR from 'swr';
import { axiosInstance } from 'shared/api';
import type { ApiResponse } from 'shared/types';
import type { IEvent } from '../model/types/event';

export const useGetEvents = () => {
	const fetcher = () =>
		axiosInstance<ApiResponse<IEvent[]>>({ method: 'GET', url: '/events' }).then(
			(res) => res.data.data,
		);

	const { data, error, isValidating, mutate } = useSWR('api/events', fetcher);

	const events = data || [];

	return {
		mutateEvents: mutate,
		events,
		error,
		isLoading: isValidating,
	};
};
