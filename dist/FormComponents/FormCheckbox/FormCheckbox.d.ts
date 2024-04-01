import { FieldValues } from 'react-hook-form';
import { FormCheckboxGroupProps } from './form-checkbox.type';
export default function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormCheckboxGroupProps<T>): import('react/jsx-runtime').JSX.Element;
