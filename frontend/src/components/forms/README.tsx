/**
 * Employee Form Components
 *
 * A comprehensive form system for creating and editing employees with:
 * - React Hook Form integration
 * - Zod validation
 * - Reusable form fields
 * - Optimistic UI updates
 * - Proper error handling
 * - Accessible form design (ARIA labels, keyboard navigation, screen reader support)
 *
 * USAGE EXAMPLES:
 *
 * 1. Basic Create Form:
 * ```tsx
 * import { EmployeeForm } from '@/components/forms';
 *
 * function CreateEmployeePage() {
 *   const router = useRouter();
 *
 *   return (
 *     <EmployeeForm
 *       onSuccess={(employee) => {
 *         console.log('Created:', employee);
 *         router.push('/employees');
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * 2. Edit Form:
 * ```tsx
 * import { EmployeeForm } from '@/components/forms';
 * import { useQuery } from '@tanstack/react-query';
 * import { employeesApi } from '@/lib/api/employees';
 *
 * function EditEmployeePage({ employeeId }: { employeeId: string }) {
 *   const { data: employee, isLoading } = useQuery({
 *     queryKey: ['employees', employeeId],
 *     queryFn: () => employeesApi.getById(employeeId),
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!employee) return <div>Employee not found</div>;
 *
 *   return (
 *     <EmployeeForm
 *       employee={employee}
 *       onSuccess={(updated) => {
 *         console.log('Updated:', updated);
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * 3. With Dialog/Modal:
 * ```tsx
 * import { EmployeeFormDialog } from '@/components/forms/employee-form-dialog';
 *
 * function EmployeeList() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Add Employee</Button>
 *
 *       <EmployeeFormDialog
 *         isOpen={isOpen}
 *         employee={selectedEmployee}
 *         onClose={() => {
 *           setIsOpen(false);
 *           setSelectedEmployee(undefined);
 *         }}
 *         onSuccess={(employee) => {
 *           console.log('Success:', employee);
 *         }}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * 4. Custom Form Fields (Reusable):
 * ```tsx
 * import { FormInput, FormSelect } from '@/components/forms';
 * import { useForm } from 'react-hook-form';
 *
 * function CustomForm() {
 *   const { register, control, formState: { errors } } = useForm();
 *
 *   return (
 *     <form>
 *       <FormInput
 *         label="Name"
 *         name="name"
 *         required
 *         error={errors.name?.message}
 *         registration={register('name')}
 *       />
 *
 *       <Controller
 *         name="department"
 *         control={control}
 *         render={({ field }) => (
 *           <FormSelect
 *             label="Department"
 *             name="department"
 *             options={[
 *               { label: 'Engineering', value: 'ENGINEERING' },
 *               { label: 'Sales', value: 'SALES' }
 *             ]}
 *             value={field.value}
 *             onValueChange={field.onChange}
 *           />
 *         )}
 *       />
 *     </form>
 *   );
 * }
 * ```
 *
 * FEATURES:
 *
 * ✅ React Hook Form - Performant form state management
 * ✅ Zod Validation - Type-safe schema validation
 * ✅ Optimistic Updates - Immediate UI feedback with rollback on error
 * ✅ Error Handling - Field-level and form-level error display
 * ✅ Accessibility - ARIA labels, keyboard navigation, screen reader support
 * ✅ Reusable Components - FormInput, FormSelect can be used independently
 * ✅ Loading States - Visual feedback during submission
 * ✅ Success/Error Messages - User-friendly status notifications
 * ✅ Auto-complete - Browser autocomplete hints for better UX
 * ✅ Validation on Blur - Validates fields when user leaves them
 * ✅ Dirty State Tracking - Detects unsaved changes
 * ✅ Reset Functionality - Clear form or restore to defaults
 *
 * VALIDATION RULES:
 *
 * - Name: 2-100 chars, letters/spaces/hyphens/apostrophes only
 * - Email: Valid email format, max 255 chars
 * - Job Title: 2-100 chars
 * - Country: 2-100 chars
 * - Salary: Positive number, max 10M, up to 2 decimal places
 * - Joining Date: Cannot be in the future
 * - All enum fields: Must be valid enum values
 */

export {};
