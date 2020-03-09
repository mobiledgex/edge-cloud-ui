import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const MexMessageDialog = (props) => {
    let message = props.messageInfo.message;
    return (
        message ?
            <Dialog open={message.length > 0}>
                <DialogContent style={{ background: '#616161', width: 500 }}>
                    <Typography style={{ color: '#FFF' }}>
                        <p>{message}</p>
                    </Typography>
                </DialogContent>
                <DialogActions style={{ background: '#616161' }}>
                    <Button onClick={() => { props.onClick(false) }}>
                        NO
                    </Button>
                    <Button onClick={() => { props.onClick(true) }} style={{color:'#76ff03'}}>
                        YES
                    </Button>
                </DialogActions>
            </Dialog> : null
    )
}

export default MexMessageDialog
