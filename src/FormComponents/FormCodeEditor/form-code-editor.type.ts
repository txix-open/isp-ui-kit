import { FieldValues } from 'react-hook-form';
import { EditorProps } from '@monaco-editor/react';
import { FormComponentProps } from '../formTypes';
import type { MonacoSource } from './monaco-loader';

export type FormCodeEditorProps<TFormValues extends FieldValues> = Omit<
  FormComponentProps<TFormValues>,
  'formItemProps'
> &
  EditorProps & {
    height?: string;
    disable?: boolean;
    /** Configure workers in this function before resolving the Monaco module. */
    loadMonaco?: MonacoSource;
    loadTimeoutMs?: number;
    /** Keep legacy callback overrides by default; opt in to compose callbacks. */
    forwardEvents?: boolean;
  };
