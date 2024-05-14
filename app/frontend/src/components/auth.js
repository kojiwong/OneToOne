import { useState, useEffect } from 'react';

export const useAuthentication = () => {
    const [authenticated, setAuthenticated] = useState(false);
  
    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      // Check if the access token exists and is not expired
      if (accessToken) {
        // You can implement token validation logic here
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    }, []);
  
    return authenticated;
  };