import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Avatar from './avatar';
import axios from 'axios';
import { API_URL } from '../constants';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontSize: 'medium',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
  },
  appBar: {
    backgroundColor: '#4169E1', // Change background color here
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimaryAppBar() {
  const classes = useStyles();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const {  refreshToken, accessToken } = useContext(AuthContext);
  const { logout } = useAuth()

  console.log("acess token: ", accessToken);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    getName();
  }, [accessToken]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    axios.post(API_URL + 'users/logout/', { refresh_token: refreshToken },
    { 
        headers: {
            Authorization: "Bearer " + accessToken
        }, 
    })
      .then(response => {
        console.log('Logout successful', response.data);
        logout();
        window.location.href = '/login';
      })
      .catch(error => {
        console.error('Error logging out:', error);
        alert('Logout failed. Please try again.');
      });
  };

  const getName = async () => {
    try {
      const response = await axios.get(API_URL + 'users/profile/view/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setFname(response.data.first_name);
      setLname(response.data.last_name);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link to="/profile">
          <IconButton
            edge="end"
            aria-label="account of current user"
            color="inherit"
            size="large">
            <Avatar fname={fname} lname={lname} />
          </IconButton>
          Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton
          edge="end"
          aria-label="logout"
          // onClick={handleLogout}
          color="inherit"
          size="large">
          <ExitToAppIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/calendars">Calendars</Link>
          </Typography>
          <div style={{ margin: '0 10px' }} />
          <Typography className={classes.title} variant="h6" noWrap>
          <Link to="/invitations">Invitations</Link>
          </Typography>
          <div style={{ margin: '0 10px' }} />
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/contacts">Contacts</Link>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link to="/profile">
              <IconButton
                edge="end"
                aria-label="account of current user"
                color="inherit"
                size="large">
                <Avatar fname={fname} lname={lname} />
              </IconButton>
            </Link>
            <IconButton
              edge="end"
              aria-label="logout"
              color="inherit"
              onClick={handleLogout}
              size="large">
              <ExitToAppIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              size="large">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}
