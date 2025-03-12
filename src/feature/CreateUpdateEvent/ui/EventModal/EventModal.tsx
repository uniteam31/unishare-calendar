import React from 'react';
import { useForm } from 'react-hook-form';
import type { TEventFormFields } from 'entities/Event';
import { FormWrapper } from 'shared/lib';
import { ModalUI } from 'shared/ui';
import { EventForm } from '../EventForm/EventForm';

interface IModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const EventModal = (props: IModalProps) => {
	const { isOpen, onClose } = props;

	const methods = useForm<TEventFormFields>();

	return (
		<ModalUI isOpen={isOpen} onClose={onClose}>
			<FormWrapper methods={methods}>
				<EventForm onClose={onClose} />
			</FormWrapper>
		</ModalUI>
	);
};
