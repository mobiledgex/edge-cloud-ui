import React, { useEffect } from 'react';
import { Popover, Grid, Button, Divider, Tooltip } from '@material-ui/core';
import * as moment from 'moment'
import { Icon } from 'semantic-ui-react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { useDispatch } from 'react-redux';
import { alertInfo } from '../../actions';
import * as dateUtil from '../../utils/date_util';
import { range } from 'lodash-es';

export const relativeTimeRanges = [
    { label: 'Last 5 minutes', duration: 5 },
    { label: 'Last 15 minutes', duration: 15 },
    { label: 'Last 30 minutes', duration: 30 },
    { label: 'Last 1 hour', duration: 60 },
    { label: 'Last 3 hours', duration: 180 },
    { label: 'Last 6 hours', duration: 360 },
    { label: 'Last 12 hours', duration: 720 },
    { label: 'Last 24 hours', duration: 1440 },
    { label: 'Last 2 Days', duration: 2880 },
    { label: 'Last 7 Days', duration: 10080 },
    { label: 'Last 30 Days', duration: 43200 },
]

const rangeLabel = (range) => {
    const timeRange = timeRangeInMin(range.duration)
    return <div>
        <div>
            {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, timeRange.from)}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }} align="center">
            to
        </div>
        <div>
            {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, timeRange.to)}
        </div>
    </div>
}

const defaultRange = (duration) => {
    for(const range of relativeTimeRanges)
    {
        if(range.duration === duration)
        {
            return range
        }
    }
}

export const timeRangeInMin = (duration) => {
    duration = duration ? duration : relativeTimeRanges[3].duration
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(duration, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { from: starttime, to: endtime, duration }
}

const MexTimer = (props) => {
    const { onChange, defaultDuration, relativemax } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [from, setFrom] = React.useState(dateUtil.currentDate());
    const [to, setTo] = React.useState(dateUtil.currentDate());
    const [relativeRange, setRelativeRange] = React.useState(defaultDuration ? defaultRange(defaultDuration) : relativeTimeRanges[3]);
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
        else if (diff > 86400000) {
            dispatch(alertInfo('error', 'Range cannot be greater than one day'))
        }
        else {
            setAnchorEl(null)
            let utcFrom = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, from) + '+00:00'
            let utcTo = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, to) + '+00:00'
            onChange({ from: utcFrom, to: utcTo, duration: relativeRange.duration })
        }
    }

    const applyRelativeTimeRange = (relativeTimeRange) => {
        setAnchorEl(null)
        setRelativeRange(relativeTimeRange)
        onChange(timeRangeInMin(relativeTimeRange.duration))
    }

    const open = Boolean(anchorEl);
    const id = open ? 'mex-timer' : undefined;

    return (
        <React.Fragment>
            <Tooltip title={<strong style={{ fontSize: 13 }}>{rangeLabel(relativeRange)}</strong>} arrow>
                <button size='small' aria-controls="mex-timer" aria-haspopup="true" onClick={handleClick} style={{ backgroundColor: 'transparent', border: '1px solid rgba(118, 255, 3, 0.7)', borderRadius: 5, cursor: 'pointer', padding: 5 }}>
                    <Icon name='clock outline' style={{ color: 'rgba(118, 255, 3, 0.7)' }} /><strong style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }}>{relativeRange.label}</strong><Icon name='chevron down' style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }} />
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
                <div style={{ width: 600, padding: 10 }}>
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
                                <Button onClick={applyTimeRange} style={{ backgroundColor: 'rgba(118, 255, 3, 0.5)' }}>Apply Time Range</Button>
                            </div>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider orientation="vertical" flexItem style={{ height: '100%' }} />
                        </Grid>
                        <Grid item xs={5}>
                            <div>
                                <h4 style={{ marginBottom: 20 }}><b> Relative Time Ranges</b></h4>
                                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                                    {relativeTimeRanges.map((relativeTimeRange, i) => {
                                        const visible = relativemax ? i <= relativemax : true
                                        const highlight = relativeTimeRange.duration === relativeRange.duration
                                        return (
                                            visible ? <div key={i}>
                                                <Button style={{ backgroundColor: highlight ? 'rgba(118, 255, 3, 0.5)' : 'default' }} onClick={() => { applyRelativeTimeRange(relativeTimeRange) }}>{relativeTimeRange.label}</Button>
                                            </div> : null
                                        )
                                    })}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Popover>
        </React.Fragment>
    );
}

export default MexTimer