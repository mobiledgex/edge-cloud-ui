import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightGreen } from '@material-ui/core/colors';
import { IconButton as IB, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

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
    inline:{
        display:'inline-block'
    }
}));

export default function IconButton(props) {
    const classes = useStyles();
    const { id, size, tooltip, disabled, style, loading, onClick, children, inline, className, onMouseOver, onMouseOut } = props
    return (
        <div className={clsx(classes.root, inline ? classes.inline : {})}>
            <div className={classes.wrapper}>
                <Tooltip title={tooltip ? <strong style={{fontSize:13}}>{tooltip}</strong> : ''} arrow>
                    <span>
                        <IB
                            id={id}
                            size={size ?? 'medium'}
                            aria-label={id}
                            onClick={onClick}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                            disabled={disabled ? disabled : loading}
                            style={style}
                            className={className}
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