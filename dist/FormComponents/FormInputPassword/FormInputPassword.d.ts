import { FieldValues } from 'react-hook-form';
import { FormInputPasswordProps } from './form-input-password.type';
import '../form-components.scss';
declare const _default: <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  ...rest
}: FormInputPasswordProps<T>) => import('react/jsx-runtime').JSX.Element;
export default _default;
