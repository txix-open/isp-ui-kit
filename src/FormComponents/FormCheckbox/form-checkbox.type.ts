import { CheckboxProps } from 'antd/lib';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormCheckboxGroupProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & CheckboxProps;
