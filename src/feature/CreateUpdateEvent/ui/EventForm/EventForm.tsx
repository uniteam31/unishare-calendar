import { DatePicker, Select, InputNumber, Button } from 'antd';
import locale from 'antd/lib/date-picker/locale/ru_RU';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useEventStore, useGetEvents } from 'entities/Event';
import type { IEvent, TEventFormFields } from 'entities/Event';
import { TextArea } from 'shared/ui';
import { Input, CheckboxItem, BaseFormModal } from 'shared/ui';
import { useEventApi } from '../../api/useEventApi';
import s from './EventForm.module.scss';

const { Option } = Select;

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const EVENT_COLORS = [
	'#219bfb',
	'#ed4949',
	'#f1a329',
	'#71ca36',
	'#8850e4',
];

interface IProps {
	onClose?: () => void;
}

export const EventForm = ({ onClose }: IProps) => {
	const {
		control,
		handleSubmit: handleSubmitContext,
		formState: { isDirty, isValid },
		getValues,
	} = useFormContext<TEventFormFields>();

	const {
		createEvent,
		updateEvent,
		deleteEvent,
		isLoading: isEventFormLoading,
		error: eventFormErrors,
	} = useEventApi();
	const { selectedEvent } = useEventStore();
	const { events, mutateEvents } = useGetEvents();

	const [isRecursiveEvent, setIsRecursiveEvent] = useState(Boolean(selectedEvent?.period));

	// Form fields

	const {
		field: { value: title, onChange: onChangeTitle },
	} = useController({ control, name: 'title', defaultValue: selectedEvent?.title });

	const {
		field: { value: startTime, onChange: onChangeStartTime },
	} = useController({ control, name: 'startTime', defaultValue: selectedEvent?.startTime, rules: { required: true } });

	const {
		field: { value: endTime, onChange: onChangeEndTime },
	} = useController({ control, name: 'endTime', defaultValue: selectedEvent?.endTime, rules: { required: true } });

	const {
		field: { value: interval, onChange: onChangeInterval },
	} = useController({ control, name: 'interval', defaultValue: selectedEvent?.interval ?? 1 });

	const {
		field: { value: period, onChange: onChangePeriod },
	} = useController({ control, name: 'period', defaultValue: selectedEvent?.period ?? 'day' });

	const {
		field: { value: days, onChange: onChangeDays },
	} = useController({ control, name: 'days', defaultValue: selectedEvent?.days ?? [] });

	const {
		field: { value: description, onChange: onChangeDescription },
	} = useController({ control, name: 'description', defaultValue: selectedEvent?.description });

	const {
		field: { value: color, onChange: onChangeColor },
	} = useController({ control, name: 'color', defaultValue: selectedEvent?.color ?? EVENT_COLORS[0] });

	useEffect(() => {
		if (!isRecursiveEvent || period !== 'week')
			return;

		const newDay = (new Date(startTime).getDay() + 6) % 7;
		onChangeDays([...days?.filter(day => day !== newDay) ?? [], newDay]);
	}, [startTime]);

	// Form Handlers

	const handleDayClick = (dayNumber: number) => {
		if (!days) return;

		if (days.includes(dayNumber)) {
			onChangeDays(days.filter((day) => day !== dayNumber));
		} else {
			onChangeDays([...days, dayNumber]);
		}
	};

	const updateCachedEvents = (newEvent: IEvent) => {
		const updatedEvents = events.filter((e) => e._id !== newEvent?._id );
		updatedEvents.push(newEvent);

		mutateEvents(updatedEvents).finally();
	};

	const handleSubmit = () => {
		const formValues = getValues();

		// Если флаг повторения не проставлен, то удаляем из значений данные о повторении
		if (!isRecursiveEvent) {
			formValues.interval = null;
			formValues.period = null;
			formValues.days = [];
		} else if (period !== 'week')  {
			formValues.days = [];
		}

		if (selectedEvent?._id) {
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

	const handleRemove = () => {
		if (selectedEvent?._id) {
			deleteEvent({ _id: selectedEvent._id }).then((result) =>  {
				onClose?.();
				updateCachedEvents(result);
			});
		}
	};

	return (
		<BaseFormModal
			className={s.wrapper}
			//
			title={selectedEvent?._id ? 'Изменить событие' : 'Новое событие'}
			//
			isLoading={isEventFormLoading}
			errors={eventFormErrors}
			isValid={isValid && isDirty}
			//
			onSubmit={handleSubmitContext(handleSubmit)}
			onRemove={selectedEvent?._id ? handleRemove : undefined}
		>
			<Input className={s.input} label="Заголовок" value={title} onChange={onChangeTitle} />

			<DatePicker
				className={s.input}
				locale={locale}
				placeholder="Время начала"
				showTime={{ format: 'HH:mm' }}
				format="DD.MM.YYYY HH:mm"
				onChange={onChangeStartTime}
				onOk={onChangeStartTime}
				value={startTime && dayjs(startTime)}
			/>

			<DatePicker
				className={s.input}
				locale={locale}
				placeholder="Время конца"
				showTime={{ format: 'HH:mm' }}
				format="DD.MM.YYYY HH:mm"
				onChange={onChangeEndTime}
				onOk={onChangeEndTime}
				value={endTime && dayjs(endTime)}
				minDate={startTime ? dayjs(startTime) : undefined}
			/>

			<CheckboxItem
				className={s.checkbox}
				title="Повторяющееся событие"
				checked={isRecursiveEvent}
				onChange={(checked) => {
					setIsRecursiveEvent(checked);
					onChangeDays(days);
				}}
			/>

			{isRecursiveEvent && (
				<div>
					Повторять { period === 'week' ? 'каждую' : 'каждый'}

					<InputNumber
						className={s.numberInput}
						value={interval}
						onChange={(num) => onChangeInterval(Math.floor(num ?? 1))}
						min={1} max={400}
					/>

					<Select
						className={s.periodSelect}
						defaultValue={period}
						onChange={onChangePeriod}
					>
						<Option value="day"> День </Option>
						<Option value="week"> Неделю </Option>
						<Option value="month"> Месяц </Option>
						<Option value="year"> Год </Option>
					</Select>
				</div>
			)}

			{isRecursiveEvent && period === 'week' && (
				<div className={s.buttonContainer}>
					{DAYS_OF_WEEK.map((day, number) => (
						<Button
							key={number}
							className={s.dayButton}
							onClick={() => handleDayClick(number)}
							type={days?.includes(number) ? 'primary' : 'default'}
						>
							{day}
						</Button>
					))}
				</div>
			)}

			<TextArea
				className={s.input}
				label="Описание"
				value={description}
				onChange={onChangeDescription}
			/>

			Цвет события

			<div className={s.buttonContainer}>
				{EVENT_COLORS.map((buttonColor) => (
					<Button
						key={buttonColor}
						className={s.colorButton}
						style={{
							backgroundColor: buttonColor,
							opacity: buttonColor === color ? 1 : 0.4,
						}}
						type="primary"
						onClick={() => onChangeColor(buttonColor)}
					>
						{ buttonColor === color && '✓' }
					</Button>
				))}
			</div>

		</BaseFormModal>
	);
};
