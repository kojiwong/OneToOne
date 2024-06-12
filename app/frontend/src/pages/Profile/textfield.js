import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

const CustomTextField = ({ field, value, isEditMode, handleEdit, handleUpdateField, onTextChange, handleSave }) => {
  const [textValue, setTextValue] = useState('');

  const handleChange = (event) => {
    setTextValue(event.target.value);
    onTextChange(field, event.target.value); // Call the onTextChange callback with the updated value
  };

  const handleSaveClick = (event) => {
    handleUpdateField(field);
    handleEdit(field);
    if (isEditMode(field)) {
      // Save the updated field value
      handleSave(field, event.target.value);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="textSecondary">
        {field}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          type={(field === 'Password' || field === 'Confirm Password') ? 'password' : 'text'} // Set type to 'password' for Password and Confirm Password fields
          placeholder={value}
          onChange={handleChange}
          disabled={!isEditMode(field)} // Disable TextField in view mode
        />
        <IconButton
          edge="end"
          aria-label={isEditMode(field) ? `save ${field}` : `edit ${field}`}
          onClick={handleSaveClick}
          size="large">
          {isEditMode(field) ? <SaveIcon /> : <EditIcon />} {/* Render SaveIcon or EditIcon based on edit mode */}
        </IconButton>
      </div>
    </Paper>
  );
};

export default CustomTextField;
