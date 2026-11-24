import type { FieldEventOptions } from '../BaseField/field-behavior.type';
import { TreeSelectProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormTreeSelectProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & FieldEventOptions & TreeSelectProps & {};
