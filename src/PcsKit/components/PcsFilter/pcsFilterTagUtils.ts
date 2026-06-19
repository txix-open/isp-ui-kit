import type { PcsTagListItem } from '../../ui/PcsTagList/PcsTagList';

import type {
  PcsFilterField,
  PcsFilterSelectedLabelValue,
} from './pcsFilterField.type';

export interface PcsSelectedFilterTag extends PcsTagListItem {
  fieldName: string;
  value?: unknown;
  rangeIndex?: 0 | 1;
}

type RangeValue = [unknown, unknown];

const isFilledValue = (value: unknown) =>
  value !== undefined && value !== null && value !== '';

const isRangeValue = (value: unknown): value is RangeValue =>
  Array.isArray(value) && value.length >= 2;

const getOptionLabel = (field: PcsFilterField, value: unknown) => {
  const stringValue = String(value);
  return (
    field.options?.find((option) => option.value === stringValue)?.label ||
    stringValue
  );
};

const formatDateValue = (field: PcsFilterField, value: unknown) => {
  if (
    value &&
    typeof value === 'object' &&
    'format' in value &&
    typeof value.format === 'function'
  ) {
    return value.format(
      field.format || (field.showTime ? 'DD.MM.YY HH:mm' : 'DD.MM.YY'),
    );
  }

  return String(value);
};

const formatWithSelectedLabel = (
  field: PcsFilterField,
  value: string,
  rawValue: unknown = value,
) =>
  typeof field.selectedLabel === 'function'
    ? field.selectedLabel(rawValue as PcsFilterSelectedLabelValue) || value
    : value;

const createTag = (
  field: PcsFilterField,
  label: string,
  value?: unknown,
  rangeIndex?: 0 | 1,
): PcsSelectedFilterTag => ({
  key: [
    field.name,
    rangeIndex !== undefined ? `range-${rangeIndex}` : 'value',
    value !== undefined ? String(value) : label,
  ].join(':'),
  fieldName: field.name,
  label,
  value,
  rangeIndex,
});

const buildDateRangeTags = (field: PcsFilterField, value: unknown) => {
  if (!isRangeValue(value)) return [];

  const [from, to] = value;
  const prefix =
    typeof field.selectedLabel === 'string' ? field.selectedLabel : '';
  const tags: PcsSelectedFilterTag[] = [];

  if (isFilledValue(from)) {
    const label =
      typeof field.selectedLabel === 'function'
        ? field.selectedLabel({ from, to, value: from, rangeIndex: 0 }) ||
          formatDateValue(field, from)
        : `${prefix ? `${prefix} с` : 'С'} ${formatDateValue(field, from)}`;
    tags.push(createTag(field, label, from, 0));
  }

  if (isFilledValue(to)) {
    const label =
      typeof field.selectedLabel === 'function'
        ? field.selectedLabel({ from, to, value: to, rangeIndex: 1 }) ||
          formatDateValue(field, to)
        : `${prefix ? `${prefix} до` : 'До'} ${formatDateValue(field, to)}`;
    tags.push(createTag(field, label, to, 1));
  }

  return tags;
};

const buildNumberRangeTags = (field: PcsFilterField, value: unknown) => {
  if (!isRangeValue(value)) return [];

  const [from, to] = value;

  if (!isFilledValue(from) && !isFilledValue(to)) return [];

  if (typeof field.selectedLabel === 'function') {
    const label = field.selectedLabel({ from, to });
    return label ? [createTag(field, label)] : [];
  }

  const prefix =
    typeof field.selectedLabel === 'string' ? field.selectedLabel : field.label;
  let label = prefix;

  if (isFilledValue(from) && isFilledValue(to)) {
    label = `${label} ${from} - ${to}`;
  } else if (isFilledValue(from)) {
    label = `${label} от ${from}`;
  } else if (isFilledValue(to)) {
    label = `${label} до ${to}`;
  }

  return [createTag(field, label)];
};

export const buildPcsSelectedFilterTags = (
  fields: PcsFilterField[],
  values: Record<string, unknown> = {},
): PcsSelectedFilterTag[] =>
  fields.flatMap((field) => {
    const value = values[field.name];

    if (!isFilledValue(value)) return [];

    if (field.type === 'date-range') {
      return buildDateRangeTags(field, value);
    }

    if (field.type === 'number-range') {
      return buildNumberRangeTags(field, value);
    }

    if (Array.isArray(value)) {
      return value.filter(isFilledValue).map((item) => {
        const optionLabel = getOptionLabel(field, item);
        return createTag(
          field,
          formatWithSelectedLabel(field, optionLabel, optionLabel),
          item,
        );
      });
    }

    const stringValue = String(value);

    if (!stringValue) return [];

    const label =
      field.type === 'select'
        ? getOptionLabel(field, value)
        : formatWithSelectedLabel(field, stringValue, stringValue);

    return [createTag(field, label, value)];
  });

export const removeSelectedFilterValue = (
  values: Record<string, unknown> = {},
  tag: Pick<PcsSelectedFilterTag, 'fieldName' | 'value' | 'rangeIndex'>,
) => {
  const nextValues = { ...values };
  const currentValue = nextValues[tag.fieldName];

  if (tag.rangeIndex !== undefined && Array.isArray(currentValue)) {
    const nextRange = [...currentValue];
    nextRange[tag.rangeIndex] = undefined;

    if (nextRange.some(isFilledValue)) {
      nextValues[tag.fieldName] = nextRange;
    } else {
      delete nextValues[tag.fieldName];
    }

    return nextValues;
  }

  if (Array.isArray(currentValue) && tag.value !== undefined) {
    const nextArray = currentValue.filter((value) => value !== tag.value);

    if (nextArray.length) {
      nextValues[tag.fieldName] = nextArray;
    } else {
      delete nextValues[tag.fieldName];
    }

    return nextValues;
  }

  delete nextValues[tag.fieldName];
  return nextValues;
};
