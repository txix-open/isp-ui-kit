import type { FieldEventOptions } from '../BaseField/field-behavior.type';
import { SelectProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormSelectProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & FieldEventOptions & SelectProps;
