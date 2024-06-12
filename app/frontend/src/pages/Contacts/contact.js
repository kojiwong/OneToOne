import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import {Typography, Box, Paper, Checkbox} from '@mui/material';
import Avatar from '../../components/avatar';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    justifyContent: 'space-between'
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    color: theme.palette.text.secondary,
  },
});

class Contact extends React.Component {
  handleToggle = () => {
    const { contact, onToggle } = this.props;
    onToggle(contact);
  };

  handleClick = () => {
    const {contact, contact_id, onClick } = this.props;
    onClick(contact_id, contact.email);
    console.log('clicked', contact, contact_id, onClick)
  }

  render() {
    const { classes, contact, checked=false } = this.props;
    const [firstName, lastName] = contact.name.split(" ");
    
    return (
      <Paper className={classes.root}>
        <Box onClick={this.handleClick} style={{display: 'flex', flexDirection: 'row'}}>
        <Avatar fname={firstName} lname={lastName} className={classes.avatar} />
        <div className={classes.infoContainer}>
          <Typography variant="h6" className={classes.name}>
            {contact.name}
          </Typography>
          <Typography variant="body1" className={classes.email}>
            {contact.email}
          </Typography>
        </div>
        </Box>
        <Checkbox checked={checked} onChange={this.handleToggle} edge="end"/>
      </Paper>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Contact);
