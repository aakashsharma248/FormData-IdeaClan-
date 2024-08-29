import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  TablePagination,
  Typography
} from '@mui/material';
import { Delete, Edit, ContentCopy } from '@mui/icons-material';

interface Row {
  id: number;
  name: string;
  age: number;
  gender: string;
  department: string;
  email: string;
  salary: number;
}

interface TableComponentProps {
  data: Row[];
  updateRow: (id: number) => void;
  deleteRow: (id: number) => void;
  copyRow: (id: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ data, updateRow, deleteRow, copyRow }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Row; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Initialize with default value

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const totalSalary = useMemo(() => {
    return data.reduce((total, item) => total + Number(item.salary), 0);
  }, [data]);

  const requestSort = (key: keyof Row) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <Typography variant="h4" component="h1" align="center" style={{ marginTop: '10%' }}>
        Form Data In Tabular Format
      </Typography>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => requestSort('name')}>Name</TableCell>
              <TableCell onClick={() => requestSort('age')}>Age</TableCell>
              <TableCell onClick={() => requestSort('gender')}>Gender</TableCell>
              <TableCell onClick={() => requestSort('department')}>Department</TableCell>
              <TableCell onClick={() => requestSort('email')}>Email</TableCell>
              <TableCell onClick={() => requestSort('salary')}>Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.salary}</TableCell>
                <TableCell>
                  <IconButton onClick={() => updateRow(row.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteRow(row.id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => copyRow(row.id)}>
                    <ContentCopy />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6} align="right">Total Salary</TableCell>
              <TableCell>{totalSalary}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableComponent;
