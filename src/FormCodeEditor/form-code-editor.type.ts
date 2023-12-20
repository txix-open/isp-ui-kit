import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../types/formTypes';

export type FormCodeEditorProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & {
    language?: 'javaScript' | 'JSON';
    height?: string;
    disable?: boolean;
  };
