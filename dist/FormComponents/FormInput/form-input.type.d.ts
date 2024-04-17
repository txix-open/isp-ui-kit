import { InputProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';
export type FormInputProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & InputProps;
