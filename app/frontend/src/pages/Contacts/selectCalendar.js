/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { calendarDatabase  } from '../../data/calendar';

export default function SelectCalendar({handleOnChange, calendarlist}) {
    // const { handleOnChange } = props;
    const [searchText, setSearchText] = useState('');

    const handleSearchTextChange = (event, value) => {
        setSearchText(value);
        handleOnChange(value); // Pass the text back to the parent component
    };
  return (
    <Autocomplete
      id="combo-box-demo"
    //   TODO: must filter out the calendars that the user is the owner of
      options={calendarlist.filter(calendar => calendar.is_finalized === false)}
      getOptionLabel={(option) => option.name}
      onChange={handleSearchTextChange}
      value={searchText}

      renderInput={(params) => <TextField {...params} label="Calendar Title" variant="outlined" />}
    />
  );
}
