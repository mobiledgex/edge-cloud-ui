
import { makeStyles } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import clsx from 'clsx';
import React from 'react'
import { Icon } from '../mexui';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 15,
        marginTop:5,
        gap: 10
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 5,
        borderRadius: 5,
        '&:hover': {
            backgroundColor: 'rgba(56, 142, 60, 0.2)',
        }
    },
    clicked: {
        backgroundColor: 'rgba(56, 142, 60, 0.2)',
    },
    text: {
        marginLeft: 6,
        lineHeight:2
    },
    empty:{
        height:35
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
        <div className={classes.root}>
            {keys ? keys.map((key, i) => {
                const isSVG = key.icon.includes('.svg')
                return (key?.count ? <div className={clsx(classes.content, key.clicked ? classes.clicked : {})} key={i} onClick={() => { onChange(i, key) }}>
                    {isSVG ? <img src={`/assets/icons/${key.icon}`} width={24} /> : <Icon color={'#388E3C'} size={24} outlined={true}>{key.icon}</Icon>}
                    <strong className={classes.text}>{`${key.label}: ${key.count}`}</strong>
                </div> : <div className={classes.empty}></div>)
            }) : null}
        </div>
    )
}
export default IconBar