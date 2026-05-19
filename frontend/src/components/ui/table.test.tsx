import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

describe('Table Components', () => {
  describe('Table', () => {
    it('should render a table element', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table className="custom-class">
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('custom-class');
    });

    it('should be wrapped in a scrollable div', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      const wrapper = container.querySelector('.overflow-auto');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('TableHeader', () => {
    it('should render a thead element', () => {
      const { container } = render(
        <table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );

      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableHeader className="custom-header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );

      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('custom-header');
    });
  });

  describe('TableBody', () => {
    it('should render a tbody element', () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>
      );

      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableBody className="custom-body">
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>
      );

      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('custom-body');
    });
  });

  describe('TableFooter', () => {
    it('should render a tfoot element', () => {
      const { container } = render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>
      );

      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableFooter className="custom-footer">
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>
      );

      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toHaveClass('custom-footer');
    });
  });

  describe('TableRow', () => {
    it('should render a tr element', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Row</td>
            </TableRow>
          </tbody>
        </table>
      );

      const tr = container.querySelector('tr');
      expect(tr).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow className="custom-row">
              <td>Row</td>
            </TableRow>
          </tbody>
        </table>
      );

      const tr = container.querySelector('tr');
      expect(tr).toHaveClass('custom-row');
    });
  });

  describe('TableHead', () => {
    it('should render a th element', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header Cell</TableHead>
            </tr>
          </thead>
        </table>
      );

      const th = screen.getByText('Header Cell');
      expect(th).toBeInTheDocument();
      expect(th.tagName).toBe('TH');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead className="custom-head">Header</TableHead>
            </tr>
          </thead>
        </table>
      );

      const th = container.querySelector('th');
      expect(th).toHaveClass('custom-head');
    });
  });

  describe('TableCell', () => {
    it('should render a td element', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell Content</TableCell>
            </tr>
          </tbody>
        </table>
      );

      const td = screen.getByText('Cell Content');
      expect(td).toBeInTheDocument();
      expect(td.tagName).toBe('TD');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell className="custom-cell">Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );

      const td = container.querySelector('td');
      expect(td).toHaveClass('custom-cell');
    });
  });

  describe('TableCaption', () => {
    it('should render a caption element', () => {
      render(
        <table>
          <TableCaption>Table Caption</TableCaption>
          <tbody>
            <tr>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      );

      const caption = screen.getByText('Table Caption');
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe('CAPTION');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableCaption className="custom-caption">Caption</TableCaption>
          <tbody>
            <tr>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      );

      const caption = container.querySelector('caption');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Complete Table Structure', () => {
    it('should render a complete table with all components', () => {
      render(
        <Table>
          <TableCaption>Employee Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Developer</TableCell>
              <TableCell>$80,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Designer</TableCell>
              <TableCell>$75,000</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total: 2 employees</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Employee Table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Total: 2 employees')).toBeInTheDocument();
    });
  });
});
