import type { PropsWithChildren } from 'react';
import { formatApiErrorMessages } from '../../../lib';
import { Button, Text, TextAlign, Warning } from '../../../ui';
import s from './BaseFormModal.module.scss';

type TMode = 'create' | 'edit';

type Props = {
	title: string;
	text?: string;
	//
	onSubmit: () => void;
	onReset?: () => void;
	//
	isDirty?: boolean;
	isLoading?: boolean;
	errors?: string | null;
	mode?: TMode;
};

export const BaseFormModal = (props: PropsWithChildren<Props>) => {
	const { title, text, onSubmit, onReset, isDirty, errors, isLoading, children, mode } = props;

	const handleReset = () => {
		onReset?.();
	};

	return (
		<form className={s.UpdateFormModal} onSubmit={onSubmit}>
			<div>
				<Text className={s.title} title={title} text={text} align={TextAlign.CENTER} />

				{!isLoading && errors && (
					<Warning
						className={s.error}
						title={'Ошибка'}
						text={formatApiErrorMessages(errors)}
						theme={'red'}
					/>
				)}

				{/** Тело формы */}
				{children}
			</div>

			<div className={s.buttonsWrapper}>
				<Button className={s.submitButton} disabled={!isDirty || isLoading}>
					{!mode ? 'Сохранить' : mode === 'create' ? 'Создать' : 'Обновить'}
				</Button>

				{onReset && (
					<Button
						className={s.resetButton}
						disabled={!isDirty || isLoading}
						onClick={handleReset}
					>
						Сбросить
					</Button>
				)}
			</div>
		</form>
	);
};
