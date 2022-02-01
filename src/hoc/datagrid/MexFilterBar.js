
import { makeStyles } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import clsx from 'clsx';
import React from 'react'
import { Icon } from '../mexui';
import { ICON_COLOR } from '../../helper/constant/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent:'center',
        marginLeft: 15,
        cursor: 'pointer',
        textAlign: 'center',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        '&:hover': {
            backgroundColor: 'rgba(56, 142, 60, 0.2)',
        }
    },
    clicked: {
        backgroundColor: 'rgba(56, 142, 60, 0.2)',
    },
    text:{
        marginLeft: 6 
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
        keys ? keys.map((key, i) => {
            const isSVG = key.icon.includes('.svg')
            return (<div className={clsx(classes.root, key.clicked ? classes.clicked : {})} key={i} onClick={() => { onChange(i, key) }}>
                {isSVG ? <img src={`/assets/icons/${key.icon}`} width={24} /> : <Icon color={'#388E3C'} size={24} outlined={true}>{key.icon}</Icon>}
                <strong className={classes.text}>{`${key.label}: ${key.count}`}</strong>
            </div>)
        }) : null
    )
}
export default IconBar