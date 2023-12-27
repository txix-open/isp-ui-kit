import { RadioGroupProps } from 'antd';

import { FieldValues } from 'react-hook-form';
import { FormComponentProps, LabelItem } from '../formTypes';

export type FormRadioGroupProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> &
    RadioGroupProps & {
      type?: 'radio' | 'button';
      items: LabelItem[];
    };
