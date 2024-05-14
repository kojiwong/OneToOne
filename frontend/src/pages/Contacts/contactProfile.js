import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PrimaryAppBar from '../../components/appbar';
import axios from 'axios';
import { API_URL } from '../../constants';
// import { useAuth } from "../../hooks/useAuth";
import { Button } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';


function ContactProfile({contactId, contactEmail, onClick}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    //   const { accessToken } = useAuth();
    const { logout, refreshToken, accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, [accessToken, contactId, contactEmail]);
    
    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL + `users/${contactId}/profile/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
            });
            const userData = response.data;
            console.log(userData);
            const [firstName, lastName] = userData.name.split(" ");
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(userData.email);
        } catch (error) {
            console.error('Error fetching contact profile:', error);
        }
        };
  

  return (
    <>
      <Paper style={{display: 'flex', justifyContent: 'center'}} sx={{ maxWidth: 600, margin: 'auto', mt: 2, p: 2 }}>
        <div style={{margin: '0 40px'}}>
        <Typography variant="h5" gutterBottom>
          Contact Profile
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Details and information about the user.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Name: {firstName} {lastName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Email: {email}</Typography>
          </Grid>
        </Grid>
        <Button onClick={onClick}>tap to go back</Button>
        </div>
      </Paper>
    </>
  );
}

export default ContactProfile;