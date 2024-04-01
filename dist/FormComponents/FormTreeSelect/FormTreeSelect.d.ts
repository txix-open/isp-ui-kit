import { FieldValues } from 'react-hook-form';
import './from-tree-select.scss';
import { FormTreeSelectProps } from './form-tree-select.type';
declare const _default: <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormTreeSelectProps<T>) => import('react/jsx-runtime').JSX.Element;
export default _default;
