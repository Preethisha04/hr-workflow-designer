export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}
