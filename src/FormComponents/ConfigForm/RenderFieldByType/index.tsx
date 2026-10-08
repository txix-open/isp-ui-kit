import { Control } from 'react-hook-form';

import FormInput from '../../FormInput/FormInput';
import FormInputNumber from '../../FormInputNumber/FormInputNumber';
import FormInputPassword from '../../FormInputPassword/FormInputPassword';
import FormTextArea from '../../FormTextArea/FormTextArea';
import FormCheckbox from '../../FormCheckbox/FormCheckbox';
import FormRadioGroup from '../../FormRadioGroup/FormRadioGroup';
import FormSelect from '../../FormSelect/FormSelect';
import { ValidationRules } from '../../../utils/validationRules';
import { DataSourceType, InputType, OptionType } from '../config-form.type';

interface RenderFieldByTypeType {
  field: any;
  control: Control<any>;
  onChange?: (value: any) => void;
  value?: any;
  resolvedOptions?: OptionType[];
  loading?: boolean;
  crudApi: any;
}

// Isolate the API hook from the parent field list and key it by its source.
const DataSourceField = ({
  query,
  source,
  ...props
}: RenderFieldByTypeType & {
  query: () => { data?: any[]; isLoading?: boolean; isFetching?: boolean };
  source: DataSourceType;
}) => {
  const result = query();
  const options =
    result.data?.map((item) => ({
      value: item[source.valueField],
      label: item[source.labelField],
    })) || [];
  return (
    <FieldControl
      {...props}
      resolvedOptions={options}
      loading={!!result.isLoading || !!result.isFetching}
    />
  );
};

export const RenderFieldByType = (props: RenderFieldByTypeType) => {
  const source = props.field.settings?.dataSource;
  const query = source && props.crudApi?.[source.config]?.useGetListQuery;
  return query ? (
    <DataSourceField
      key={source.config}
      {...props}
      query={query}
      source={source}
    />
  ) : (
    <FieldControl {...props} />
  );
};

const FieldControl = ({
  field,
  control,
  onChange = () => {},
  value = '',
  resolvedOptions,
  loading = false,
}: RenderFieldByTypeType) => {
  const { inputType, settings, id, label } = field;
  const rules = settings?.rules || {};
  const isRequired = rules.required;
  const accessibility = field.ariaLabel
    ? { 'aria-label': field.ariaLabel }
    : {};
  const optionValue = resolvedOptions || settings?.options || [];

  switch (inputType) {
    case InputType.INPUT:
      return (
        <FormInput
          name={id}
          {...accessibility}
          label={label}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.INPUT_NUMBER:
      return (
        <FormInputNumber
          name={id}
          {...accessibility}
          label={label}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.INPUT_PASSWORD:
      return (
        <FormInputPassword
          name={id}
          {...accessibility}
          label={label}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.TEXT_AREA:
      return (
        <FormTextArea
          name={id}
          {...accessibility}
          label={label}
          control={control}
          autoSize={{
            minRows: rules.minRows,
            maxRows: rules.maxRows,
          }}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.CHECKBOX:
      return (
        <FormCheckbox
          name={id}
          {...accessibility}
          label={label}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.RADIO_GROUP:
      return (
        <FormRadioGroup
          name={id}
          {...accessibility}
          label={label}
          items={optionValue || []}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    case InputType.SELECT:
    case InputType.MULTI_SELECT: {
      const isMultiSelect = inputType === InputType.MULTI_SELECT;
      return (
        <FormSelect
          mode={isMultiSelect ? 'multiple' : undefined}
          name={id}
          {...accessibility}
          label={label}
          options={optionValue}
          loading={loading}
          control={control}
          rules={{ required: isRequired ? ValidationRules.required : false }}
          value={value}
          onChange={onChange}
        />
      );
    }

    default:
      return null;
  }
};
