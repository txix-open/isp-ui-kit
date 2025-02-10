import { Control } from 'react-hook-form';

export interface FormArrayMapProps {
  name: string;
  control: Control<any>;
  label?: string;
  controlClassName: string;
}
