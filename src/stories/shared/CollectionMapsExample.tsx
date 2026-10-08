import { useState } from 'react';
import { Button, Space } from 'antd';
import { useForm, type FieldValues } from 'react-hook-form';
import { FormArrayMap, FormObjectMap } from '../../FormComponents';

const first = {
  connection: {
    hosts: ['https://api.example.test', 'https://backup.example.test'],
    headers: { 'X-Environment': 'test', 'X-Region': 'Москва' },
  },
};
const second = {
  connection: {
    hosts: ['https://production.example.test'],
    headers: { 'X-Environment': 'production', 'X-Trace': 'enabled' },
  },
};
export default function CollectionMapsExample({
  kind = 'both',
  empty = false,
  disabled = false,
  numeric = false,
}: {
  kind?: 'both' | 'array' | 'object';
  empty?: boolean;
  disabled?: boolean;
  numeric?: boolean;
}) {
  const { control, handleSubmit, reset, setValue, setError } =
    useForm<FieldValues>({
      defaultValues: empty
        ? {
            connection: {
              hosts: [] as (string | number)[],
              headers: {} as Record<string, string>,
            },
          }
        : numeric
          ? { ...first, connection: { ...first.connection, hosts: [1, 2, 3] } }
          : first,
    });
  const [saved, setSaved] = useState<unknown>();
  const load = () => {
    reset(second);
    setSaved(undefined);
  };
  return (
    <form
      style={{ maxWidth: 640, minWidth: 0 }}
      onSubmit={handleSubmit(setSaved)}
    >
      <Space wrap style={{ marginBottom: 20 }}>
        <Button htmlType="button" onClick={load}>
          Загрузить другую запись
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            reset();
            setSaved(undefined);
          }}
        >
          Сбросить
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            setValue('connection.hosts', []);
            setValue('connection.headers', {});
            setSaved(undefined);
          }}
        >
          Очистить через setValue
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            setError(
              kind === 'object' ? 'connection.headers' : 'connection.hosts',
              {
                type: 'server',
                message: 'Проверьте значения: ошибка от сервера.',
              },
              { shouldFocus: true },
            )
          }
        >
          Показать ошибку
        </Button>
      </Space>
      {kind !== 'object' && (
        <fieldset
          style={{ border: 0, padding: 0, margin: '0 0 24px', minWidth: 0 }}
        >
          <legend style={{ fontWeight: 600, marginBottom: 12 }}>
            Адреса серверов
          </legend>
          <FormArrayMap
            name="connection.hosts"
            control={control}
            label="Адрес"
            disabled={disabled}
          />
        </fieldset>
      )}
      {kind !== 'array' && (
        <fieldset
          style={{ border: 0, padding: 0, margin: '0 0 24px', minWidth: 0 }}
        >
          <legend style={{ fontWeight: 600, marginBottom: 12 }}>
            Дополнительные заголовки
          </legend>
          <FormObjectMap
            name="connection.headers"
            control={control}
            disabled={disabled}
          />
        </fieldset>
      )}
      <Button type="primary" htmlType="submit">
        Сохранить
      </Button>
      {saved !== undefined && (
        <div role="status">
          <p>Значения сохранены</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {JSON.stringify(saved, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
