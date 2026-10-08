import type { FieldEventOptions } from '../BaseField/field-behavior.type';
import { RangePickerProps } from 'antd/es/date-picker';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormRangeDatePickerProps<T extends FieldValues> =
  FormComponentProps<T> &
    FieldEventOptions &
    RangePickerProps & {
      saveDateFormat?: string;
    };
