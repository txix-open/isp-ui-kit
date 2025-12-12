import { Controller, FieldValues } from 'react-hook-form';
import Editor, { loader } from '@monaco-editor/react';
// import * as monaco from 'monaco-editor';
import { FormCodeEditorProps } from './form-code-editor.type';
import { useEffect, useState } from 'react';

const formatJSON = (val: string) => {
  try {
    const res = JSON.parse(val);
    return JSON.stringify(res, null, 2);
  } catch {
    return val;
  }
};

let monacoLoaderPromise: Promise<void> | null = null;

const initMonaco = () => {
  if (!monacoLoaderPromise) {
    monacoLoaderPromise = import('monaco-editor').then((monaco) => {
      loader.config({
        monaco,
        'vs/nls': { availableLanguages: { '*': 'ru' } },
      });
    });
  }
  return monacoLoaderPromise;
};

export default <T extends FieldValues>({
  control,
  name,
  height = '400px',
  disable = false,
  language = 'javascript',
  ...rest
}: FormCodeEditorProps<T>) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initMonaco().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return <div>Loading editor...</div>; // Или null, или спиннер
  }
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Editor
          options={{ readOnly: disable }}
          height={height}
          value={value}
          language={language}
          onChange={(value) => onChange(value)}
          onMount={(editor) => {
            editor.onDidBlurEditorWidget(() => {
              const currentValue = editor.getValue();
              const formattedValue = formatJSON(currentValue);

              if (formattedValue !== currentValue) {
                onChange(formattedValue);
                editor.setValue(formattedValue);
              }
            });
          }}
          {...rest}
        />
      )}
    />
  );
};
