import React, { ChangeEvent } from 'react';
import s from './CheckboxItem.module.scss';

interface ICheckboxItemProps {
	title: string;
	checked?: boolean;
	// eslint-disable-next-line no-unused-vars
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxItem = (props: ICheckboxItemProps) => {
	const { title, checked, onChange } = props;

	return (
		<label className={s.spaceItem} >
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			{title}
		</label>
	);
};
