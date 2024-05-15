import { FieldValues } from 'react-hook-form';
import { TextAreaProps } from 'antd/lib/input';
import { FormComponentProps } from '../formTypes';
export type FormTextAreaProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & TextAreaProps;
