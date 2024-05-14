import './App.css';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Contacts from './pages/Contacts';
import Calendars from './pages/Calendars';
import Events from './pages/Events';
import Invitations from './pages/Invitations';
import Example from './pages/Example';
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ContactProfile from './pages/Contacts/contactProfile';


function App() {
  // Check if the user is authenticated (you can implement this logic based on your authentication mechanism)
  const { login, logout, accessToken, setAccessToken, refreshToken, setRefreshToken } = useAuth();

  return (
    <AuthContext.Provider value={{ refreshToken, accessToken, setRefreshToken, setAccessToken }}>
      <BrowserRouter>
      <Routes>
        {/* Non-protected routes */}
        <Route path="/"/>
        <Route index element={<Home />} />
        <Route path="login" element={<Login/>} />
        <Route path='register' element={<Register/>} />
        {/* redirect any unknown url to login */}
        <Route path="*" element={<Login />} />
        <Route path="example" element={<Example />} />
        {/* Protected routes */}
        {accessToken != "" ? <Route path='profile' element={<Profile/>} /> : <Route path="login" element={<Login />} />}
        {accessToken != "" ? <Route path='contacts' element={<Contacts/>} /> : <Route path="login" element={<Login />} />}
        {accessToken != "" ? <Route path='calendars' element={<Calendars/>} /> : <Route path="login" element={<Login />} />}
        {accessToken != "" ? <Route path='events/:calendarId' element={<Events/>} /> : <Route path="login" element={<Login />} />}
        {accessToken != "" ? <Route path='invitations' element={<Invitations/>} /> : <Route path="login" element={<Login />} />}
        
      </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
