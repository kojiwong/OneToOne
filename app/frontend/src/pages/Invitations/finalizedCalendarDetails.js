import React, { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { API_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';
import Header from './header';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const useStyles = makeStyles((theme) => ({
  centerGrid: {
    display: 'flex', 
    justifyContent: 'center'
  }
}))

function FinalizedCalendarDetails({calendar}) {
    const classes = useStyles();
    const { accessToken } = useContext(AuthContext);
    const [eventsList, setEventsList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [finalEvent, setFinalEvent] = useState(null);
    useEffect(() => {
        fetchCalendarEvents();
        // Add any additional logic you want to perform after eventsList changes
      }, [accessToken]); // Include rerender in the dependencies array
    
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
          setEventsList(response.data.events);
          if (response.data.events.length > 0) setFinalEvent(response.data.events[0]);
          // setFinalEvent(eventsList[0]);
        } catch (error) {
          console.error('Error fetching calendar events: ', error);
        }
      }
    
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
      console.log("calendar finalized", calendar);
    //   console.log(eventsList[0])
      console.log(finalEvent)
      if (finalEvent) {
        var startDate = dayjs.tz(finalEvent.start_time).format('YYYY-MM-DD');
        var startTime = dayjs.tz(finalEvent.start_time).format('HH:mm');

        var endDate = dayjs.tz(finalEvent.end_time).format('YYYY-MM-DD');
        var endTime = dayjs.tz(finalEvent.end_time).format('HH:mm');

        console.log(startDate, startTime);
        console.log(endDate, endTime);
      }
      return (
        <div>
            <div style={{display: 'flex', flex: 1}}>
              {finalEvent ? (
                <Header start={calendar.name} middle={`${startDate} ${startTime}`} end={`${endDate} ${endTime}`}/>
              ) : (<></>)}
            </div>
        </div>
      );
    }

export default FinalizedCalendarDetails;