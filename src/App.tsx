import React, { useState, useCallback } from 'react';
import FormComponent from './Component/FormComponent';
import TableComponent from './Component/TableComponent';
import { Container, Typography } from '@mui/material';

// Define Row and FormData types in App.tsx for consistency
export type Row = {
  id: number;
  name: string;
  age: number;
  gender: string;
  department: string;
  email: string;
  salary: number;
};

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: 'Aakash Sharma', age: 23, gender: 'male', department: 'Engineering', email: 'aakash@example.com', salary: 5000 },
    { id: 2, name: 'Jane Smith', age: 34, gender: 'female', department: 'Finance', email: 'jane@example.com', salary: 4000 },
  ]);

  const [currentEditRow, setCurrentEditRow] = useState<Row | null>(null);

  const addRow = useCallback((data: Omit<Row, 'id'>) => {
    setRows((prevRows) => [...prevRows, { ...data, id: prevRows.length + 1 }]);
  }, []);

  const updateRow = useCallback((id: number, updatedData: Omit<Row, 'id'>) => {
    setRows((prevRows) => 
      prevRows.map(row => (row.id === id ? { ...row, ...updatedData } : row))
    );
    setCurrentEditRow(null); // Reset editing state after updating
  }, []);

  const deleteRow = useCallback((id: number) => {
    setRows((prevRows) => prevRows.filter(row => row.id !== id));
  }, []);

  const copyRow = useCallback((id: number) => {
    const rowToCopy = rows.find(row => row.id === id);
    if (rowToCopy) {
      const newRow = { ...rowToCopy, id: rows.length + 1 };
      setRows((prevRows) => [...prevRows, newRow]);
    }
  }, [rows]);

  const handleEdit = (id: number) => {
    const rowToEdit = rows.find(row => row.id === id);
    setCurrentEditRow(rowToEdit || null); // Set the entire row without modifying the id
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" style={{ marginTop: '2%' }}>
        React Form Validation App
      </Typography>
      <FormComponent addRow={addRow} updateRow={updateRow} currentEditRow={currentEditRow} />
      <TableComponent data={rows} updateRow={handleEdit} deleteRow={deleteRow} copyRow={copyRow} />
    </Container>
  );
};

export default App;
