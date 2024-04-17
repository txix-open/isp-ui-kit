import { FieldValues } from 'react-hook-form';
import { FormInputProps } from './form-input.type';
import '../form-components.scss';
declare const _default: <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName,
  ...rest
}: FormInputProps<T>) => import('react/jsx-runtime').JSX.Element;
export default _default;
