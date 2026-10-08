import { Form } from 'antd';
import type { FormItemProps } from 'antd';
import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

type InputAccessibility = {
  id: string;
  'aria-required': boolean;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
};

type BaseFieldProps = {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  error?: FieldError;
  controlClassName?: string;
  wrapperClassName?: string;
  formItemProps?: FormItemProps;
  describedBy?: string;
  children: (props: InputAccessibility) => ReactElement;
};

export default function BaseField({
  id,
  label,
  required = false,
  error,
  controlClassName,
  wrapperClassName,
  formItemProps,
  describedBy,
  children,
}: BaseFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `kit-field-${generatedId}`;
  const help = error?.message ?? formItemProps?.help;
  const extra = formItemProps?.extra;
  const helpId = `${inputId}-help`;
  const extraId = `${inputId}-extra`;
  const labelId = `${inputId}-label`;
  const effectiveLabel =
    formItemProps && 'label' in formItemProps ? formItemProps.label : label;
  const isRequired = formItemProps?.required ?? required;
  const description =
    [describedBy, help ? helpId : undefined, extra ? extraId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div
      className={['kit-base-field', wrapperClassName].filter(Boolean).join(' ')}
      style={{ minWidth: 0 }}
    >
      <Form.Item
        labelCol={{ span: 24 }}
        {...formItemProps}
        label={
          effectiveLabel ? (
            <span id={labelId}>{effectiveLabel}</span>
          ) : (
            effectiveLabel
          )
        }
        className={[controlClassName, formItemProps?.className]
          .filter(Boolean)
          .join(' ')}
        htmlFor={inputId}
        required={isRequired}
        validateStatus={error ? 'error' : formItemProps?.validateStatus}
        help={help ? <span id={helpId}>{help}</span> : help}
        extra={extra ? <span id={extraId}>{extra}</span> : extra}
      >
        {children({
          id: inputId,
          'aria-required': isRequired,
          'aria-invalid': Boolean(error),
          'aria-describedby': description,
          'aria-labelledby': effectiveLabel ? labelId : undefined,
        })}
      </Form.Item>
    </div>
  );
}
