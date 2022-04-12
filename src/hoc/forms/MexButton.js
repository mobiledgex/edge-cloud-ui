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
