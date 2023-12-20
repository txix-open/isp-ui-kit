import { SelectProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../types/formTypes';

export type FormSelectProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & SelectProps;
