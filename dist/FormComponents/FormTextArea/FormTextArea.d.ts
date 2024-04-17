import { FieldValues } from 'react-hook-form';
import { FormTextAreaProps } from './form-text-area.type';
import '../form-components.scss';
declare const _default: <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName,
  ...rest
}: FormTextAreaProps<T>) => import('react/jsx-runtime').JSX.Element;
export default _default;
