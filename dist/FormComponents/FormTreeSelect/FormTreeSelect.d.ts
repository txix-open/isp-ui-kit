import { FieldValues } from 'react-hook-form';
import { FormTreeSelectProps } from './form-tree-select.type';
import '../form-components.scss';
declare const _default: <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormTreeSelectProps<T>) => import('react/jsx-runtime').JSX.Element;
export default _default;
