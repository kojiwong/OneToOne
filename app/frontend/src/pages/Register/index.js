import React, { useState } from 'react';
import axios from 'axios';
import {API_URL} from '../../constants';
import login from './login.jpg';

function Register() {
  const [username, setUsername] = useState('');
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorUsernameMessage, setErrorUsernameMessage] = useState('');
  const [errorFirstnameMessage, setErrorFirstnameMessage] = useState('');
  const [errorLastnameMessage, setErrorLastnameMessage] = useState('');
  const [errorEmailMessage, setErrorEmailMessage] = useState('');
  const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
  const [errorConfirmPasswordMessage, setErrorConfirmPasswordMessage] = useState('');
  const [errorPasswordNotSameMessage, setErrorPasswordNotSameMessage] = useState('');

  const handleSignUp = () => {
    setErrorUsernameMessage('');
    setErrorFirstnameMessage('');
    setErrorLastnameMessage('');
    setErrorEmailMessage('');
    setErrorPasswordMessage('');
    setErrorConfirmPasswordMessage('');
    setErrorPasswordNotSameMessage('');
    if (username === '') {
      setErrorUsernameMessage('Please enter username.');
    }    
    if (first_name === '') {
      setErrorFirstnameMessage('Please enter first name.');
    }
    if (last_name === '') {
      setErrorLastnameMessage('Please enter last name.');
    }

    if (email === '' || email.indexOf('@') === -1) {
      setErrorEmailMessage('Please enter a valid email address.');
    }

    if (password === '') {
      setErrorPasswordMessage('Please enter password.');
    }

    if (confirmPassword === '') {
      setErrorConfirmPasswordMessage('Please confirm password.');
    }

    if (password !== confirmPassword) {
      setErrorPasswordNotSameMessage('Passwords do not match.');
    }

    if (username !== '' &&first_name !== '' &&last_name !== '' && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
      // Send a POST request to your backend API for user registration
      
      axios.post(API_URL + 'users/register/', { username, first_name, last_name, email, "password1": password, "password2": confirmPassword })
        .then(response => {
          // Handle successful registration
          console.log('Registration successful:', response.data);
          // Redirect the user to the login page or perform other actions
          window.location.href = '/login';
        })
        .catch(error => {
          // Handle registration error
          console.error('Registration error:', error.response.data);
          // Display error message to the user
          alert('Registration failed. Please try again.');
        });
    }
  };

  return (
    <div className="relative overflow-hidden bg-cover bg-no-repeat" style={{ backgroundPosition: '50%', backgroundImage: `url(${login})`, height: '100vh' }}>
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
        <div className="flex h-full items-center justify-center items-center justify-items-stretch">
          <div className="px-6 text-center text-white md:px-12 flex flex-col" style={{ borderRadius: '8%', padding: '4rem' }}>
            <h1 className="mb-6 text-4xl font-bold">Join Us Today!</h1>
            <form style={{ color: 'black' }}>
              <input id="username" aria-label="Enter your username" type="text" placeholder=" Username" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                
                <p className="error" style={{ display: errorUsernameMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorUsernameMessage}</p>
              <input id="first_name" aria-label="Enter your first name" type="text" placeholder=" First Name" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={first_name} onChange={(e) => setFirstname(e.target.value)} /><br />
                
                <p className="error" style={{ display: errorFirstnameMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorFirstnameMessage}</p>
              <input id="last_name" aria-label="Enter your last name" type="text" placeholder=" Last Name" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={last_name} onChange={(e) => setLastname(e.target.value)} /><br />
                <p className="error" style={{ display: errorLastnameMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorLastnameMessage}</p>

              <input id="email" aria-label="Enter your email address" type="email" placeholder=" Email Address" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                <p className="error" style={{ display: errorEmailMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorEmailMessage}</p>

              <input id="password" aria-label="Enter your password" type="password" placeholder=" Password" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                <p className="error" style={{ display: errorPasswordMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorPasswordMessage}</p>

              <input id="confirmPassword" aria-label="Confirm your password" type="password" placeholder=" Confirm Password" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br />
                <p className="error" style={{ display: errorConfirmPasswordMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorConfirmPasswordMessage}</p>
                <p className="error" style={{ display: errorPasswordNotSameMessage !== '' ? 'block' : 'none', color: 'yellow' }}>{errorPasswordNotSameMessage}</p>
              <button id="signupButton" type="button" className="inline-block rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10" data-te-ripple-init data-te-ripple-color="light" onClick={handleSignUp}>Register Now</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
