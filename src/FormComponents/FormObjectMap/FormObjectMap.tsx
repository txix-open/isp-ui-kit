import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useController } from 'react-hook-form';
import { useId } from 'react';
import './form-object-map.scss';
import { ObjectFieldRendererPropsType } from '../ConfigForm/config-form.type';
import useCollectionDraft from '../BaseField/useCollectionDraft';

type Entry = [string, string];
const fromValue = (value: unknown): Entry[] =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value)
    : [];
const toValue = (entries: Entry[]) =>
  Object.fromEntries(entries.filter(([key]) => key));

export const ObjectFieldRenderer = ({
  name,
  control,
  disabled = false,
}: ObjectFieldRendererPropsType) => {
  const errorId = `object-map-error-${useId()}`;
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
  const change = (key: number, entry: Entry, part: 0 | 1, value: string) =>
    update(key, part === 0 ? [value, entry[1]] : [entry[0], value]);
  return (
    <div className="object-component">
      <div className="object-component__content">
        {!rows.length && (
          <div className="object-component__empty-field">Пока нет ключей</div>
        )}
        {rows.map((row, index) => (
          <div key={row.key} className="object-component__field">
            <Input
              ref={index === 0 ? field.ref : undefined}
              disabled={disabled}
              data-testid={`object-component__key-${index}`}
              aria-label={`Ключ ${index + 1}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              status={error ? 'error' : undefined}
              placeholder="Ключ"
              value={row.value[0]}
              onChange={(event) =>
                change(row.key, row.value, 0, event.target.value)
              }
              onBlur={(event) => {
                change(row.key, row.value, 0, event.target.value.trim());
                field.onBlur();
              }}
            />
            <Input
              disabled={disabled}
              data-testid={`object-component__value-${index}`}
              aria-label={`Значение ${index + 1}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              status={error ? 'error' : undefined}
              placeholder="Значение"
              value={row.value[1]}
              onChange={(event) =>
                change(row.key, row.value, 1, event.target.value)
              }
              onBlur={(event) => {
                change(row.key, row.value, 1, event.target.value.trim());
                field.onBlur();
              }}
            />
            <Button
              disabled={disabled}
              data-testid={`object-component__remove-btn-${index}`}
              className="object-component__field__remove-btn"
              danger
              type="text"
              aria-label={`Удалить ключ ${index + 1}`}
              onClick={() => remove(row.key)}
              icon={<DeleteOutlined />}
            />
          </div>
        ))}
      </div>
      {error?.message && (
        <div className="object-component__error" role="alert" id={errorId}>
          {error.message}
        </div>
      )}
      <div className="object-component__add-btn">
        <Button
          ref={!rows.length ? field.ref : undefined}
          disabled={disabled}
          data-testid="object-component__add-btn"
          className="object-component__add-btn__btn"
          onClick={() => add(['', ''])}
          icon={<PlusOutlined />}
        >
          Добавить ключ
        </Button>
      </div>
    </div>
  );
};
export default ObjectFieldRenderer;
