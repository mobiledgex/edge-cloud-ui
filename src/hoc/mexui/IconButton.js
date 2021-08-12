import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightGreen } from '@material-ui/core/colors';
import { IconButton as IB, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        alignItems: 'center',
    },
    wrapper: {
        // margin: theme.spacing(1),
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
    const { tooltip, disabled, style, loading, onClick, children } = props
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Tooltip title={tooltip ? <strong style={{fontSize:13}}>{tooltip}</strong> : ''}>
                    <span>
                        <IB
                            onClick={onClick}
                            disabled={disabled ? disabled : loading}
                            style={style}
                        >
                            {children}
                        </IB>
                    </span>
                </Tooltip>
                {loading && <CircularProgress size={32} className={classes.buttonProgress} />}
            </div>
        </div>
    );
}