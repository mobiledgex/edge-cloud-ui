
import { makeStyles } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 15,
        cursor: 'pointer',
        padding:5,
        marginTop: 5,
        '&:hover': {
            backgroundColor: 'rgba(56, 142, 60, 0.2)',
            borderRadius:5,
        }
    }
}));

const IconBar = (props) => {
    const { keys } = props
    const classes = useStyles()
    return (
        keys ? keys.map((key, i) => (
            <div className={classes.root} key={i}>
                <img src={`/assets/icons/${key.icon}`} />
                <strong style={{ marginLeft: 2 }}>{`${key.label} : ${key.count}`}</strong>
            </div>
        )) : null
    )
}
export default IconBar