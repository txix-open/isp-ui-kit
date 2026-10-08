import type { TextFieldOptions } from '../BaseField/field-behavior.type';
import type { PasswordProps } from 'antd/es/input/Password';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormInputPasswordProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & TextFieldOptions & PasswordProps;
