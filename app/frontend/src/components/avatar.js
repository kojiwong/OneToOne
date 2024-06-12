import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';

const styles = {
  avatar: {
    margin: 10,
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
};

function LetterAvatars(props) {
  const { classes, fname, lname, style } = props;

  // Set default values for color and backgroundColor
  const defaultStyle = {
    color: '#000', // Default text color
    backgroundColor: '#ccc', // Default background color
  };

  // Merge custom style with default style
  const customStyle = {
    ...defaultStyle,
    ...style,
  };

  function getInitials(fname, lname) {
    var init = '';
    if (fname) init += fname[0].toUpperCase();
    if (lname) init += lname[0].toUpperCase();
    return init
  }
  return (
      <Avatar className={classes.avatar} style={customStyle}>{getInitials(fname, lname)}</Avatar>
  );
}

LetterAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default withStyles(styles)(LetterAvatars);