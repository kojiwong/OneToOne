import React, { useEffect, useContext, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { API_URL, handleCancel } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import Dialog from '../../components/dialog';
import BasicDateTimeRangePicker from './datetimerangepicker';
import dayjs from 'dayjs';
import EventInfo from './eventInfo';
import Header from './header';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export default function CalendarAccordian({calendar, ownerInfo, isAccepted}) {
  const { accessToken } = useContext(AuthContext);
  const [eventsList, setEventsList] = useState([]);
  const [checkedEvents, setCheckedEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const userResponse = await axios.get(API_URL + 'users/profile/view/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userData = userResponse.data;
        var currUserId = await getUserId(userData.email);
        setUserId(await getUserId(userData.email));
        const response = await axios.get(API_URL + `calendars/${calendar.calendar_id}/get_events/${currUserId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setEventsList(response.data.events)
      } catch (error) {
        console.error('Error fetching calendar events: ', error);
      }
    }

    fetchCalendarEvents();
  }, [accessToken]);



  const getUserId = async (email) => {
    try {
        const response = await axios.get( API_URL + `users/${email}/id/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data.user_id;
    } catch (error) {
        console.error('Error fetching user id: ', error);
        return null;
    }
  }

  const handleToggle = (event) => {
    setCheckedEvents(prevCheckedEvents => {
        const isChecked = prevCheckedEvents.some(currEvent => currEvent.event_id === event.event_id);
        if (isChecked) {
            // If event is already checked, remove it from the list
            return prevCheckedEvents.filter(currEvent => currEvent.event_id !== event.event_id);
        } else {
            // If event is not checked, add it to the list
            return [...prevCheckedEvents, event];
        }
    });
    console.log(checkedEvents)
  };

  const getSelectedEventIds = () => {
    console.log(checkedEvents)
    console.log(checkedEvents.map(event => event.event_id))
    return checkedEvents.map(event => event.event_id);
  };


  const handleAddSave = async () => {
    try {
      const response = await axios.post(API_URL + 'calendars/events/add/', newEvent, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('HANDLE ADD SAVE', response.data)
      // Update the eventsList using the previous state
      setEventsList(prevEventsList => [...prevEventsList, newEvent]);
      // refresh the page
      window.location.reload();
    } catch (error) {
      console.log('Error Saving events', error)
    }
  }
  

  const handleEditSave = async () => {
    console.log('handle edit save')
    // <int:calendar_id>/event/<int:event_id>/update/
    const selectedEventIds = getSelectedEventIds();
    console.log(selectedEventIds);
    if (selectedEventIds.length !== 1) return;
    try {
      const response = await axios.post(API_URL + `calendars/${calendar.calendar_id}/event/${selectedEventIds[0]}/update/`, newEvent, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data)
      // Update the eventsList using the previous state
      // Update the eventsList by replacing the updated event
      setEventsList(prevEventsList => {
        const updatedEventsList = [...prevEventsList];
        const index = updatedEventsList.findIndex(event => event.event_id === selectedEventIds[0]);
        if (index !== -1) {
            updatedEventsList[index] = response.data;
        }
        return updatedEventsList;
      });
      setCheckedEvents([]);
    } catch (error) {
      console.log('Error Saving events', error)
    }
  }

  const handleDeleteSave = async () => {
    console.log('handle delete save')
    // events/<int:event_id>/delete
    const selectedEventIds = getSelectedEventIds();
    console.log(selectedEventIds);
    if (selectedEventIds.length < 1) return;
    for (const eventId of selectedEventIds) {
      try {
        const response = await axios.delete(API_URL + `calendars/events/${eventId}/delete/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        console.log(response.data)
        // Update the eventsList by removing the deleted event
        setEventsList(prevEventsList => prevEventsList.filter(event => event.event_id !== eventId));
        setCheckedEvents([])
      } catch (error) {
        console.log('Error Saving events', error)
      }
    }
  }

  const handleEventSave = (startDateTime, endDateTime, preference, calendar_id, name) => {
    const newEvent = {
      start_time: startDateTime,
      end_time: endDateTime,
      event_type: preference,
      calendar: calendar_id,
      name : name,
    }
    setNewEvent(newEvent);
    console.log(newEvent)
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          {/* <div style={{display: 'flex', flex: 1}}> */}
            <Header start={calendar.name} middle={ownerInfo[calendar.owner]} end={calendar.deadline}/>
            {/* </div> */}
        </AccordionSummary>
        <AccordionActions>
        <Dialog
              maxWidth="md"
              dialogQuestion={"Please Enter Your Availability"}
              dialogText={"Also rank your preference [High Preference (HP) or Low Preference (LP)]"}
              yesText="Save"
              noText="Cancel"
              onYes={handleAddSave}
              onNo={handleCancel}
              buttonText="Add New Availability"
              additionalField={
                <>
                <BasicDateTimeRangePicker handleESave={handleEventSave} name={ownerInfo[calendar.owner]} calendar_id={calendar.calendar_id} calendar={calendar} userId={userId}/>
                </>
              }
            
            />
            {isAccepted ? (
              <Dialog
              maxWidth={getSelectedEventIds().length === 1 ? "md" : "sm"}
              dialogQuestion={getSelectedEventIds().length === 1 ? "Please Enter Your Availability" : "Please Select 1 Event to Edit"}
              dialogText={getSelectedEventIds().length === 1 ? "Also rank your preference [High Preference (HP) or Low Preference (LP)]" : ""}
              yesText={getSelectedEventIds().length === 1 ? "Save" : "Ok"}
              noText={getSelectedEventIds().length === 1 ? "Cancel": ""}
              onYes={getSelectedEventIds().length === 1 ? handleEditSave: handleCancel}
              onNo={getSelectedEventIds().length === 1 ? handleCancel: () => console.log('edit on no')}
              buttonText="Edit Selected Availability"
              additionalField={
                getSelectedEventIds().length === 1 ? (
                <>
                <BasicDateTimeRangePicker handleESave={handleEventSave} name={ownerInfo[calendar.owner]} calendar_id={calendar.calendar_id} calendar={calendar} userId={userId} eventId={getSelectedEventIds()[0]}/>
                </>
                ):(<></>)
              }
              />
            ) : (<></>)}
          {isAccepted ? (
              <Dialog
              dialogQuestion={getSelectedEventIds().length > 0 ? "Are you sure you want to delete the selected events" : "Please Select at least 1 Event to Delete"}
              dialogText={""}
              yesText={"Ok"}
              noText="Cancel"
              onYes={handleDeleteSave}
              onNo={handleCancel}
              buttonText="Delete Selected Availability"           
            />
          ) : (<></>)}
        </AccordionActions>
        <AccordionDetails>
          {isAccepted ? (
            <Header start={"Priority"} middle={"Start Time"} end={"End Time"}/>
          ) : (<></>)}
        {eventsList.map((event, index) => (
            <EventInfo 
              event={event} 
              index={index} 
              onToggle={handleToggle} 
              checked={checkedEvents.some(checkedEvent => checkedEvent.event_id === event.event_id)}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
