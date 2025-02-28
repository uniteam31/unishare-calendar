import useSWR from 'swr';
// import axiosInstance from 'shared/api/axiosInstance';
import { IEvent } from '../model/types/event';

export const useGetEvents = () => {
	const fetcher = () => mock;
	// axiosInstance<IEvent[]>({ method: 'GET', url: `${__API_URL__}/events` }).then(
	// 	(res) => res.data,
	// );

	const { data, error, isValidating, mutate } = useSWR('api/events', fetcher);

	const events = data || [];

	return {
		mutateNodes: mutate,
		events,
		error,
		isLoading: isValidating,
	};
};

const mock: IEvent[] = [
	{
		_id: 1,
		title: 'Event 1',
		description: 'Desription! Desription Desription Desription Desription Desription!!!',
		startTime: (new Date()).toISOString(),
		endTime: (new Date(+ new Date() + 1000 * 60 * 60)).toISOString(),
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 2,
		title: 'Event 2',
		description: 'ghfghdhgfk sdkjhfsdkhf gfys',
		startTime: (new Date(+ new Date() + 1000 * 60 * 60 * 3)).toISOString(),
		endTime: (new Date(+ new Date() + 1000 * 60 * 60 * 4)).toISOString(),
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 3,
		title: 'Event 3',
		description: 'dkfjhlkehfjkhefjhwekjfhkwjenbznvbnvxznbcvbnzxiuwyeoiquwpeuppowfjfjlljflksjdlfjslf',
		startTime: (new Date(+ new Date() + 1000 * 60 * 60 * 5)).toISOString(),
		endTime: (new Date(+ new Date() + 1000 * 60 * 60 * 6)).toISOString(),
		createdAt: '',
		updatedAt: '',
	},
];
