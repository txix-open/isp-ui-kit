import { useEffect, useState, type ReactNode } from 'react';
import { Button } from 'antd';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export default function StoryForm({
  methods,
  children,
  errorField,
}: {
  methods: UseFormReturn<FieldValues>;
  children: ReactNode;
  errorField?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const { setError } = methods;
  useEffect(() => {
    if (errorField)
      setError(errorField, {
        type: 'required',
        message: 'Поле обязательно для заполнения.',
      });
  }, [errorField, setError]);
  return (
    <form
      style={{ width: '100%', minWidth: 0, maxWidth: 640 }}
      onSubmit={methods.handleSubmit(
        () => setSubmitted(true),
        () => setSubmitted(false),
      )}
    >
      {children}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button type="primary" htmlType="submit">
          Проверить и отправить
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            methods.reset();
            setSubmitted(false);
          }}
        >
          Сбросить
        </Button>
      </div>
      {submitted && <p role="status">Форма успешно отправлена.</p>}
    </form>
  );
}
