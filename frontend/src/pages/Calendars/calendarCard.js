import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
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
});


class CalendarCard extends React.Component {
    handleClick = () => {
        const {calendar, onClick } = this.props;
        onClick(calendar);
        console.log('clicked', calendar, onClick)
    }
    render() {
        const {classes, calendar} = this.props;
        return (
            <Card raised={true} variant="outlined" className={classes.innerCard} onClick={this.handleClick}>
                <CardContent>
                <Typography variant="body1" style={{display: 'flex', justifyContent: 'center'}}>{calendar.name}</Typography>
                </CardContent>
            </Card>
        )
    }
}

CalendarCard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CalendarCard);