import { useEffect } from 'react';
import { Button } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { ArrayFieldRenderer } from './ArrayFieldRenderer';
import { RenderFieldByType } from './RenderFieldByType';
import FormObjectMap from '../FormObjectMap/FormObjectMap';
import { ConfigFormType, FieldConfigType, FieldType } from './config-form.type';

export default <T extends FieldValues>({
  config,
  crudApi,
  onSubmit,
  data,
}: ConfigFormType<T>) => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    if (data) {
      reset(data[0]);
    }
  }, [data, reset]);

  const render = (field: FieldConfigType) => {
    switch (field.type) {
      case FieldType.OBJECT:
        return (
          <div key={field.id}>
            <label>{field.label}</label>
            <FormObjectMap control={control} name={field.name} />
          </div>
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
          />
        );
      default:
        return RenderFieldByType({ field, control, crudApi });
    }
  };

  return (
    <form className="config-form" data-testid="config-form">
      <div className="config-form__control">
        <Button type="primary" onClick={handleSubmit(onSubmit)}>
          Сохранить
        </Button>
      </div>
      <div className="config-form__content">
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
