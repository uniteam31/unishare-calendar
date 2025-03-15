// import { useEventApi } from 'feature/CreateUpdateEvent/api/useEventApi';
// import { type IEvent, useEventStore, useGetEvents } from 'entities/Event';
//
// const DEFAULT_EVENT_TITLE = 'Новое событие';
//
// interface IProps {
// 	onClose?: () => void;
// 	days: number[] | null;
// 	// eslint-disable-next-line no-unused-vars
// 	onChangeDays: (days: number[] | null) => void;
// }
//
// export const useEventFormHandlers = (props: IProps) => {
// 	const { onClose, onChangeDays, days } = props;
//
// 	const {
// 		createEvent,
// 		updateEvent,
// 		deleteEvent,
// 	} = useEventApi();
// 	const { selectedEvent } = useEventStore();
// 	const { events, mutateEvents } = useGetEvents();
//
// 	const handleDayClick = (dayNumber: number) => {
// 		if (!days) return;
//
// 		if (days.includes(dayNumber)) {
// 			onChangeDays(days.filter((day) => day !== dayNumber));
// 		} else {
// 			onChangeDays([...days, dayNumber]);
// 		}
// 	};
//
// 	const updateCachedEvents = (newEvent: IEvent) => {
// 		const updatedEvents = events.filter((e) => e._id !== newEvent?._id );
// 		updatedEvents.push(newEvent);
//
// 		mutateEvents(updatedEvents).finally();
// 	};
//
// 	const handleSubmit = () => {
// 		const formValues = getValues();
//
// 		// Если флаг повторения не проставлен, то удаляем из значений данные о повторении
// 		if (!isRecursiveEvent) {
// 			formValues.interval = null;
// 			formValues.period = null;
// 			formValues.days = [];
// 		} else if (period !== 'week')  {
// 			formValues.days = [];
// 		}
//
// 		// Если названия нет, пишем название по умолчанию
// 		if (!formValues.title) {
// 			formValues.title = DEFAULT_EVENT_TITLE;
// 		}
//
// 		if (selectedEvent?._id) {
// 			updateEvent({ formValues, _id: selectedEvent._id }).then((result) =>  {
// 				onClose?.();
// 				updateCachedEvents(result);
// 			});
// 		} else {
// 			createEvent({ formValues }).then((result) =>  {
// 				onClose?.();
// 				updateCachedEvents(result);
// 			});
// 		}
// 	};
//
// 	const handleRemove = () => {
// 		if (selectedEvent?._id) {
// 			deleteEvent({ _id: selectedEvent._id }).then((result) =>  {
// 				onClose?.();
// 				updateCachedEvents(result);
// 			});
// 		}
// 	};
//
// };
