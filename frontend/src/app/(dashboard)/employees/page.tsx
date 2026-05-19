import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmployeeTable } from '@/components/employees/employee-table';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employee records</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeTable />
    </div>
  );
}
