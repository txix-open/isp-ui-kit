export enum PcsFilterFieldType {
  Select = 'select',
  MultiSelect = 'multi-select',
  Input = 'input',
  DateRange = 'date-range',
  NumberRange = 'number-range',
  Checkbox = 'checkbox',
}

export type PcsFilterSelectedLabelValue =
  | string
  | {
      from?: unknown;
      to?: unknown;
      value?: unknown;
      rangeIndex?: 0 | 1;
    };

export interface PcsFilterField {
  name: string;
  label: string;
  type: PcsFilterFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  controlType?: 'checkbox' | 'radio';
  format?: string;
  showTime?: boolean;
  selectedLabel?:
    | string
    | ((value: PcsFilterSelectedLabelValue) => string | undefined);
}
