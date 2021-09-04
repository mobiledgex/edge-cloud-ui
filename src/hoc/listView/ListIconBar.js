
import { makeStyles } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import clsx from 'clsx';
import React, { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: 15,
        cursor: 'pointer',
        textAlign:'center',
        padding: 5,
        borderRadius: 5,
        width:80,
        marginTop: 5,
        '&:hover': {
            backgroundColor: 'rgba(56, 142, 60, 0.2)',
        }
    },
    clicked: {
        backgroundColor: 'rgba(56, 142, 60, 0.2)',
    }
}));

const IconBar = (props) => {
    const { keys, onClick } = props
    const classes = useStyles()

    const onChange = (index, key) => {
        let temp = cloneDeep(keys)
        temp[index].clicked = !key.clicked
        onClick(temp)
    }

    return (
        keys ? keys.map((key, i) => (
            <div className={clsx(classes.root, key.clicked ? classes.clicked : {})} key={i} onClick={() => { onChange(i, key) }}>
                <img src={`/assets/icons/${key.icon}`} />
                <strong style={{ marginLeft: 4 }}>{`${key.label}`}</strong>
            </div>
        )) : null
    )
}
export default IconBar