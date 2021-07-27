import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';
import { perpetual } from '../../helper/constant';

export default function ActionAlert(props) {
    let alertInfo = props.alertInfo
    const color = (type) => {
        switch (type) {
            case perpetual.SUCCESS:
                return '#FF9800'
            case perpetual.ERROR:
                return '#212121'
            case perpetual.WARNING:
                return '#FF9800'
            case perpetual.INFO:
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