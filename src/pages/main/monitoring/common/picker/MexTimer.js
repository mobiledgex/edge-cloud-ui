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

import React, {useEffect, useRef} from 'react';
import { Popover, Grid, Button, Divider, Tooltip } from '@material-ui/core';
import * as dateUtil from '../../../../../utils/date_util'
import { relativeTimeRanges } from '../../helper/constant'
import * as moment from 'moment'
import { Icon } from 'semantic-ui-react';
import { Icon as MIcon, IconButton } from '../../../../../hoc/mexui';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { alertInfo } from '../../../../../actions';
import { useDispatch } from 'react-redux';

const rangeLabel = (from, to) => {
    return <div>
        <div>
            {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, from)}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }} align="center">
            to
        </div>
        <div>
            {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, to)}
        </div>
    </div>
}

const MexTimer = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [from, setFrom] = React.useState(dateUtil.currentDate());
    const [to, setTo] = React.useState(dateUtil.currentDate());
    const [days, setDays] = React.useState('');
    const dispatch = useDispatch();
   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const applyTimeRange = () => {
        let diff = moment(to).diff(moment(from))
        if (diff <= 0) {
            dispatch(alertInfo('error', 'From date cannot be greater than to date'))
        }
        else {
            setAnchorEl(null)
            let utcFrom = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, from) + '+00:00'
            let utcTo = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, to) + '+00:00'
            props.onChange(utcFrom, utcTo)
        }
    }

    const applyRelativeTimeRange = (relativeTimeRange) => {
        setAnchorEl(null)
        props.onRelativeChange(relativeTimeRange)
    }

    const onDaysUptoChange = (e) => {
        let value = e.target.value
        setDays(value)
    }

    const onDaysUptoClick = () => {
        setAnchorEl(null)
        if(days > 0)
        {
            props.onRelativeChange({ label: `Last ${days} day${days > 1 ? 's' : ''}`, duration: days * 1440 })
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'mex-timer' : undefined;

    return (
        <React.Fragment>
            <Tooltip title={<strong style={{ fontSize: 13 }}>{rangeLabel(props.range.starttime, props.range.endtime)}</strong>} arrow>
                <button size='small' aria-controls="mex-timer" aria-haspopup="true" onClick={handleClick} style={{ backgroundColor: 'transparent', border: '1px solid rgba(118, 255, 3, 0.7)', borderRadius: 5, cursor: 'pointer', padding: 5 }}>
                    <Icon name='clock outline' style={{ color: 'rgba(118, 255, 3, 0.7)' }} /><strong style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }}>{props.duration.label}</strong><Icon name='chevron down' style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }} />
                </button>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ width: 550, padding: 10 }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <div>
                                <h4><b>Absolute Time Range</b></h4>
                                <div style={{ marginBottom: 20, marginTop: 20, paddingLeft: 5 }}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            value={from}
                                            disableFuture
                                            variant="inline"
                                            onChange={(date) => { setFrom(date) }}
                                            label="From"
                                            format='yyyy/MM/dd HH:mm'
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <div style={{ marginBottom: 20, paddingLeft: 5 }}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            value={to}
                                            disableFuture
                                            variant="inline"
                                            onChange={(date) => { setTo(date) }}
                                            label="To"
                                            format='yyyy/MM/dd HH:mm'
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <Button onClick={applyTimeRange} style={{ backgroundColor: 'rgba(118, 255, 3, 0.5)', marginTop:20 }}>Apply Time Range</Button>
                            </div>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider orientation="vertical" flexItem style={{ height: '100%' }} />
                        </Grid>
                        <Grid item xs={5}>

                            <div>
                                <h4 style={{ marginBottom: 10 }}><b> Relative Time Ranges</b></h4>
                                <div style={{ marginBottom: 5 }}>
                                    <input autoFocus={true} style={{ width: 45, height: 25, marginTop: 10, marginLeft: 5, borderRadius: 5, textAlign: 'center', type: 'number', backgroundColor: '#292C33', border: '1px solid #CECECE', color: '#CECECE' }} placeholder='-' onChange={onDaysUptoChange} value={days} />
                                    <span style={{ marginLeft: 10, fontSize:12, marginRight:5 }}>DAYS UPTO TODAY</span>
                                    <IconButton inline={true} tooltip={'Enter'} onClick={onDaysUptoClick}><MIcon style={{fontSize:15}}>subdirectory_arrow_left</MIcon></IconButton>
                                </div>
                                <Divider/>
                                <div style={{marginBottom:5}}></div>
                                {relativeTimeRanges.map((relativeTimeRange, i) => {
                                    return (
                                        <div key={i}>
                                            <Button onClick={() => { applyRelativeTimeRange(relativeTimeRange) }}>{relativeTimeRange.label}</Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Popover>
        </React.Fragment>
    );
}

export default MexTimer