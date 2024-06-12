import React, { useEffect, useState, useContext } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers/';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { IconButton, Typography, useMediaQuery, Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../constants';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex', 
        flexDirection: 'row',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column', // Change flex direction to column on screens smaller than xs
        },
    }, 
    dash: {
        margin: '5px 10px',
        display: 'flex', 
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
    },
    errorText: {
        color: "red",
        fontSize: 10,
    },
    dateTimePicker: {
        display: 'flex', 
        flex: 1, 
        flexDirection: 'column'
    }
}));

export default function BasicDateTimeRangePicker({ handleESave, name, calendar_id, calendar, userId, eventId }) {
    const classes = useStyles();
    const { accessToken } = useContext(AuthContext);

    const [isEditMode, setIsEditMode] = useState(true);
    const [preference, setPreference] = React.useState('HP');
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    
    const calendarStartDate = dayjs(calendar.start_date)
    const calendarEndDate =dayjs(calendar.end_date)
    
    const handlePreferenceChange = (event) => setPreference(event.target.value);
    const handleStartDateTimeChange = (dateTime) => setStartDateTime(dateTime);
    const handleEndDateTimeChange = (dateTime) => setEndDateTime(dateTime);

    const checkAllFieldsFilled = () => {
        if (startDateTime && endDateTime && preference) {
            return true;
        } else {
            return false;
        }
    }

    const handleEventSave = () => {
        if (isEditMode) {
            if (checkAllFieldsFilled() == false) {
                console.log('enter all fields')
                return
            }
            console.log('handle event save', startDateTime, endDateTime, preference, calendar_id, name, calendar);
            // Save the updated field value
            handleESave(dayjs.tz(startDateTime).format("YYYY-MM-DDTHH:mm"), dayjs.tz(endDateTime).format("YYYY-MM-DDTHH:mm"), preference, calendar_id, name); 
        }
        setIsEditMode(!isEditMode);
    };

    useEffect(() => {
        console.log('date time range picker', calendar, calendar.start_date, calendar.end_date, calendarStartDate, calendarEndDate, userId, eventId)
        // should only occur when we edit an event
        if (eventId) fetchInitialData(calendar.calendar_id, userId);
    }, [calendar, accessToken])

    const fetchInitialData = async (calendarId, userId) => {
        // '<int:calendar_id>/get_events/<int:invitee_id>/',
        try {
            const response = await axios.get(API_URL + `calendars/${calendarId}/get_events/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const eventsList = response.data.events;
            console.log(eventsList);
            const currEvent = eventsList.filter(event => event.event_id === eventId);
            console.log(currEvent[0]);
            if (currEvent.length === 1) {
                if (currEvent[0].start_time) {
                    setStartDateTime(currEvent[0].start_time);
                    console.log('start time', currEvent[0].start_time)
                }
                if (currEvent[0].end_time) {
                    setEndDateTime(currEvent[0].end_time);
                    console.log('end time', currEvent[0].end_time)
                }
                if (currEvent[0].event_type) {
                    setPreference(currEvent[0].event_type);
                    console.log('preference', currEvent[0].event_type)
                }
            }
        } catch (error) {
            console.error('Error fetching initial data: ', error)
        }
    }
    
  return (
      <div className={classes.root}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                  {isEditMode ? (
                      <div className={classes.dateTimePicker}>
                      <DateTimePicker 
                          label={"Start Date Time"}
                          value={dayjs(startDateTime) ? dayjs(dayjs.tz(startDateTime).format('YYYY-MM-DD HH:mm')): null}
                          onChange={handleStartDateTimeChange} 
                          minDate={calendarStartDate} 
                          maxDate={calendarEndDate}
                          timezone="America/New_York"
                      />
                      <Typography className={classes.errorText}>{startDateTime == null ? 'Please enter a start date time' : ""}</Typography>
                      </div>
                  ) : (
                      <DateTimePicker 
                          disabled 
                          label={startDateTime ? dayjs.tz(startDateTime).format('YYYY-MM-DD HH:mm'): "Start Date Time"}
                          onChange={handleStartDateTimeChange} 
                          minDate={calendarStartDate} 
                          maxDate={calendarEndDate}
                          timezone="America/New_York"
                      />
                  )}
              </DemoContainer>
          </LocalizationProvider>
          <Typography className={classes.dash}>-</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                  {isEditMode ? (
                      <div className={classes.dateTimePicker}>
                      <DateTimePicker 
                          label={"End Date Time"} 
                          value={dayjs.tz(endDateTime) ? dayjs.tz(endDateTime): null}
                          onChange={handleEndDateTimeChange} 
                          minDate={calendarStartDate} 
                          maxDate={calendarEndDate}
                          timezone="America/New_York"
                      />
                      <Typography className={classes.errorText}>{endDateTime == null ? 'Please enter a end date time' : startDateTime >= endDateTime ? "Please enter a end date time later than the start date time" : ""}</Typography>
                      </div>
                  ) : (
                      <DateTimePicker 
                          disabled 
                          label={endDateTime? dayjs.tz(endDateTime).format('YYYY-MM-DD HH:mm'): "End Date Time"} 
                          onChange={handleEndDateTimeChange} 
                          minDate={calendarStartDate} 
                          maxDate={calendarEndDate}
                          timezone="America/New_York"
                      />
                  )}        
              </DemoContainer>
          </LocalizationProvider>
          {isEditMode ? (
              <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel>Preference</InputLabel>
              <Select
                value={preference}
                onChange={handlePreferenceChange}
                autoWidth
                label="Preference"
              >
      
                <MenuItem value={'HP'}>HP</MenuItem>
                <MenuItem value={'LP'}>LP</MenuItem>
              </Select>
            </FormControl>
          ) : (
              <FormControl sx={{ m: 1, minWidth: 80 }} disabled>
              <InputLabel>Preference</InputLabel>
              <Select
              value={preference}
              onChange={handlePreferenceChange}
              autoWidth
              label="Preference"
              >
              <MenuItem value={'HP'}>HP</MenuItem>
              <MenuItem value={'LP'}>LP</MenuItem>
              </Select>
          </FormControl>
          )}
          <IconButton
              edge="end"
              aria-label={isEditMode ? `save` : `edit`}
              onClick={handleEventSave}
              size="large">
              <div>
              {isEditMode ? <SaveIcon /> : <EditIcon />} {/* Render SaveIcon or EditIcon based on edit mode */}
              {isEditMode && checkAllFieldsFilled() == false ? (
                  <Typography className={classes.errorText}>{'Please fill all fields'}</Typography>
              ) : (
                  <></>
              )
              }
              </div>

          </IconButton>
      </div>
  );
}
