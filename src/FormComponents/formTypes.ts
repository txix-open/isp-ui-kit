import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { FormItemProps } from 'antd/es/form/FormItem';

export interface FormComponentProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  rules?: Omit<RegisterOptions<TFormValues>, 'required'> & {
    required?: { value: boolean; message: string };
  };
  controlClassName?: string;
  label?: string;
  formItemProps?: FormItemProps;
}

export type LabelItem = {
  value: any;
  label: any;
};
