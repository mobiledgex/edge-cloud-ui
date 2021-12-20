import React from "react";
import clsx from 'clsx';
import { Typography, Divider, makeStyles } from "@material-ui/core/";
import './style.css'

const useStyles = makeStyles({
    textColor: {
        color: '#273c43'
    },
    divider: {
        backgroundColor: '#AEAEAE',
        marginTop: 5,
        marginBottom: 5
    },
    section: {
        marginTop: 15
    }
});



const Section = (props) => {
    const classes = useStyles();
    return (
        <Typography variant="h6" className={clsx(classes.textColor, classes.section)}>
            <b>{props.children}</b>
            <Divider className={classes.divider} />
        </Typography>
    )
}

export default Section