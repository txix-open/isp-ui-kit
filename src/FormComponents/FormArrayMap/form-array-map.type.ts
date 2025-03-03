import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';

export type FormArrayMapProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues>;
