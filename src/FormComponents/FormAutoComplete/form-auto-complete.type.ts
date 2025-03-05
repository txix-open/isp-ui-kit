import { AutoCompleteProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormAutoCompleteProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & AutoCompleteProps;
