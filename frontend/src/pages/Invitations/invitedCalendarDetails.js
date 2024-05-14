import React from 'react';
import CalendarAccordian from './calendarAccordian';


function InvitedCalendarsDetails({calendar, ownerInfo, isAccepted}) {
  return (
    <>
      <CalendarAccordian calendar={calendar} ownerInfo={ownerInfo} isAccepted={isAccepted}/>
    </>

  );
}

export default InvitedCalendarsDetails;
