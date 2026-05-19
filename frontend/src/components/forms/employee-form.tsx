'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '@/lib/api/employees';
import { employeeFormSchema, type EmployeeFormData } from '@/lib/validations/employee';
import { Employee, Department, EmploymentType, EmployeeStatus, Currency } from '@/types';
import { FormInput } from './form-input';
import { FormSelect } from './form-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: (employee: Employee) => void;
  onCancel?: () => void;
}

const departmentOptions = Object.values(Department).map((dept) => ({
  label: dept.replace(/_/g, ' '),
  value: dept,
}));

const employmentTypeOptions = Object.values(EmploymentType).map((type) => ({
  label: type.replace(/_/g, ' '),
  value: type,
}));

const statusOptions = Object.values(EmployeeStatus).map((status) => ({
  label: status.replace(/_/g, ' '),
  value: status,
}));

const currencyOptions = Object.values(Currency).map((currency) => ({
  label: currency,
  value: currency,
}));

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditMode = !!employee;
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const defaultValues: EmployeeFormData = employee
    ? {
        name: employee.name,
        email: employee.email,
        department: employee.department as Department,
        jobTitle: employee.jobTitle,
        country: employee.country,
        salary: employee.salary,
        currency: employee.currency as Currency,
        employmentType: employee.employmentType as EmploymentType,
        status: employee.status as EmployeeStatus,
        joiningDate:
          typeof employee.joiningDate === 'string'
            ? employee.joiningDate.split('T')[0]
            : new Date(employee.joiningDate).toISOString().split('T')[0],
      }
    : {
        name: '',
        email: '',
        department: Department.ENGINEERING,
        jobTitle: '',
        country: '',
        salary: 0,
        currency: Currency.USD,
        employmentType: EmploymentType.FULL_TIME,
        status: EmployeeStatus.ACTIVE,
        joiningDate: new Date().toISOString().split('T')[0],
      };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setError,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      if (isEditMode && employee) {
        return employeesApi.update(employee.id, data);
      }
      return employeesApi.create(data);
    },
    onMutate: async (newEmployee) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });

      const previousEmployees = queryClient.getQueryData(['employees']);

      if (isEditMode && employee) {
        queryClient.setQueryData(['employees'], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((emp: Employee) =>
              emp.id === employee.id ? { ...emp, ...newEmployee } : emp
            ),
          };
        });
      }

      return { previousEmployees };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }

      setSubmitStatus('error');

      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors;
        Object.keys(fieldErrors).forEach((field) => {
          setError(field as keyof EmployeeFormData, {
            type: 'server',
            message: fieldErrors[field],
          });
        });
      }

      setTimeout(() => setSubmitStatus('idle'), 3000);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSubmitStatus('success');

      setTimeout(() => {
        setSubmitStatus('idle');
        if (onSuccess) {
          onSuccess(data);
        }
        if (!isEditMode) {
          reset();
        }
      }, 1500);
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setSubmitStatus('idle');
    mutation.mutate(data);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditMode ? 'Edit Employee' : 'Create New Employee'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Update employee information below.'
              : 'Fill in the details to add a new employee to the system.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="Full Name"
            name="name"
            required
            error={errors.name?.message}
            registration={register('name')}
            placeholder="John Doe"
            autoComplete="name"
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            required
            error={errors.email?.message}
            registration={register('email')}
            placeholder="john.doe@example.com"
            autoComplete="email"
          />

          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Department"
                name="department"
                required
                error={errors.department?.message}
                options={departmentOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <FormInput
            label="Job Title"
            name="jobTitle"
            required
            error={errors.jobTitle?.message}
            registration={register('jobTitle')}
            placeholder="Software Engineer"
            autoComplete="organization-title"
          />

          <FormInput
            label="Country"
            name="country"
            required
            error={errors.country?.message}
            registration={register('country')}
            placeholder="United States"
            autoComplete="country-name"
          />

          <FormInput
            label="Salary"
            name="salary"
            type="number"
            step="0.01"
            required
            error={errors.salary?.message}
            registration={register('salary', { valueAsNumber: true })}
            placeholder="50000.00"
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Currency"
                name="currency"
                required
                error={errors.currency?.message}
                options={currencyOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Employment Type"
                name="employmentType"
                required
                error={errors.employmentType?.message}
                options={employmentTypeOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Status"
                name="status"
                required
                error={errors.status?.message}
                options={statusOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <FormInput
            label="Joining Date"
            name="joiningDate"
            type="date"
            required
            error={errors.joiningDate?.message}
            registration={register('joiningDate')}
          />
        </div>

        {submitStatus === 'error' && (
          <div
            className="flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-4 w-4" />
            <span>
              Failed to {isEditMode ? 'update' : 'create'} employee. Please check the form and try
              again.
            </span>
          </div>
        )}

        {submitStatus === 'success' && (
          <div
            className="flex items-center gap-2 rounded-md border border-green-600 bg-green-50 p-3 text-sm text-green-600"
            role="alert"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Employee {isEditMode ? 'updated' : 'created'} successfully!</span>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || (!isDirty && isEditMode)}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Employee' : 'Create Employee'}</>
            )}
          </Button>

          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}

          {!isEditMode && isDirty && (
            <Button type="button" variant="ghost" onClick={() => reset()} disabled={isSubmitting}>
              Reset Form
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
