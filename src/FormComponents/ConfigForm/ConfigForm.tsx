import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Empty } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { ArrayFieldRenderer } from './ArrayFieldRenderer';
import { RenderFieldByType } from './RenderFieldByType';
import FormObjectMap from '../FormObjectMap/FormObjectMap';
import { ConfigFormType, FieldConfigType, FieldType } from './config-form.type';
import './config-form.scss';

export default <T extends FieldValues>({
  config,
  crudApi,
  onSubmit,
  data,
}: ConfigFormType<T>) => {
  const [saveFailed, setSaveFailed] = useState(false);
  const submissionVersion = useRef(0);
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    submissionVersion.current += 1;
    if (data) {
      reset(data[0]);
      setSaveFailed(false);
    }
    return () => {
      submissionVersion.current += 1;
    };
  }, [data, reset]);

  const render = (field: FieldConfigType) => {
    switch (field.type) {
      case FieldType.OBJECT:
        return (
          <fieldset className="config-form__group" key={field.id}>
            <legend>{field.label}</legend>
            <FormObjectMap control={control} name={field.name} />
          </fieldset>
        );
      case FieldType.ARRAY:
        return (
          <ArrayFieldRenderer
            name={field.name}
            label={field.label}
            control={control}
            inputType={field.inputType}
            settings={field.settings}
            crudApi={crudApi}
            focusField={setFocus}
          />
        );
      default:
        return (
          <RenderFieldByType
            field={field}
            control={control}
            crudApi={crudApi}
          />
        );
    }
  };

  return (
    <form
      className="config-form"
      data-testid="config-form"
      onSubmit={(event) => {
        if (isSubmitting) event.preventDefault();
        else
          void handleSubmit(async (values, submitEvent) => {
            const version = ++submissionVersion.current;
            setSaveFailed(false);
            try {
              await onSubmit(values, submitEvent);
            } catch {
              if (version === submissionVersion.current) setSaveFailed(true);
            }
          })(event);
      }}
      aria-busy={isSubmitting}
    >
      <div className="config-form__control">
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !config?.fields.length}
        >
          Сохранить
        </Button>
      </div>
      {saveFailed && (
        <Alert
          type="error"
          showIcon
          title="Не удалось сохранить изменения"
          description="Введённые значения сохранены в форме. Попробуйте сохранить ещё раз."
          style={{ flexShrink: 0 }}
        />
      )}
      <div className="config-form__content">
        {!config?.fields.length && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="В конфигурации нет полей"
          />
        )}
        {config &&
          config.fields.map((field: FieldConfigType) => (
            <div
              className="config-form__item"
              data-testid="config-form-item"
              key={field.id}
            >
              {render(field)}
            </div>
          ))}
      </div>
    </form>
  );
};
