import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import {Typography, Paper, Checkbox, Grid} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    justifyContent: 'space-between'
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  centerGrid: {
    display: 'flex', 
    justifyContent: 'center'
  }
});

class EventInfo extends React.Component {
  handleToggle = () => {
    const { event, onToggle } = this.props;
    onToggle(event);
  };


  render() {
    const { classes, event, index, checked=false } = this.props;

    // console.log("event whowo: ", event)
    console.log("interesting", event.start_time, dayjs.tz(event.start_time))
    
    return (
      <Paper className={classes.root}>
        <div className={classes.infoContainer} style={{display: 'flex', flexDirection: 'row', flex: 1}}>
            <Grid container spacing={1}>
              <Grid item xs={4} className={classes.centerGrid}>
                <Typography variant="overline" color="textSecondary" align="center" style={{fontWeight: "bold"}}>
                {event.event_type == "HP" ? "High Priority" : "Low Priority"}
                </Typography>
              </Grid>
              <Grid item xs={4} className={classes.centerGrid}>
                <Typography variant="overline" color="textSecondary" align="center">
                {dayjs.tz(event.start_time).format('YYYY-MM-DD HH:mm')}
                </Typography>
              </Grid>
              <Grid item xs={4} className={classes.centerGrid}>
                <Typography variant="overline" color="textSecondary" align="center">
                {dayjs.tz(event.end_time).format('YYYY-MM-DD HH:mm')}
                </Typography>
              </Grid>
            </Grid>
        </div>
        <Checkbox checked={checked} onChange={this.handleToggle} edge="end"/>
      </Paper>
    );
  }
}

EventInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(EventInfo);
