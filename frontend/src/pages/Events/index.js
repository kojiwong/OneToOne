import axios from 'axios';
import { useParams } from "react-router-dom";
import { API_URL } from '../../constants';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PrimaryAppBar from '../../components/appbar';

import Calendar from "./calendar"
import StatusCard from './statusCard';
import { Grid } from '@material-ui/core';

const Events = ({ calendar })  => {
  const { accessToken } = useContext(AuthContext);
  const { calendarId } = useParams();
  const [calendarInfo, setCalendarInfo] = useState("");
  const [suggestedEvents, setSuggestedEvents] = useState([])

  useEffect(() => {
    // getCalendarInfo();
    setCalendarInfo(calendar)
  }, [accessToken])


  return (
    <>
    <PrimaryAppBar/>
    <div className="m-8">
      <Grid container spacing={3}>
        <Grid item xs={2} sm={2}>
          <StatusCard calendar={calendarId}/>
        </Grid>
        <Grid item xs={10} sm={10}>
          <Calendar calendarId={calendarId} suggestedEvents={suggestedEvents}></Calendar>
        </Grid>
      </Grid>
    </div>
    
    
    </>
  );
}

export default Events;
