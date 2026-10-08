import type { FieldEventOptions } from '../BaseField/field-behavior.type';
import { CheckboxProps } from 'antd/lib';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';
import type { AriaAttributes } from 'react';

export type FormCheckboxGroupProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> &
    FieldEventOptions &
    AriaAttributes &
    CheckboxProps;
