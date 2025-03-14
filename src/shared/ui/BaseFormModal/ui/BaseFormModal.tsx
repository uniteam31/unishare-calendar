import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import { formatApiErrorMessages } from '../../../lib';
import { Button, Text, TextAlign, Warning } from '../../../ui';
import s from './BaseFormModal.module.scss';

type TMode = 'create' | 'edit';

type Props = {
	className?: string;
	//
	title: string;
	text?: string;
	//
	onSubmit: () => void;
	onReset?: () => void;
	onRemove?: () => void;
	//
	isValid?: boolean;
	isLoading?: boolean;
	errors?: string | null;
	mode?: TMode;
};

export const BaseFormModal = (props: PropsWithChildren<Props>) => {
	const { className, title, text, onSubmit, onReset, onRemove, isValid, errors, isLoading, children, mode } = props;

	const handleReset = () => {
		onReset?.();
	};

	const handleRemove = () => {
		onRemove?.();
	};

	return (
		<form className={classNames(s.UpdateFormModal, className)} onSubmit={onSubmit}>
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
			</div>

			{/** Тело формы */}
			{children}

			<div className={s.buttonsWrapper}>
				<Button className={s.submitButton} disabled={!isValid || isLoading}>
					{!mode ? 'Сохранить' : mode === 'create' ? 'Создать' : 'Обновить'}
				</Button>

				{onReset && (
					<Button
						className={s.resetButton}
						disabled={!isValid || isLoading}
						onClick={handleReset}
					>
						Сбросить
					</Button>
				)}

				{onRemove && (
					<Button
						className={s.removeButton}
						disabled={isLoading}
						onClick={handleRemove}
					>
						Удалить
					</Button>
				)}
			</div>
		</form>
	);
};
