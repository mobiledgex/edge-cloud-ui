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
import { TextField, MenuItem, Select, InputLabel, FormControl, makeStyles, IconButton, Grid } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import sortBy from 'lodash/sortBy';

const tagList = sortBy([
    'app',
    'apporg',
    'appver',
    'cloudlet',
    'cloudletorg',
    'cluster',
    'clusterorg',
    'duration',
    'email',
    'hostname',
    'lineno',
    'method',
    'org',
    'region',
    'remote-ip',
    'request',
    'response',
    'spanid',
    'state',
    'status',
    'traceid',
    'username'
], 'asc')

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    menuPaper: {
        maxHeight: 200
    }
}));

const Tags = (props) => {
    const classes = useStyles();
    const [key, setKey] = React.useState(props.data && props.data.key ? props.data.key : '')
    const [value, setValue] = React.useState(props.data && props.data.value ? props.data.value : '')

    const onKeyChange = (e) => {
        setKey(e.target.value)
        props.onChange(props.uuid, e.target.value, value)
    }

    const onValueChange = (e) => {
        setValue(e.target.value)
        props.onChange(props.uuid, key, e.target.value)
    }

    return (
        <React.Fragment>
            <Grid container style={{marginBottom:20, marginTop:10}}>
                <Grid item xs={5}>
                    <FormControl>
                        <InputLabel shrink id="tags">
                            Key
                        </InputLabel>
                        <Select style={{ width: 97 }} onChange={onKeyChange} value={key} MenuProps={{ classes: { paper: classes.menuPaper } }}>
                            {tagList.map(tag => (
                                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Value"
                        fullWidth
                        disabled={key === undefined}
                        value={value}
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={onValueChange} />
                </Grid>
                <Grid item xs={1}>
                    <IconButton key={props.uuid} onClick={() => { props.onDelete(props.uuid) }}><DeleteOutlineOutlinedIcon /></IconButton>
                </Grid>
            </Grid>

        </React.Fragment>
    )
}
export default Tags