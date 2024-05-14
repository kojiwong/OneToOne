import React from 'react';
import PrimaryAppBar from '../../components/appbar';
import InvitedCalendarsList from './invitedCalendarsList';



function Invitations() {
  return (
    <>
      <PrimaryAppBar/>
        <div style={{margin: '5px 15px'}}>
          <InvitedCalendarsList/>
        </div>
    </>
  );
}

export default Invitations;
