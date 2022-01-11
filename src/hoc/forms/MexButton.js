import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: '#639712',
        color: 'white',
        margin:10,
        '&:hover': {
            backgroundColor: lightGreen['900'],
        }
    }
}));

const MexButton = (props) => {
    const classes = useStyles();
    const form = props.form;

    const getStyle = (form) => {
        return form.style ? form.style : {}
    }
    const getForms = () => (
        <Button
            className={classes.button}
            variant="contained"
            style={getStyle(form)}
            onClick={(e) => { props.onClick(form) }}>
            <Typography variant='button'>{form.label}</Typography>
        </Button>
    )

    return (
        form ?
            getForms() : null
    )
}

export default MexButton
