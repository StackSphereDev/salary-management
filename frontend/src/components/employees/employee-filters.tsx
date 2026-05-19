import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Department, EmployeeStatus } from '@/types';

interface EmployeeFiltersProps {
  search: string;
  department: string;
  country: string;
  status: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  countries: string[];
}

export function EmployeeFilters({
  search,
  department,
  country,
  status,
  onSearchChange,
  onDepartmentChange,
  onCountryChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
  countries,
}: EmployeeFiltersProps) {
  const departments = Object.values(Department);
  const statuses = Object.values(EmployeeStatus);

  const formatLabel = (value: string) => {
    return value
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or job title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {formatLabel(dept)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {formatLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
