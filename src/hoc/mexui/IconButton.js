import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightGreen } from '@material-ui/core/colors';
import { IconButton as IB, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: lightGreen['A700'],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -16,
        marginLeft: -16,
    },
}));

export default function IconButton(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Tooltip title={props.tooltip ? props.tooltip : ''}>
                    <IB
                        onClick={props.onClick}
                        disabled={props.disabled ? props.disabled : props.loading}
                        style={props.style ? props.style : {}}
                    >
                        {props.children}
                    </IB>
                </Tooltip>
                {props.loading && <CircularProgress size={32} className={classes.buttonProgress} />}
            </div>
        </div>
    );
}