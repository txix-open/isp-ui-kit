import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { Controller, FieldValues } from 'react-hook-form';
import { FormCodeEditorProps } from './form-code-editor.type';

export default <T extends FieldValues>({
  control,
  name,
  language = 'javaScript',
  height = '400px',
  disable,
}: FormCodeEditorProps<T>) => {
  const extension =
    language === 'javaScript' ? [javascript({ jsx: true })] : [json()];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <CodeMirror
          editable={!disable}
          height={height}
          value={'value'.toString()}
          extensions={extension}
          onChange={onChange}
        />
      )}
    />
  );
};
