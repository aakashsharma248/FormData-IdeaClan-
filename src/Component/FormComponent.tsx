import React, { useState, useEffect } from 'react';
import { Row } from '../App';
import { TextField, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, SelectChangeEvent } from '@mui/material';

type FormComponentProps = {
  addRow: (data: Omit<Row, 'id'>) => void;
  updateRow: (id: number, data: Omit<Row, 'id'>) => void;
  currentEditRow: Row | null;
};

// FormData type should be the same as Row excluding 'id'
type FormData = Omit<Row, 'id'>;

const FormComponent: React.FC<FormComponentProps> = ({ addRow, updateRow, currentEditRow }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: 0,
    gender: '',
    department: '',
    email: '',
    salary: 0,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (currentEditRow) {
      // Set form data to the selected row for editing
      const { id, ...editData } = currentEditRow; // exclude 'id' when setting form data
      setFormData(editData);
    } else {
      setFormData({ name: '', age: 0, gender: '', department: '', email: '', salary: 0 });
    }
  }, [currentEditRow]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    > | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: name === 'age' || name === 'salary' ? Number(value) : value,
    });
  };

  const validate = () => {
    let tempErrors: Partial<FormData | any> = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.age || isNaN(formData.age)) tempErrors.age = "Valid age is required";
    if (!formData.gender) tempErrors.gender = "Gender selection is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      if (currentEditRow) {
        updateRow(currentEditRow.id, formData as Omit<Row, 'id'>);   // Update the row with the current id
      } else {
        addRow(formData); // Add new row
      }
      setFormData({ name: '', age: 0, gender: '', department: '', email: '', salary: 0 });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        error={!!errors.age}
        helperText={errors.age}
        fullWidth
        margin="normal"
        type="number"
      />
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
        {errors.gender && <div style={{ color: "red", marginTop: "-10px" }}>{errors.gender}</div>}
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Select
          name="department"
          value={formData.department}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Department</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        margin="normal"
        type="email"
      />
      <TextField
        label="Salary"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {currentEditRow ? 'Update' : 'Submit'}
      </Button>
    </form>
  );
};

export default FormComponent;
