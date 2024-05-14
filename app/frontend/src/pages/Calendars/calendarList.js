import React from 'react';
import { Typography, Card, CardContent, makeStyles, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CalendarCard from './calendarCard';

const useStyles = makeStyles((theme) => ({
  outerCard: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  innerCard: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.background.default
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  centeredText: {
    display: 'flex', 
    justifyContent: 'center'
  }
}));


function CalendarList({ title, calendarlist, handleClick }) {
  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.outerCard}>
      <CardContent style={{width:'100%', flexDirection: 'column'}}>
        <Typography variant="h5" component="h2" className={classes.title} style={{display: 'flex', justifyContent: 'center'}}>
          {title.toUpperCase()}
        </Typography>
        {calendarlist.map((calendar, index) => (
          <Link to={`/events/${calendar.calendar_id}/`}>
            <CalendarCard calendar={calendar} onClick={handleClick}/>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export default CalendarList;
