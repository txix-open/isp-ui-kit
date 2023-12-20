import { TreeSelectProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../types/formTypes';

export type FormTreeSelectProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & TreeSelectProps & {};
