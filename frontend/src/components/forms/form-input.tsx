import * as React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  registration?: Partial<UseFormRegisterReturn>;
  description?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, error, required, registration, description, className, ...props }, ref) => {
    return (
      <FormField name={name} error={error}>
        <FormLabel required={required}>{label}</FormLabel>
        <Input
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          className={className}
          {...registration}
          {...props}
        />
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <FormMessage id={`${name}-error`} />
      </FormField>
    );
  }
);
FormInput.displayName = 'FormInput';
