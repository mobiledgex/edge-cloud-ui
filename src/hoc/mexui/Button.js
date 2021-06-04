import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, lightGreen, lime } from '@material-ui/core/colors';
import { Button as MButton, Tooltip, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    button: {
        backgroundColor: '#639712',
        color: 'white',
        '&:hover': {
            backgroundColor: lightGreen['900'],
        }
    },
    buttonProgress: {
        color: 'white',
        marginTop: -2,
        marginLeft: 10
    },
}));

export default function Button(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Tooltip title={props.tooltip ? props.tooltip : ''}>
                    <MButton
                        onClick={props.onClick}
                        variant='contained'
                        className={classes.button}
                        disabled={props.disabled ? props.disabled : props.loading}
                        style={props.style ? props.style : {}}
                    >
                        <Typography variant='button'>{props.children}</Typography>
                        {props.loading && <CircularProgress size={15} thickness={3} className={classes.buttonProgress} />}
                    </MButton>
                </Tooltip>
                { }
            </div>
        </div>
    );
}