import { SwitchProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormSwitchProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & SwitchProps;
