import { Badge } from '@/components/ui/badge';
import { EmployeeStatus } from '@/types';

interface EmployeeStatusBadgeProps {
  status: string;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return 'success';
      case EmployeeStatus.PROBATION:
        return 'warning';
      case EmployeeStatus.ON_LEAVE:
        return 'info';
      case EmployeeStatus.TERMINATED:
      case EmployeeStatus.RESIGNED:
      case EmployeeStatus.RETIRED:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return <Badge variant={getVariant(status)}>{formatStatus(status)}</Badge>;
}
