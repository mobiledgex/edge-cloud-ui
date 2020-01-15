import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import { Button } from 'semantic-ui-react';

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
    return (
        props.message && props.message.length>0 ?
            <Dialog  open={props.message.length>0}>
                {props.message.map(item=>(
                    <DialogContent style={{background:'#616161',width:500}}>
                        <Typography style={{color:'#FFF'}}>
                            <p>{item}</p>
                        </Typography>
                    </DialogContent>
                ))}
                <DialogActions style={{background:'#616161'}}>
                    <Button  autoFocus onClick={()=>{props.close()}} color="primary">
                        OK
                    </Button>
                </DialogActions>

            </Dialog> : null
    )
}

export default MexMessageDialog
