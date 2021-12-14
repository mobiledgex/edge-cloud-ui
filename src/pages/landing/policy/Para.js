import React from "react";
import { Typography, makeStyles } from "@material-ui/core/";
import clsx from 'clsx';

const useStyles = makeStyles({
    textColor: {
        color: 'black'
    }
});

const Para = (props) => {
    const classes = useStyles();
    return (
        <div>
            <Typography variant="subtitle1" className={clsx(classes.textColor)}>
                {props.children}
            </Typography>
        </div>
    )
}

export default Para