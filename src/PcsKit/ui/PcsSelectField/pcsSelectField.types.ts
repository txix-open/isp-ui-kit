import type { ReactNode } from 'react';

import type { PcsFieldSize } from '../../types/pcsField.types';

export type PcsSelectFieldValue = number | string;
export type PcsSelectFieldChangeValue =
  | PcsSelectFieldValue
  | PcsSelectFieldValue[]
  | null;

export interface PcsSelectOption {
  id: PcsSelectFieldValue;
  title: string;
  description?: string;
  disabled?: boolean;
  active?: boolean;
  [key: string]: unknown;
}

export interface PcsSelectFieldFilterOption {
  value: string;
  label: string;
  disabled?: boolean;
  active?: boolean;
  description?: string;
  [key: string]: unknown;
}

export type PcsSelectFieldOption = PcsSelectOption | PcsSelectFieldFilterOption;

export interface PcsSelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: PcsSelectFieldChangeValue;
  onChange?: (value: PcsSelectFieldChangeValue) => void;
  options?: PcsSelectFieldOption[];
  showSearch?: boolean;
  filterOption?: (input: string, option?: PcsSelectFieldOption) => boolean;
  disabled?: boolean;
  errorText?: string;
  className?: string;
  size?: PcsFieldSize;
  width?: string | number;
  onlyActive?: boolean;
  optionRender?: (option: PcsSelectFieldOption) => ReactNode;
  mode?: 'multiple' | 'tags';
  loading?: boolean;
  allowClear?: boolean;
}
