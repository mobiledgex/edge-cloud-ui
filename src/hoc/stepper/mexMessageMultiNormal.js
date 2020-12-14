import React from 'react'
import { Button, Dialog, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Button disabled={true} style={{color:'white', textTransform:'none', fontSize:15, marginTop:-3}} startIcon={<DeleteSweepOutlinedIcon />}><b>{children}</b></Button>   
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const MexMessageMultiNorm = (props) => {
    const {data} = props
    return (
        <Dialog onClose={props.close} aria-labelledby="simple-dialog-title" open={data.length > 0} disableEscapeKeyDown={true} PaperProps={{style:{
            minWidth:250
        }}}>
            <DialogTitle id="title" onClose={props.close}>Delete</DialogTitle>
            <List style={{maringTop:-20}}>
                {data.map((mul, i) => {
                    return (
                        <ListItem key={i}>
                            <ListItemText primary={mul} />
                        </ListItem>
                    )
                })}
            </List>
        </Dialog>
    )
}

export default MexMessageMultiNorm