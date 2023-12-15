import { InputProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../types/formTypes';

export type FormInputNumberProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & InputProps;
