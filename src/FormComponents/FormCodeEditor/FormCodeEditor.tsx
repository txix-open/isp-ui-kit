import { Controller, FieldValues } from 'react-hook-form';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { FormCodeEditorProps } from './form-code-editor.type';

loader.config({
  ...monaco,
  'vs/nls': {
    availableLanguages: {
      '*': 'ru',
    },
  },
});

const formatJSON = (val: string) => {
  try {
    const res = JSON.parse(val);
    return JSON.stringify(res, null, 2);
  } catch {
    return val;
  }
};

export default <T extends FieldValues>({
  control,
  name,
  height = '400px',
  disable = false,
  language = 'javascript',
  ...rest
}: FormCodeEditorProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <Editor
        options={{ readOnly: disable }}
        height={height}
        value={value}
        language={language}
        onChange={(value) => onChange(value ? formatJSON(value) : '')}
        {...rest}
      />
    )}
  />
);
