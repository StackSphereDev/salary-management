import { Users } from 'lucide-react';

interface EmployeeTableEmptyProps {
  hasFilters?: boolean;
}

export function EmployeeTableEmpty({ hasFilters = false }: EmployeeTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasFilters ? 'No employees found' : 'No employees yet'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your filters to find what you are looking for.'
          : 'Get started by adding your first employee.'}
      </p>
    </div>
  );
}
