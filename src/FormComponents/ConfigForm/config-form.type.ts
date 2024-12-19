import { Control, FieldValues, SubmitHandler } from 'react-hook-form';

export interface FieldConfigType {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  inputType: InputType;
  settings: SettingsType;
}

export interface ConfigFormType<T extends FieldValues> {
  config: FormConfigType;
  crudApi: any;
  data: T;
  onSubmit: SubmitHandler<FieldValues>;
}

export enum FieldType {
  SINGLE = 'single',
  ARRAY = 'array',
  OBJECT = 'object',
}

export enum InputType {
  INPUT = 'Input',
  INPUT_PASSWORD = 'InputPassword',
  INPUT_NUMBER = 'InputNumber',
  TEXT_AREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  RADIO_GROUP = 'RadioGroup',
  SELECT = 'Select',
  MULTI_SELECT = 'MultiSelect',
}

export interface RuleType {
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

export interface OptionType {
  value: string | number;
  label: string;
}

export interface DataSourceType {
  config: string;
  valueField: string;
  labelField: string;
}

export interface SettingsType {
  rules?: RuleType;
  options?: OptionType[];
  dataSource?: DataSourceType;
  language?: string;
}

type MethodType = 'GET' | 'POST' | 'DELETE';
type EndpointKeys = 'delete' | 'update' | 'create' | 'getList' | 'getOne';

interface EndpointType {
  method: MethodType;
  endpoint: string;
}

export interface FormConfigType {
  name: string;
  id: string;
  fieldId: string;
  fields: FieldConfigType[];
  endpoints: Partial<Record<EndpointKeys, EndpointType>>;
}

export interface ObjectFieldRendererPropsType {
  name: string;
  control: Control<any>;
}

export type FieldEsiPropsType = string[][];

export interface ObjectEntriesValueType {
  [key: string]: string;
}
