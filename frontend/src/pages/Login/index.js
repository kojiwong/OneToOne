import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import {API_URL} from '../../constants';
import signup from './signup.jpeg';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Perform validation on the email and password fields
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // Make a POST request to your backend API to authenticate the user
    axios.post(API_URL + 'users/login/', { username, password })
      .then(response => {
        // Handle successful login
        // Save tokens to local storage
        login(response.data.access, response.data.refresh)
        // Navigate to the home page
        window.location.href = '/calendars';
      })
      .catch(error => {
        // Handle login error
        console.error('Login error:', error.response.data);
        // Display error message to the user
        alert('Invalid username or password. Please try again.');
      });
  };

  return (
    <div style={{ backgroundImage: `url(${signup})`, backgroundPosition: 'center', backgroundSize: 'cover', height: '100vh' }}>
      <div className="relative overflow-hidden bg-cover bg-no-repeat" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', height: '100%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 text-center text-white md:px-12 flex flex-col" style={{ borderRadius: '10%', padding: '1rem' }}>
            <h1 className="mb-6 text-4xl font-bold">Log In</h1>
            <form action="#" style={{ color: 'black' }}>
              <input id="username" aria-label="Enter your username" type="username" placeholder=" Username" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
              <input id="password" aria-label="Enter your password" type="password" placeholder=" Password" className="text-black text-sm text-gray-base w-full mx-auto mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
              <button id="loginButton" type="button" onClick={handleLogin} className="inline-block rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10" data-te-ripple-init data-te-ripple-color="light">Log In</button>
            </form>
            <p id="errorUsernameMessage" className="error" style={{ display: 'none', color: 'red' }}>Please enter username.</p>
            <p id="errorPasswordMessage" className="error" style={{ display: 'none', color: 'red' }}>Please enter password.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
