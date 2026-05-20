import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeesPage from './page';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('EmployeesPage', () => {
  it('should render the page title', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const heading = screen.getByRole('heading', { name: /employees/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should render the page description', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const description = screen.getByText(/manage your employee records/i);
    expect(description).toBeInTheDocument();
  });

  it('should render the Add Employee button', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should render the Add Employee button with Plus icon', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    const icon = addButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<EmployeesPage />, { wrapper: createWrapper() });

    const mainDiv = container.querySelector('.space-y-6');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render header section with flex layout', () => {
    const { container } = render(<EmployeesPage />, { wrapper: createWrapper() });

    const headerSection = container.querySelector('.flex.items-center.justify-between');
    expect(headerSection).toBeInTheDocument();
  });

  it('should open employee form dialog when Add Employee button is clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    await user.click(addButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should display employee form in dialog after clicking Add Employee', async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    await user.click(addButton);

    const formTitle = screen.getByText(/add employee/i);
    expect(formTitle).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    await user.click(addButton);

    const closeButton = screen.getByLabelText(/close dialog/i);
    await user.click(closeButton);

    const dialog = screen.queryByRole('dialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('should close dialog when clicking outside the form', async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    await user.click(addButton);

    const dialogBackdrop = screen.getByRole('dialog');
    await user.click(dialogBackdrop);

    const dialog = screen.queryByRole('dialog');
    expect(dialog).not.toBeInTheDocument();
  });
});
