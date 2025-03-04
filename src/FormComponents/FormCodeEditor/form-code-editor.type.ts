import { FieldValues } from 'react-hook-form';
import { EditorProps } from '@monaco-editor/react';
import { FormComponentProps } from '../formTypes';

export type FormCodeEditorProps<TFormValues extends FieldValues> = Omit<
  FormComponentProps<TFormValues>,
  'formItemProps'
> &
  EditorProps & {
    height?: string;
    disable?: boolean;
  };
