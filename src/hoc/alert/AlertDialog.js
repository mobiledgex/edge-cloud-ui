import React from 'react';
import { Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MexAlert = (props) => {

    const handleClose = (event, reason) => {
        props.onClose()
    }
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            onClose={handleClose}
            open={props.data !== undefined}
            autoHideDuration={50000}
        >
            <Alert onClose={handleClose} severity={props.data.severity}>
                {props.data.msg}
            </Alert>
        </Snackbar>
    )
}

export default MexAlert;

