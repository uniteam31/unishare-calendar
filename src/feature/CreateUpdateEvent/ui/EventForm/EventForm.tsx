import { TextArea } from '@uniteam31/uni-shared-ui';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useController, useFormContext } from 'react-hook-form';
import { IEvent, useEventStore, useGetEvents } from 'entities/Event';
import type { TEventFormFields } from 'entities/Event';
import { Input, BaseFormModal } from 'shared/ui';
import { useEventApi } from '../../api/useEventApi';
import s from './EventForm.module.scss';

interface IProps {
	onClose?: () => void;
}

export const EventForm = ({ onClose }: IProps) => {
	const {
		control,
		handleSubmit: handleSubmitContext,
		formState: { isDirty },
		getValues,
	} = useFormContext<TEventFormFields>();

	const {
		createEvent,
		updateEvent,
		isLoading: isEventFormLoading,
		error: eventFormErrors,
	} = useEventApi();
	const { selectedEvent } = useEventStore();
	const { events, mutateEvents } = useGetEvents();

	const {
		field: { value: title, onChange: onChangeTitle },
	} = useController({ control, name: 'title', defaultValue: selectedEvent?.title });

	const {
		field: { value: startTime, onChange: onChangeStartTime },
	} = useController({ control, name: 'startTime', defaultValue: selectedEvent?.startTime });

	const {
		field: { value: endTime, onChange: onChangeEndTime },
	} = useController({ control, name: 'endTime', defaultValue: selectedEvent?.endTime });

	const {
		field: { value: description, onChange: onChangeDescription },
	} = useController({ control, name: 'description', defaultValue: selectedEvent?.description });

	const updateCachedEvents = (newEvent: IEvent) => {
		const updatedEvents = events.filter((e) => e._id !== newEvent?._id );
		updatedEvents.push(newEvent);

		mutateEvents(updatedEvents).finally();
	};

	const handleSubmit = () => {
		const formValues = getValues();

		if (selectedEvent) {
			updateEvent({ formValues, _id: selectedEvent._id }).then((result) =>  {
				onClose?.();
				updateCachedEvents(result);
			});
		} else {
			createEvent({ formValues }).then((result) =>  {
				onClose?.();
				updateCachedEvents(result);
			});
		}
	};

	return (
		<BaseFormModal
			title={selectedEvent ? 'Изменить событие' : 'Новое событие'}
			//
			isLoading={isEventFormLoading}
			errors={eventFormErrors}
			isDirty={isDirty}
			//
			onSubmit={handleSubmitContext(handleSubmit)}
		>
			<Input
				className={s.input}
				label={'Заголовок'}
				value={title}
				onChange={onChangeTitle}
			/>

			<DatePicker
				className={s.input}
				placeholder={'Время начала'}
				showTime={{ format: 'HH:mm' }}
				format="DD.MM.YYYY HH:mm"
				onChange={onChangeStartTime}
				onOk={onChangeStartTime}
				value={startTime && dayjs(startTime)}
			/>

			<DatePicker
				className={s.input}
				placeholder={'Время конца'}
				showTime={{ format: 'HH:mm' }}
				format="DD.MM.YYYY HH:mm"
				onChange={onChangeEndTime}
				onOk={onChangeEndTime}
				value={endTime && dayjs(endTime)}
			/>

			<TextArea
				className={s.input}
				label={'Описание'}
				value={description}
				onChange={onChangeDescription}
			/>
		</BaseFormModal>
	);
};
