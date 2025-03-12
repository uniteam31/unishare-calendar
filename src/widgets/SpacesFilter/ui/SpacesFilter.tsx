import React from 'react';
import { CheckboxItem } from 'shared/ui';
import s from './SpacesFilter.module.scss';

interface ISpacesFilterProps {
	selectedSpacesIds: string[];
	// eslint-disable-next-line no-unused-vars
	setSelectedSpacesIds: (spacesIds: string[]) => void;
}

export const SpacesFilter = (props: ISpacesFilterProps) => {
	const { selectedSpacesIds, setSelectedSpacesIds } = props;

	const handleClickAllSpaces = (checked: boolean) => {
		if (checked) {
			setSelectedSpacesIds(spaces.map(s => s._id));
		} else {
			setSelectedSpacesIds([]);
		}
	};

	const handleClickSpaceItem = (spaceId: string, checked: boolean) => {
		if (checked) {
			setSelectedSpacesIds([...selectedSpacesIds, spaceId]);
		} else {
			setSelectedSpacesIds(selectedSpacesIds.filter(s => s !== spaceId));
		}
	};

	return (
		<div className={s.spacesList}>
			<CheckboxItem
				title={'Все пространства'}
				checked={selectedSpacesIds.length === spaces.length}
				onChange={(event) => handleClickAllSpaces(event.target.checked)}
			/>
			{spaces.map((space) => (
				<CheckboxItem
					key={space._id}
					title={space.title}
					checked={selectedSpacesIds.includes(space._id)}
					onChange={(event) => handleClickSpaceItem(space._id, event.target.checked)}
				/>
			))}
		</div>
	);
};

const spaces = [
	{
		_id: '111',
		title: 'space numero 1',
	},
	{
		_id: '222',
		title: 'Vtoroye prostranstvo',
	},
	{
		_id: '333',
		title: 'IU3-82B',
	},
	{
		_id: '111',
		title: 'space numero 1',
	},
	{
		_id: '222',
		title: 'Vtoroye prostranstvo',
	},
	{
		_id: '333',
		title: 'IU3-82B',
	},
	{
		_id: '111',
		title: 'space numero 1',
	},
	{
		_id: '222',
		title: 'Vtoroye prostranstvo',
	},
	{
		_id: '333',
		title: 'IU3-82B',
	},
	{
		_id: '111',
		title: 'space numero 1',
	},
	{
		_id: '222',
		title: 'Vtoroye prostranstvo',
	},
	{
		_id: '333',
		title: 'IU3-82B',
	},
	{
		_id: '111',
		title: 'space numero 1',
	},
	{
		_id: '222',
		title: 'Vtoroye prostranstvo',
	},
	{
		_id: '333',
		title: 'IU3-82B',
	},
];
