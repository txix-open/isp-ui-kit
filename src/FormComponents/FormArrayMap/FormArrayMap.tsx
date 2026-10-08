import { FieldValues, useController } from 'react-hook-form';
import { useId } from 'react';
import { Button, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FormArrayMapProps } from './form-array-map.type';
import BaseField from '../BaseField/BaseField';
import useCollectionDraft from '../BaseField/useCollectionDraft';
import './form-array-map.scss';

const fromValue = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];
const toValue = (entries: string[]) => entries.filter((entry) => entry !== '');

const FormArrayMap = <T extends FieldValues>({
  name,
  control,
  label,
  controlClassName = '',
  formItemProps,
  disabled = false,
}: FormArrayMapProps<T>) => {
  const errorId = `array-map-error-${useId()}`;
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  const { rows, add, remove, update } = useCollectionDraft(
    name,
    field.value,
    fromValue,
    toValue,
    field.onChange,
  );
  return (
    <div className="form-array-map__collection">
      {!rows.length && (
        <div className="form-array-map__empty">Пока нет элементов</div>
      )}
      {rows.map((row, index) => (
        <div className="form-array-map" key={row.key}>
          <BaseField
            label={
              label ? `${label}-${index + 1}` : `Элемент массива-${index + 1}`
            }
            controlClassName={controlClassName}
            formItemProps={formItemProps}
            describedBy={error ? errorId : undefined}
          >
            {(accessibility) => (
              <div className="form-array-map__wrapper">
                <Input
                  {...accessibility}
                  aria-invalid={Boolean(error)}
                  status={error ? 'error' : undefined}
                  ref={index === 0 ? field.ref : undefined}
                  disabled={disabled}
                  onChange={(event) => update(row.key, event.target.value)}
                  onBlur={(event) => {
                    update(row.key, event.target.value.trim());
                    field.onBlur();
                  }}
                  value={row.value}
                  placeholder="Значение"
                />
                <Button
                  disabled={disabled}
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  aria-label={`Удалить элемент ${index + 1}`}
                  onClick={() => remove(row.key)}
                />
              </div>
            )}
          </BaseField>
        </div>
      ))}
      {error?.message && (
        <div className="form-array-map__error" role="alert" id={errorId}>
          {error.message}
        </div>
      )}
      <Button
        ref={!rows.length ? field.ref : undefined}
        disabled={disabled}
        className="form-array-map__btn"
        icon={<PlusOutlined />}
        onClick={() => add('')}
      >
        Добавить новый элемент
      </Button>
    </div>
  );
};
export default FormArrayMap;
