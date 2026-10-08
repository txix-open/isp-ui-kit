import { FieldValues, useController } from 'react-hook-form';
import Editor, { EditorProps } from '@monaco-editor/react';
import { Alert, Button, Spin } from 'antd';
import { Component, ReactNode, useEffect, useRef, useState } from 'react';
import type { IDisposable } from 'monaco-editor';
import { FormCodeEditorProps } from './form-code-editor.type';
import BaseField from '../BaseField/BaseField';
import {
  defaultMonacoSource,
  initializeMonaco,
  retryMonaco,
} from './monaco-loader';
import './form-code-editor.scss';

const formatJSON = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

class EditorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default <T extends FieldValues>({
  control,
  name,
  label,
  controlClassName,
  rules: _rules,
  height = '400px',
  disable = false,
  language = 'javascript',
  loadMonaco = defaultMonacoSource,
  loadTimeoutMs = 20000,
  forwardEvents = false,
  ...rest
}: FormCodeEditorProps<T>) => {
  // rules were ignored by the old component; do not enable new validation implicitly.
  void _rules;
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });
  const [phase, setPhase] = useState<'loading' | 'ready' | 'mounted' | 'error'>(
    'loading',
  );
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const blurSubscription = useRef<IDisposable | undefined>(undefined);
  const live = useRef({ field, forwardEvents });
  live.current = { field, forwardEvents };

  useEffect(() => {
    let active = true;
    setPhase('loading');
    timer.current = setTimeout(() => {
      if (active) setPhase('error');
    }, loadTimeoutMs);
    initializeMonaco(loadMonaco)
      .then(() => {
        if (active) setPhase((phase) => (phase === 'error' ? phase : 'ready'));
      })
      .catch(() => {
        if (active) {
          clearTimeout(timer.current);
          setPhase('error');
        }
      });
    return () => {
      active = false;
      clearTimeout(timer.current);
      blurSubscription.current?.dispose();
    };
  }, [attempt, loadMonaco, loadTimeoutMs]);

  const failure = (
    <Alert
      type="error"
      showIcon
      title="Не удалось загрузить редактор"
      description="Проверьте подключение и настройку Monaco в приложении."
      action={
        <Button
          onClick={() => {
            retryMonaco(loadMonaco);
            setAttempt((value) => value + 1);
          }}
        >
          Повторить
        </Button>
      }
    />
  );
  const loading = rest.loading ?? (
    <div role="status" className="form-code-editor__loading">
      <Spin />
      <span>Загрузка редактора…</span>
    </div>
  );
  const onMount: NonNullable<EditorProps['onMount']> = (instance, monaco) => {
    clearTimeout(timer.current);
    setPhase('mounted');
    field.ref({ focus: () => instance.focus() });
    blurSubscription.current?.dispose();
    // Legacy onMount overrides automatic JSON formatting unless forwarding is enabled.
    if (!rest.onMount || forwardEvents) {
      blurSubscription.current = instance.onDidBlurEditorWidget(() => {
        const currentValue = instance.getValue();
        const formatted = formatJSON(currentValue);
        if (formatted !== currentValue) {
          live.current.field.onChange(formatted);
          instance.setValue(formatted);
        }
        live.current.field.onBlur();
      });
    }
    rest.onMount?.(instance, monaco);
  };
  return (
    <BaseField label={label} controlClassName={controlClassName} error={error}>
      {(accessibility) => (
        <div
          id={accessibility.id}
          role="group"
          aria-labelledby={accessibility['aria-labelledby']}
          aria-describedby={accessibility['aria-describedby']}
          aria-invalid={accessibility['aria-invalid']}
          className="form-code-editor"
          style={{ height, width: rest.width ?? '100%' }}
          aria-busy={phase === 'loading' || phase === 'ready'}
        >
          {phase === 'error' ? (
            failure
          ) : phase === 'loading' ? (
            loading
          ) : (
            <EditorBoundary
              key={attempt}
              fallback={failure}
              onError={() => {
                clearTimeout(timer.current);
                setPhase('error');
              }}
            >
              <Editor
                {...rest}
                height="100%"
                width="100%"
                options={{
                  readOnly: disable,
                  automaticLayout: true,
                  ariaLabel:
                    typeof label === 'string' ? label : 'Редактор кода',
                  ...rest.options,
                }}
                value={rest.value !== undefined ? rest.value : field.value}
                language={language}
                loading={loading}
                onChange={(value, event) => {
                  if (!rest.onChange || forwardEvents) field.onChange(value);
                  rest.onChange?.(value, event);
                }}
                onMount={onMount}
              />
            </EditorBoundary>
          )}
        </div>
      )}
    </BaseField>
  );
};
