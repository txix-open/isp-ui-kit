## Подключение FormCodeEditor в приложении

Примеры относятся к обновлённому киту в текущей ветке. Новые свойства loadMonaco, loadTimeoutMs и forwardEvents появятся в опубликованном пакете после выпуска версии. Monaco остаётся зависимостью приложения; настройка Storybook не переносится в приложение автоматически.

### 1. Зависимости

В существующем React-приложении установите кит и его зависимости:

```bash
npm install isp-ui-kit antd react-hook-form @monaco-editor/react monaco-editor
```

React и React DOM уже должны быть установлены. Примеры ниже используют Vite, React Hook Form и Ant Design 6. Для TypeScript проекту нужна декларация Vite в `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

### 2. Monaco и workers в Vite

Создайте `src/monaco.ts`. Функция loadMonaco объявлена на уровне модуля, поэтому её ссылка не меняется при перерисовке формы. Workers загружаются с того же приложения, без CDN.

```ts
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

let configured = false;

export function configureMonacoWorkers() {
  if (configured) return;

  globalThis.MonacoEnvironment = {
    getWorker(_moduleId, label) {
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HtmlWorker();
      }
      if (label === 'javascript' || label === 'typescript') {
        return new TypeScriptWorker();
      }
      return new EditorWorker();
    },
  };

  configured = true;
}

export async function loadMonaco() {
  configureMonacoWorkers();
  return import('monaco-editor');
}
```

Кит вызовет loadMonaco перед инициализацией редактора. Настройка workers выполняется явным вызовом, поэтому сборщик не удалит её как неиспользуемый побочный импорт. Если приложение использует также обычный Monaco или `@monaco-editor/react` напрямую, вызовите configureMonacoWorkers() в точке входа **до первого редактора**. Loader общий для приложения.

Для Webpack и других сборщиков сохраняется та же схема: подготовить MonacoEnvironment.getWorker средствами своего сборщика, затем вернуть модуль из loadMonaco. Суффикс `?worker` в примере относится именно к Vite. Проверяйте и dev, и production-сборку.

### 3. Полная форма: начальное значение, проверка JSON и сохранение

Создайте `src/EditorForm.tsx`. Здесь значение редактора — **строка**, а JSON разбирается перед отправкой. Замените `/api/configuration` на адрес своего API.

```tsx
import { Button, message } from 'antd';
import { useForm } from 'react-hook-form';
import { FormCodeEditor } from 'isp-ui-kit';
import { loadMonaco } from './monaco';

type FormValues = { configuration: string };

export default function EditorForm({ dark = false }: { dark?: boolean }) {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      configuration: JSON.stringify({ enabled: true, retries: 3 }, null, 2),
    },
  });

  const save = async ({ configuration }: FormValues) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(configuration);
    } catch {
      setError(
        'configuration',
        { type: 'validate', message: 'Введите корректный JSON.' },
        { shouldFocus: true },
      );
      return;
    }

    try {
      const response = await fetch('/api/configuration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) throw new Error('Save failed');
      void messageApi.success('Конфигурация сохранена');
    } catch {
      void messageApi.error('Не удалось сохранить конфигурацию');
    }
  };

  return (
    <form onSubmit={handleSubmit(save)} style={{ minWidth: 0 }}>
      {contextHolder}
      <FormCodeEditor
        control={control}
        name="configuration"
        label="Конфигурация"
        language="json"
        height="360px"
        theme={dark ? 'vs-dark' : 'light'}
        loadMonaco={loadMonaco}
        loadTimeoutMs={30000}
        disable={isSubmitting}
        options={{ minimap: { enabled: false }, wordWrap: 'on' }}
      />
      <Button
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Сохранить
      </Button>
    </form>
  );
}
```

Форма передаёт control из своего useForm, а name соответствует ключу строки в FormValues. Не передавайте value вручную для обычной формы: её значением управляет React Hook Form. Цветовая тема редактора задаётся явно; Ant Design ConfigProvider сам не переключает тему Monaco.

Форматирование корректного JSON происходит на blur. **Форматирование не проверяет валидность:** невалидный текст сохраняется как строка, поэтому в примере есть JSON.parse перед запросом. Свойство rules в прежнем FormCodeEditor не применялось и не включается автоматически этой итерацией. Для ошибок используйте setError, проверку в submit или resolver формы. Не запускайте сохранение отдельным onClick в обход handleSubmit.

Встроенный loading и сообщение ошибки относятся к загрузке Monaco. Они не выполняют запрос за записью и не сохраняют её в API. При нестандартной загрузке можно передать свой loading; после ошибки компонент показывает «Повторить». Если URL workers неверен, исправьте настройку приложения: повторная попытка сама не меняет URL.

### 4. Загрузка другой записи через reset

Чтобы показать полученную запись, обновляйте модель формы через reset. Пример законченного компонента, который принимает JSON-объект от родителя:

```tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormCodeEditor } from 'isp-ui-kit';
import { loadMonaco } from './monaco';

type FormValues = { configuration: string };

export function RecordEditor({
  record,
}: {
  record: Record<string, unknown> | null;
}) {
  const { control, reset } = useForm<FormValues>({
    defaultValues: { configuration: '' },
  });

  useEffect(() => {
    reset({ configuration: record ? JSON.stringify(record, null, 2) : '' });
  }, [record, reset]);

  return (
    <FormCodeEditor
      control={control}
      name="configuration"
      label="Полученная конфигурация"
      language="json"
      loadMonaco={loadMonaco}
      disable={!record}
    />
  );
}
```

Меняйте ссылку record при загрузке или смене записи; сохраняйте её стабильной при обычных перерисовках. reset заменяет текущий текст, включая пользовательский черновик. Для обновления только редактора используйте `setValue('configuration', text, { shouldDirty: true })` с уже подготовленной строкой. Объект напрямую в value передавать не нужно.

### 5. Пользовательские события вместе с React Hook Form

Старые onChange и onMount имеют прежний приоритет: onChange перекрывает внутреннее обновление формы, onMount — форматирование на blur. Для новых интеграций с пользовательскими событиями используйте forwardEvents=true.

```tsx
import { useState } from 'react';
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { FormCodeEditor } from 'isp-ui-kit';
import { loadMonaco } from './monaco';

type FormValues = { configuration: string };

export function EditorWithEvents() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { configuration: '{}' },
  });
  const [length, setLength] = useState(2);
  const [saved, setSaved] = useState<string>();

  return (
    <form
      onSubmit={handleSubmit(({ configuration }) => setSaved(configuration))}
    >
      <FormCodeEditor
        control={control}
        name="configuration"
        label="Конфигурация с событиями"
        language="json"
        loadMonaco={loadMonaco}
        forwardEvents
        onChange={(text) => setLength(text?.length ?? 0)}
        onMount={(instance) => instance.updateOptions({ tabSize: 2 })}
      />
      <p>Символов: {length}</p>
      <Button htmlType="submit">Сохранить строку</Button>
      {saved !== undefined && <pre>{saved}</pre>}
    </form>
  );
}
```

Здесь обработчик onChange обновляет счётчик, а кит продолжает сохранять значение в React Hook Form. Если onMount создаёт собственные подписки на события Monaco, приложение должно освободить их при размонтировании.

### 6. Только чтение и ограниченная высота

Внутри своей формы достаточно передать disable. Настройки options.readOnly имеют приоритет, поэтому не задавайте readOnly=false для недоступного редактора.

```tsx
<FormCodeEditor
  control={control}
  name="configuration"
  label="Просмотр конфигурации"
  language="json"
  loadMonaco={loadMonaco}
  disable
  height="240px"
  options={{ minimap: { enabled: false }, wordWrap: 'on' }}
/>
```

Это запрет пользовательского ввода. Прежнее форматирование JSON при потере фокуса сохраняется; если нужно показать исходный текст без форматирования, передайте свой onMount и оставьте forwardEvents=false.

Для height="100%" родитель должен иметь заданную высоту. При ширине в flex/grid-контейнере задайте родителю min-width: 0. automaticLayout включён по умолчанию; его можно переопределить в options. Для нескольких независимых редакторов не задавайте им один и тот же path: это идентификатор модели Monaco.
