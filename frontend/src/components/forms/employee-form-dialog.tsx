'use client';

import * as React from 'react';
import { Employee } from '@/types';
import { EmployeeForm } from './employee-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmployeeFormDialogProps {
  employee?: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (employee: Employee) => void;
}

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
  employee,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleSuccess = (data: Employee) => {
    if (onSuccess) {
      onSuccess(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </Button>
        <EmployeeForm employee={employee} onSuccess={handleSuccess} onCancel={onClose} />
      </div>
    </div>
  );
};
