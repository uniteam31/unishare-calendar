import { PropsWithChildren, ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface IFormWrapperProps<T extends FieldValues> {
	methods: UseFormReturn<T>;
	children?: ReactNode;
}

export const FormWrapper = <T extends FieldValues>(
	props: PropsWithChildren<IFormWrapperProps<T>>,
) => {
	const { methods, children } = props;

	return <FormProvider {...methods}>{children}</FormProvider>;
};
