import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = event => {
    const value = event.target.value;
    setQuery(value);
    // Trigger search on each change
    onSearch(value);
  };

  return (
    <form style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        label="Search"
        value={query}
        onChange={handleChange}
        variant="outlined"
        style={{ flex: 1, marginRight: '8px' }}
      />
      <IconButton type="submit" aria-label="search" size="large">
        <SearchIcon />
      </IconButton>
    </form>
  );
}

export default SearchBar;
