import { Form, AutoComplete } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormAutoCompleteProps } from './form-auto-complete.type';
import '../form-components.scss';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormAutoCompleteProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    field.onChange(trimmedValue);
    field.onBlur();
  };

  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        <AutoComplete
          {...rest}
          {...field}
          onBlur={handleBlur}
          filterOption={(inputValue, option) =>
            String(option?.value)
              .toUpperCase()
              .includes(inputValue.toUpperCase()) ?? false
          }
        />
      </Form.Item>
    </div>
  );
};
