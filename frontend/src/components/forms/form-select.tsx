import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  description?: string;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      name,
      error,
      required,
      placeholder = 'Select an option',
      options,
      value,
      onValueChange,
      disabled,
      description,
    },
    ref
  ) => {
    return (
      <FormField name={name} error={error}>
        <FormLabel required={required}>{label}</FormLabel>
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <FormMessage id={`${name}-error`} />
      </FormField>
    );
  }
);
FormSelect.displayName = 'FormSelect';
