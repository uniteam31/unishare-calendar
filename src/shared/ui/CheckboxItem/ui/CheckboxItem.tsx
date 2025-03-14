import classNames from 'classnames';
import React from 'react';
import s from './CheckboxItem.module.scss';

interface ICheckboxItemProps {
	className?: string;
	title: string;
	checked?: boolean;
	// eslint-disable-next-line no-unused-vars
	onChange?: (checked: boolean) => void;
}

export const CheckboxItem = (props: ICheckboxItemProps) => {
	const { className, title, checked, onChange } = props;

	return (
		<label className={classNames(s.spaceItem, className)} >
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange?.(event.target.checked)}
			/>
			{title}
		</label>
	);
};
