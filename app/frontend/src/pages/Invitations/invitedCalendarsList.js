import React, { useEffect, useContext, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import axios from 'axios';
import { API_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import InvitedCalendarsDetails from './invitedCalendarDetails';
import FinalizedCalendarDetails from './finalizedCalendarDetails';
import Header from './header';

function InvitedCalendarsList() {
    const { accessToken } = useContext(AuthContext);
    const [unacceptedInvitedCalendars, setUnacceptedInvitedCalendars] = useState([]);
    const [acceptedInvitedCalendars, setAcceptedInvitedCalendars] = useState([]);
    const [unacceptedOwnerInfo, setUnacceptedOwnerInfo] = useState({});
    const [acceptedOwnerInfo, setAcceptedOwnerInfo] = useState({});
    const [finalizedCalendars, setFinalizedCalendars] = useState([]);
    const [finalizedOwnerInfo, setFinalizedOwnerInfo] = useState({});

    useEffect(() => {
        fetchUnacceptedInvitedCalendars();
        fetchAcceptedInvitedCalendars();
        fetchFinalizedCalendars();
      }, [accessToken])
      
    const fetchUnacceptedInvitedCalendars = async () => {
        try {
            const response = await axios.get( API_URL + 'users/invitedcalendars/view/unaccepted/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log(response);
            setUnacceptedInvitedCalendars(response.data)
            var ownerIds = {}
            for (const calendar of response.data) {
              var ownerId = calendar.owner
              var ownerInf = await getUserNameEmailById(ownerId);
              ownerIds[ownerId] = ownerInf;
            }
            setUnacceptedOwnerInfo(ownerIds)
            console.log('unaccepted OWNERINFO', ownerIds)
        } catch (error) {
            console.error('Error fetching invited calendars: ', error);
        }
  }

  const fetchAcceptedInvitedCalendars = async () => {
    try {
        const response = await axios.get( API_URL + 'users/invitedcalendars/view/accepted/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(response);
        setAcceptedInvitedCalendars(response.data)
        var ownerIds = {}
        for (const calendar of response.data) {
          var ownerId = calendar.owner
          var ownerInf = await getUserNameEmailById(ownerId);
          ownerIds[ownerId] = ownerInf;
        }
        setAcceptedOwnerInfo(ownerIds)
        console.log('accepted OWNERINFO', ownerIds)
    } catch (error) {
        console.error('Error fetching invited calendars: ', error);
    }
}
const fetchFinalizedCalendars = async () => {
  try {
      const response = await axios.get( API_URL + 'users/invitedcalendars/view/finalized/', {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      })
      console.log("finalized calendar", response);
      setFinalizedCalendars(response.data)
      var ownerIds = {}
      for (const calendar of response.data) {
        var ownerId = calendar.owner
        var ownerInf = await getUserNameEmailById(ownerId);
        ownerIds[ownerId] = ownerInf;
      }
      setAcceptedOwnerInfo(ownerIds)
      console.log('accepted OWNERINFO', ownerIds)
  } catch (error) {
      console.error('Error fetching invited calendars: ', error);
  }
}

    
  const getUserNameEmailById = async (userId) => {
    try {
      const response = await axios.get(API_URL + `users/${userId}/nameAndEmail`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(response);
      return `${response.data.name}, ${response.data.email}`
    } catch (error) {
      console.error('Error getting user name and email by id: ', error);
      return
    }
  }

  return (
    <>
    <Paper style={{margin: '15px 2px'}}>
      <Typography variant='h5' style={{margin: '20px 10px'}}>Unaccepted Invitations</Typography>
      <Header start={"Calendars"} middle={"From"} end={"Deadline"}/>
          {unacceptedInvitedCalendars.map((calendar) => (
            <>
            <InvitedCalendarsDetails calendar={calendar} ownerInfo={unacceptedOwnerInfo} isAccepted={false}/>
            </>
          ))}
    </Paper>
    <Paper style={{margin: '15px 2px'}}>
      <Typography variant='h5' style={{margin: '20px 10px'}}>Accepted Invitations</Typography>
      <Header start={"Calendars"} middle={"From"} end={"Deadline"}/>
          {acceptedInvitedCalendars.map((calendar) => (
            <Paper style={{margin: '10px 2px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}}>
            <InvitedCalendarsDetails calendar={calendar} ownerInfo={acceptedOwnerInfo} isAccepted={true}/>
            </Paper>
          ))}
      </Paper>
      <Paper style={{margin: '15px 2px'}}>
      <Typography variant='h5' style={{margin: '20px 10px'}}>Finalized Calendars</Typography>
      <Header start={"Calendars"} middle={"Start time"} end={"End time"}/>
          {finalizedCalendars.map((calendar) => (
            <>
            <FinalizedCalendarDetails calendar={calendar}/>
            </>
          ))}
    </Paper>
    </>
  );
}

export default InvitedCalendarsList;
