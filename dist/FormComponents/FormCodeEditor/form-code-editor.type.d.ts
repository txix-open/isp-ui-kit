import { FieldValues } from 'react-hook-form';
import { FormComponentProps } from '../formTypes';
export type FormCodeEditorProps<TFormValues extends FieldValues> =
  FormComponentProps<TFormValues> & {
    language?: 'javaScript' | 'JSON';
    height?: string;
    disable?: boolean;
  };
