import React, { useState } from 'react';
import PrimaryAppBar from '../../components/appbar';
import ManageCalendars from './manageCalendars';
import CalendarDetails from './calendarDetails';

function Calendars() {
  const [showCalendarDetails, setShowCalendarDetails] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  const showCalDetails = (calendar) => {
    setSelectedCalendar(calendar);
    setShowCalendarDetails(true);
  };

  const showManageCalendars = () => {
    setShowCalendarDetails(false);
    setSelectedCalendar(null);
  }
  console.log(selectedCalendar)
  return (
    <>
      <PrimaryAppBar/>
      {showCalendarDetails ? (
        <CalendarDetails onClick={showManageCalendars} calendar={selectedCalendar}/>
      ):(
        <ManageCalendars handleClick={showCalDetails}/>
      )}
      
    </>
  );
}

export default Calendars;



