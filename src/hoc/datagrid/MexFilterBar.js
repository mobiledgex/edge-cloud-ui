/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
                return (key?.count ? <div key={i} className={clsx(classes.content, key.clicked ? classes.clicked : {})} onClick={() => { onChange(i, key) }}>
                    {isSVG ? <img src={`/assets/icons/${key.icon}`} width={24} /> : <Icon color={'#388E3C'} size={24} outlined={true}>{key.icon}</Icon>}
                    <strong className={classes.text}>{`${key.label}: ${key.count}`}</strong>
                </div> : <div key={i} className={classes.empty}></div>)
            }) : null}
        </div>
    )
}
export default IconBar