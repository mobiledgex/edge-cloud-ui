import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';

export const INFO = 'info'
export const ERROR = 'error'
export const SUCCESS = 'success'
export const WARNING = 'warning'

export default function ActionAlert(props) {

    let alertInfo = props.alertInfo
    const color = (type) => {
        switch (type) {
            case 'success':
                return '#FF9800'
            case 'error':
                return '#212121'
            case 'warning':
                return '#FF9800'
            case 'info':
                return '#2196F3'
        }
    }

    return (
        alertInfo ? <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={alertInfo !== undefined}
                autoHideDuration={6000}
            >
                <SnackbarContent
                    style={{ backgroundColor: color(alertInfo.severity), color: '#FFF' }}
                    message={alertInfo.msg}
                    action={
                        <React.Fragment>
                            <Button style={{ color: '#FFF' }} size="small" onClick={() => { props.action(true) }}>
                                YES
                            </Button>
                            <Button style={{ color: '#FFF' }} size="small" onClick={() => { props.action(false) }}>
                                NO
                          </Button>
                        </React.Fragment>
                    } />
            </Snackbar>
        </div> : null
    );
}