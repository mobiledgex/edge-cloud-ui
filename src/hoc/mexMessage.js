import React from 'react';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import {green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
    200: CheckCircleIcon,
    400: ErrorIcon,
};

const useStyles1 = makeStyles(theme => ({
    200: {
        backgroundColor: green[600],
    },
    400: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const MessageWrapper =(props)=> {
    const classes = useStyles1();
    const { className, message, onClose, error, ...other } = props;
    const Icon = variantIcon[error];

    return (
        <SnackbarContent
            className={clsx(classes[error], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

const MexMessage = (props) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        setOpen(false);
    };

    return (
        props.info && props.info.error ?
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
            >
                <MessageWrapper
                    onClose={handleClose}
                    error={props.info.error}
                    message={props.info.message}
                />
            </Snackbar>
        </div>:null
    );
}

export default MexMessage;
