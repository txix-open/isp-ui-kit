import { DatePickerProps } from 'antd';
import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormDatePickerProps<T extends FieldValues> = FormComponentProps<T> &
  DatePickerProps & {
    saveDateFormat?: string;
  };
