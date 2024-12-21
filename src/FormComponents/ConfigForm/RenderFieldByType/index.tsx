import { Skeleton } from 'antd';
import { Control } from 'react-hook-form';

import './render-field-by-type.scss';
import FormInput from '../../FormInput/FormInput';
import FormInputNumber from '../../FormInputNumber/FormInputNumber';
import FormInputPassword from '../../FormInputPassword/FormInputPassword';
import FormTextArea from '../../FormTextArea/FormTextArea';
import FormCheckbox from '../../FormCheckbox/FormCheckbox';
import FormRadioGroup from '../../FormRadioGroup/FormRadioGroup';
import FormSelect from '../../FormSelect/FormSelect';
import { ValidationRules } from '../../../utils/validationRules';
import { InputType } from '../config-form.type';

interface RenderFieldByTypeType {
  field: any;
  control: Control<any>;
  onChange?: (value: any) => void;
  value?: '';
  crudApi: any;
}

export const RenderFieldByType = ({
  field,
  control,
  onChange = () => {},
  value = '',
  crudApi,
}: RenderFieldByTypeType) => {
  const { inputType, settings, id, label } = field;
  const rules = settings?.rules || {};
  const isRequired = rules.required;
  const dataSource = settings?.dataSource;
  const options = settings?.options || [];

  const optionValue = dataSource
    ? (() => {
        const { config, valueField, labelField } = dataSource;
        const configApis = crudApi[config];
        if (configApis) {
          const { data: dependentConfig } = configApis.useGetListQuery();
          return (
            dependentConfig?.map((el: any) => ({
              value: el[valueField as keyof typeof el],
              label: el[labelField as keyof typeof el],
            })) || []
          );
        }
        return [];
      })()
    : options;

  switch (inputType) {
    case InputType.INPUT:
      return (
        <FormInput
          name={id}
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
        <>
          {!optionValue?.length ? (
            <>
              <label className="select-skeleton-label">{label}</label>
              <Skeleton.Input active block />
            </>
          ) : (
            <FormSelect
              mode={isMultiSelect ? 'multiple' : undefined}
              name={id}
              label={label}
              options={optionValue}
              control={control}
              rules={{
                required: isRequired ? ValidationRules.required : false,
              }}
              value={value}
              onChange={onChange}
            />
          )}
        </>
      );
    }

    default:
      return null;
  }
};
