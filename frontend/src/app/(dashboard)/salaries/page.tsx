import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SalariesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Salaries</h1>
        <p className="text-muted-foreground">View and manage salary information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Salary data will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
