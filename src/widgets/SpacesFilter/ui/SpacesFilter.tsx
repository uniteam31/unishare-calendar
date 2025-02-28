import React from 'react';
import s from './SpacesFilter.module.scss';

export const SpacesFilter = () => {
	return (
		<div className={s.spacesList}>
			<label className={s.spaceItem}>
				<input type="checkbox" />
				Все пространства
			</label>
			<label className={s.spaceItem}>
				<input type="checkbox" checked={true} />
				Мое пространство
			</label>
		</div>
	);
};
