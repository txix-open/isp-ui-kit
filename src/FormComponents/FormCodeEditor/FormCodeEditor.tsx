import type { FieldValues } from 'react-hook-form';
import type { FormCodeEditorProps } from './form-code-editor.type';
import { FormCodeEditorWithLoader } from './FormCodeEditorWithLoader';
import type { MonacoSource } from './monaco-loader';

const defaultMonacoSource: MonacoSource = () => import('monaco-editor');

export default function FormCodeEditor<T extends FieldValues>({
  loadMonaco = defaultMonacoSource,
  ...props
}: FormCodeEditorProps<T>) {
  return <FormCodeEditorWithLoader<T> {...props} loadMonaco={loadMonaco} />;
}
