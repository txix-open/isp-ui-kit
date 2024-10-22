import { FieldValues } from 'react-hook-form';
import { EditorProps } from '@monaco-editor/react';
import { FormComponentProps } from '../formTypes';
export type FormCodeEditorProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> &
    EditorProps & {
      height?: string;
      disable?: boolean;
    };
