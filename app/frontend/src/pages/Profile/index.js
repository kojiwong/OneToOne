import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PrimaryAppBar from '../../components/appbar';
import CustomTextField from './textfield';
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
import axios from 'axios';
import { API_URL } from '../../constants';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';



function Profile() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorEmailMessage, setErrorEmailMessage] = useState('');
  const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
  const [errorConfirmPasswordMessage, setErrorConfirmPasswordMessage] = useState('');
  const [errorPasswordNotSameMessage, setErrorPasswordNotSameMessage] = useState('');
  const [editMode, setEditMode] = useState({
    username: false,
    first_name: false,
    last_name: false,
    email: false,
    password1: false,
    password2: false,
  });
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL + 'users/profile/view/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userData = response.data;
        setUsername(userData.username);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchData();
  }, [accessToken]);
  

  const handleSave = async () => {
    // Prepare payload for updating user profile
    const payload = {
      email: email,
      first_name: firstName,
      last_name: lastName,
    };

    // Only include passwords in payload if they are provided and match
    if (password1 === password2 && password1.length >= 8) {
      payload.password1 = password1;
      payload.password2 = password2;
    }

    if (email!== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorEmailMessage('Please enter a valid email address.');
      return; 
    } else {
      setErrorEmailMessage(''); 
    }

    if (password1!== '' && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password1)) {
      setErrorPasswordMessage('Please enter a valid password.');
      return; 
    } else {
      setErrorPasswordMessage(''); 
    }

    if (password1 !== password2) {
      setErrorPasswordNotSameMessage('Passwords do not match.');
      return;
    }else{
      setErrorPasswordNotSameMessage('');
    }

    // Send POST request to update user profile
    try {
      const response = await axios.post(API_URL + 'users/profile/edit/', payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating user profile:', error.response.data);
        // alert('Invalid. Please try again.');
      // Optionally, handle errors and show error message
    }
  };


  // Update handlers
  const handleUpdateField = (field) => {
    console.log(`Update ${field} clicked`);
  };

  const handleEdit = (field) => {
    setEditMode(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const handleValueChange = (field, value) => {
    console.log(`Update ${field} to ${value}`);
    if (field === 'Username') {
      setUsername(value);
    } else if (field === 'First Name') {
      setFirstName(value);
    } else if (field === 'Last Name') {
      setLastName(value);
    } else if (field === 'Email') {
      setEmail(value);
    } else if (field === 'Password') {
      setPassword1(value);
    } else if (field === 'Confirm Password') {
      setPassword2(value);
    }
  };

  const isEditMode = (field) => editMode[field];

  return (
    <>
      <PrimaryAppBar />
      <Paper sx={{ maxWidth: 600, margin: 'auto', mt: 2, p: 2 }}>
        <div style={{margin: '40px 40px'}}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Details and information about the user.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <div style={{ marginBottom: '40px' }} />
          <Typography variant="subtitle2" gutterBottom>
                Username
              </Typography>
            <TextField 
              field="Username" 
              value={username} 
              fullWidth
              InputProps = {{readOnly: true,}}        
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField 
              field="First Name" 
              value={firstName} 
              isEditMode={isEditMode} 
              handleEdit={handleEdit} 
              handleUpdateField={handleUpdateField}
              onTextChange={handleValueChange}
              handleSave={handleSave}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField 
              field="Last Name" 
              value={lastName} 
              isEditMode={isEditMode} 
              handleEdit={handleEdit} 
              handleUpdateField={handleUpdateField}
              onTextChange={handleValueChange}
              handleSave={handleSave}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField 
              field="Email" 
              value={email} 
              isEditMode={isEditMode} 
              handleEdit={handleEdit} 
              handleUpdateField={handleUpdateField}
              onTextChange={handleValueChange}
              handleSave={handleSave}
            />
          <p className="error" style={{ display: errorEmailMessage !== '' ? 'block' : 'none', color: 'red' }}>{errorEmailMessage}</p>

          </Grid>
          <Grid item xs={6}>
            <CustomTextField 
              field="Password" 
              value={password1} 
              isEditMode={isEditMode} 
              handleEdit={handleEdit} 
              handleUpdateField={handleUpdateField}
              onTextChange={handleValueChange}
              handleSave={handleSave}
            />
           <p className="error" style={{ display: errorPasswordMessage !== '' ? 'block' : 'none', color: 'red' }}>{errorPasswordMessage}</p>

          </Grid>
          <Grid item xs={6}>
            <CustomTextField 
              field="Confirm Password" 
              value={password2} 
              isEditMode={isEditMode} 
              handleEdit={handleEdit} 
              handleUpdateField={handleUpdateField}
              onTextChange={handleValueChange}
              handleSave={handleSave}
            />
             <p className="error" style={{ display: errorConfirmPasswordMessage !== '' ? 'block' : 'none', color: 'red' }}>{errorConfirmPasswordMessage}</p>
          </Grid>
          <p className="error" style={{ display: errorPasswordNotSameMessage !== '' ? 'block' : 'none', color: 'red' }}>{errorPasswordNotSameMessage}</p>
        </Grid>
        </div>
      </Paper>
    </>
  );
}

export default Profile;