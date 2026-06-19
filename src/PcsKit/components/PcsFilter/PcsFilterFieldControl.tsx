import type { Dayjs } from 'dayjs';

import PcsCheckboxGroup from '../../ui/PcsCheckboxGroup/PcsCheckboxGroup';
import PcsDateRangeField from '../../ui/PcsDateRangeField/PcsDateRangeField';
import PcsNumberRangeField from '../../ui/PcsNumberRangeField/PcsNumberRangeField';
import PcsSelectField from '../../ui/PcsSelectField/PcsSelectField';
import PcsSelectMultipleField from '../../ui/PcsSelectMultipleField/PcsSelectMultipleField';
import PcsTextField from '../../ui/PcsTextField/PcsTextField';

import { PcsFilterField, PcsFilterFieldType } from './pcsFilterField.type';

interface PcsFilterFieldControlProps {
  field: PcsFilterField;
  value?: unknown;
  onChange?: (...args: unknown[]) => void;
}

const getFieldPlaceholder = (field: PcsFilterField) =>
  field.placeholder || `Выберите ${field.label.toLowerCase()}`;

const PcsFilterFieldControl = ({
  field,
  value,
  onChange,
}: PcsFilterFieldControlProps) => {
  switch (field.type) {
    case PcsFilterFieldType.Select:
      return (
        <PcsSelectField
          placeholder={getFieldPlaceholder(field)}
          options={field.options}
          size="sm"
          value={value as string | number | undefined}
          onChange={onChange as (value: unknown) => void}
        />
      );
    case PcsFilterFieldType.MultiSelect:
      return (
        <PcsSelectMultipleField
          placeholder={getFieldPlaceholder(field)}
          controlType={field.controlType}
          options={field.options}
          size="sm"
          value={value as string[] | undefined}
          onChange={onChange as (value: string[] | undefined) => void}
        />
      );
    case PcsFilterFieldType.DateRange:
      return (
        <PcsDateRangeField
          format={field.format}
          showTime={field.showTime}
          size="sm"
          value={value as [Dayjs | null, Dayjs | null] | undefined}
          onChange={
            onChange as (
              value: [Dayjs | null, Dayjs | null] | undefined,
            ) => void
          }
        />
      );
    case PcsFilterFieldType.NumberRange:
      return (
        <PcsNumberRangeField
          size="sm"
          value={value as [string, string] | undefined}
          onChange={onChange as (value: [string, string]) => void}
        />
      );
    case PcsFilterFieldType.Checkbox:
      return <PcsCheckboxGroup options={field.options} />;
    default:
      return (
        <PcsTextField
          placeholder={
            field.placeholder || `Поиск по ${field.label.toLowerCase()}...`
          }
          size="sm"
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      );
  }
};

export default PcsFilterFieldControl;
