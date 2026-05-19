import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldContextValue {
  id: string;
  name: string;
  error?: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined);

const useFormField = () => {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormField must be used within FormField');
  }
  return context;
};

interface FormFieldProps {
  name: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField = ({ name, error, children }: FormFieldProps) => {
  const id = React.useId();

  return (
    <FormFieldContext.Provider value={{ id, name, error }}>
      <div className="space-y-2">{children}</div>
    </FormFieldContext.Provider>
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const { id, error } = useFormField();

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-destructive',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
});
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const body = error || children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { useFormField };
