import type { FieldEventOptions } from '../BaseField/field-behavior.type';
import { SwitchProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';
import type { AriaAttributes, FocusEventHandler } from 'react';

export type FormSwitchProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> &
    FieldEventOptions &
    AriaAttributes &
    SwitchProps & {
      onBlur?: FocusEventHandler<HTMLButtonElement>;
    };
