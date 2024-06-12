import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const { 
    onYes, 
    onNo, 
    buttonText, 
    dialogQuestion, 
    dialogText, 
    additionalField, 
    customClickableContent,
    maxWidth="xs",
    yesText="Yes", 
    noText="No"
  } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    console.log('click open')
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const handleYes = () => {
    onYes();
    handleClose();
  };

  const handleNo = () => {
    onNo();
    handleClose();
  };

  return (
    <div>
      {customClickableContent ? (
        <div onClick={handleClickOpen}>
        {customClickableContent}
        </div>
      ):(
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {buttonText}
      </Button>
      )}
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogQuestion}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogText}</DialogContentText>
          {additionalField}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary">{noText}</Button>
          <Button onClick={handleYes} color="primary">{yesText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
