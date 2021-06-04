import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';

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
    let action = props.messageInfo.action;
    let data = props.messageInfo.data;
    return (
        message ?
            <Dialog open={message.length > 0}>
                <DialogContent style={{  width: 500 }}>
                    <Typography style={{ color: '#FFF' }}>
                        {message}
                    </Typography>
                    {action && action.dialogNote ?
                        <Typography style={{ color: '#FFC107', marginTop: 20, fontSize: 13 }}>
                            {action.dialogNote(props.messageInfo.data)}
                        </Typography> : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { props.onClick(false) }} style={{color:'#D3D3D3'}}>
                        NO
                    </Button>
                    <Button onClick={() => { props.onClick(true, data) }} style={{color:lightGreen['A700']}}>
                        YES
                    </Button>
                </DialogActions>
            </Dialog> : null
    )
}

export default MexMessageDialog
