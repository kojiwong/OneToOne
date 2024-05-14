import React, { useEffect, useState } from 'react';
import { Container, Grid, makeStyles, TextField } from '@material-ui/core';
import PrimaryAppBar from '../../components/appbar';
import CalendarList from './calendarList';
import axios from 'axios';
import { API_URL, handleCancel } from '../../constants';
import Dialog from '../../components/dialog';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';



const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

function ManageCalendars({handleClick}) {
  const classes = useStyles();
  const [unfinalizedCalendars, setUnfinalizedCalendars] = useState([]);
  const [finalizedCalendars, setFinalizedCalendars] = useState([]);
  const [calendarName, setCalendarName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // State to track save button disabled status

  const { accessToken } = useContext(AuthContext);

  console.log("calendar acess token: ", accessToken)

  useEffect(() => {
    setIsSaveDisabled(!calendarName || !deadline || !startDate || !endDate || startDate > endDate || deadline > endDate);
    const fetchCalendars = async () => {
        try {
            const response = await axios.get(API_URL + 'users/calendars/view/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
      
            const userData = response.data;
            const unfinalized = userData.calendars.filter(calendar => !calendar.is_finalized);
            console.log("unfinalized", unfinalized);
            const finalized = userData.calendars.filter(calendar => calendar.is_finalized);
            console.log("finalized", finalized);

            // Set the state with the separated calendars
            setUnfinalizedCalendars(unfinalized);
            setFinalizedCalendars(finalized);

        } catch (error) {
            console.error('Error fetching calendars: ', error);
        }
    };
    fetchCalendars();
  }, [accessToken, calendarName, deadline, startDate, endDate])

  const validateAdd = () => {
    if (!calendarName || !deadline || !startDate || !endDate || startDate > endDate || deadline > endDate || validateStartEndDate() == false) {
      return false;
    } else return true;
  }

  const handleValidationError = () => {
    // show a alert
    alert("Validation Error. Please Try Again.");
  }

  const validateStartEndDate = () => {
    console.log(endDate, startDate);
    console.log(dayjs(endDate), dayjs(startDate))
    console.log(dayjs(endDate) - dayjs(startDate))
    console.log(Date(endDate) - Date(startDate))
    console.log((dayjs(endDate) - dayjs(startDate))/ (1000 * 60 * 60 * 24))
    if ((dayjs(endDate) - dayjs(startDate))/ (1000 * 60 * 60 * 24) >= 7){
      return false
    } else return true;
  }

  const handleAddCalendar = async () => {
    try {
        console.log(calendarName, description, deadline.toString(), startDate.toString(), endDate.toString())
        const errors = [];
        // validation: start date must be before end date, [name, deadline, start_date, end_date] is non empty
        if (!calendarName) errors.push('Validation Error: calendarName must be provided')
        if (!deadline) errors.push('Validation Error: deadline must be provided')
        if (!startDate) errors.push('Validation Error: startDate must be provided')
        if (!endDate) errors.push('Validation Error: endDate must be provided')
        if (startDate > endDate) errors.push('Validation Error: startDate must be before endDate');
        if (deadline > endDate) errors.push('Validation Error: deadline must be before endDate');
        if (validateStartEndDate() == false) errors.push('Validation Error: End Date must be no more than one week from Start Date')
        if (errors.length > 0) {
          return; // Exit function if there are validation errors
      }

        const payload = {
            name: calendarName,
            description: description,
            deadline: deadline.toString(),
            start_date: startDate.toString(),
            end_date: endDate.toString()
        }
            
        const response = await axios.post(API_URL + 'calendars/create/', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('New calendar added:', response.data);
        const newCalendar = { ...response.data };
        setUnfinalizedCalendars(prevCalendars => [...prevCalendars, newCalendar]);
        
    } catch (error) {
        console.error('Error adding new calendar:', error.message, error);
        alert(error.message)
    }
};

  return (
    <>
      <Dialog
        onYes={validateAdd() == false ? handleValidationError : handleAddCalendar}
        onNo={handleCancel}
        yesText={'Save'}
        noText={'Cancel'}
        buttonText="Create New Calendar"        
        dialogQuestion="Please enter the Calendar Details"
        dialogText=""
        additionalField={
            <>
            <TextField 
                id="name" 
                label="Name" 
                variant="outlined" 
                style={{width: '100%', margin: '5px 0'}} 
                onChange={(e) => setCalendarName(e.target.value)} 
                error={!calendarName}
                helperText={!calendarName ? "Calendar name is required" : ""}
                required
            />
            <TextField 
                id="description" 
                multiline
                label="Description" 
                variant="outlined" 
                style={{width: '100%', margin: '5px 0'}} 
                onChange={(e) => setDescription(e.target.value)} 
            />
            <TextField
                id="deadline"
                label="Deadline"
                type="date"
                variant="outlined"
                style={{width: '100%', margin: '5px 0'}}
                error={!deadline || deadline > endDate}
                helperText={!deadline ? "Deadline is required" : (deadline > endDate) ? "Deadline must be before End Date" : ""}
                required
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) =>setDeadline(e.target.value)}
            />
            <TextField
                id="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                style={{width: '100%', margin: '5px 0'}}
                error={!startDate}
                helperText={!startDate ? "Start Date is required" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) =>setStartDate(e.target.value)}
                required
            />
            <TextField
                id="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                style={{width: '100%', margin: '5px 0'}}
                error={!endDate || startDate > endDate || validateStartEndDate() == false}
                helperText={!endDate ? "End Date is required" : (startDate > endDate) ? "End Date must be after Start Date": (validateStartEndDate() == false) ? "End Date must be no more than one week from Start Date" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) =>setEndDate(e.target.value)}
                required
            />
            </>
        }
      />
      <Container>
        <Grid container spacing={3} style={{ marginTop: '20px'}}>
            <Grid item xs={12} sm={6}>
                <CalendarList title={"unfinalized"} calendarlist={unfinalizedCalendars} handleClick={handleClick}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CalendarList title={"finalized"} calendarlist={finalizedCalendars} handleClick={handleClick}/>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ManageCalendars;



