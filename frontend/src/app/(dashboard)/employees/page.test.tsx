import { render, screen } from '@testing-library/react';
import EmployeesPage from './page';

describe('EmployeesPage', () => {
  it('should render the page title', () => {
    render(<EmployeesPage />);

    const heading = screen.getByRole('heading', { name: /employees/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should render the page description', () => {
    render(<EmployeesPage />);

    const description = screen.getByText(/manage your employee records/i);
    expect(description).toBeInTheDocument();
  });

  it('should render the Add Employee button', () => {
    render(<EmployeesPage />);

    const addButton = screen.getByRole('button', { name: /add employee/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should render the Add Employee button with Plus icon', () => {
    render(<EmployeesPage />);

    const addButton = screen.getByRole('button', { name: /add employee/i });
    const icon = addButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render the Employee List card', () => {
    render(<EmployeesPage />);

    const cardTitle = screen.getByRole('heading', { name: /employee list/i });
    expect(cardTitle).toBeInTheDocument();
  });

  it('should render placeholder text for employee list', () => {
    render(<EmployeesPage />);

    const placeholder = screen.getByText(/employee list will be displayed here/i);
    expect(placeholder).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<EmployeesPage />);

    const mainDiv = container.querySelector('.space-y-6');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render header section with flex layout', () => {
    const { container } = render(<EmployeesPage />);

    const headerSection = container.querySelector('.flex.items-center.justify-between');
    expect(headerSection).toBeInTheDocument();
  });
});
