import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    centerGrid: {
      display: 'flex', 
      justifyContent: 'center'
    }
  }))

const Header = ({start, middle, end}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1}>
          <Grid item xs={4} className={classes.centerGrid}>
            <Typography variant="overline" color="textSecondary" align="center">
              {start}
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.centerGrid}>
            <Typography variant="overline" color="textSecondary" align="center">
              {middle}
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.centerGrid}>
            <Typography variant="overline" color="textSecondary" align="center">
              {end}
            </Typography>
          </Grid>
        </Grid>
    )
}

export default Header;