import React from 'react';
import { Popover, Grid, Button, Divider, Box, Tooltip } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import * as constant from './montconstant'
import * as moment from 'moment'
import { Icon } from 'semantic-ui-react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { alertInfo } from '../../../../actions';
import { useDispatch } from 'react-redux';

const rangeLabel = (from, to) => {
    return <div>
        <div>
            {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, from)}
        </div>
        <div style={{marginTop:10, marginBottom:10}} align="center">
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
            let utcFrom  = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, from) + '+00:00'
            let utcTo  = dateUtil.utcTime(dateUtil.FORMAT_FULL_T, to) + '+00:00'
            props.onChange(utcFrom, utcTo)
        }
    }

    const applyRelativeTimeRange = (relativeTimeRange)=>{
        setAnchorEl(null)
        props.onRelativeChange(relativeTimeRange)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'mex-timer' : undefined;

    return (
        <Box order={props.order}style={{marginTop:8, marginRight:10}}>
            <Tooltip title={<strong style={{fontSize:13}}>{rangeLabel(props.range.starttime, props.range.endtime)}</strong>} arrow>
                <button size='small' aria-controls="mex-timer" aria-haspopup="true" onClick={handleClick} style={{backgroundColor:'transparent', border:'1px solid rgba(118, 255, 3, 0.7)', borderRadius:5, cursor:'pointer', padding:5}}>
                    <Icon name='clock outline' style={{color:'rgba(118, 255, 3, 0.7)'}}/><strong style={{marginLeft:5, color:'rgba(118, 255, 3, 0.7)'}}>{props.duration.label}</strong><Icon name='chevron down'  style={{marginLeft:5, color:'rgba(118, 255, 3, 0.7)'}}/>
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
                                {constant.relativeTimeRanges.map((relativeTimeRange, i) => {
                                    return (
                                        <div key={i}>
                                            <Button onClick={()=>{applyRelativeTimeRange(relativeTimeRange)}}>{relativeTimeRange.label}</Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Popover>
        </Box>
    );
}

export default MexTimer