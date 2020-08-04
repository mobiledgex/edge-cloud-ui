import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { InputAdornment, TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@material-ui/core';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import * as dateUtil from '../../../utils/date_util'

import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIosRounded';

const endDate = new Date().getTime()
const startDate = dateUtil.subtractMonth(1).valueOf()
const MaterialUIPickers = (props) => {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)));
    const [selectedStarttime, setStarttime] = React.useState(new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)));
    const [selectedEndtime, setEndtime] = React.useState(new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)));
    const [expanded, setExpanded] = React.useState(false);
    const [limit, setLimit] = React.useState(25);

    const handleExpandChange = () => {
        let flag = !expanded
        setExpanded(flag);
        props.onExpand(flag)
    };
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleStartime = (date) => {
        setStarttime(date);
    };

    const handleEndtime = (date) => {
        setEndtime(date);
    };

    const handleLimit = (e) => {
        let value = e.target.value.trim()
        setLimit(value);
    };

    const onSubmit = () => {
        let date = dateUtil.utcTime(dateUtil.FORMAT_FULL_DATE, selectedDate)
        let starttime = `${date}T${dateUtil.utcTime(dateUtil.FORMAT_TIME_HH_mm, selectedStarttime)}:00Z`
        let endtime = `${date}T${dateUtil.utcTime(dateUtil.FORMAT_TIME_HH_mm, selectedEndtime)}:59Z`
        let filter = { starttime: starttime, endtime: endtime, limit: limit.length > 0 ? limit : 25 }
        props.onFilter(filter)
    }

    const onClose = (e) => {
        props.onClose()
        e.stopPropagation();
    }

    const disableDates = (date)=>
    {
        let time = date.getTime()
        return time < startDate || time > endDate
    }

    return (
        <Accordion expanded={expanded}>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <div style={{ position: 'absolute', left: 0, width: 100}}>
                    <IconButton onClick={handleExpandChange}>
                        <FilterListRoundedIcon />
                    </IconButton>
                    <button size='small' style={{ backgroundColor: `${expanded ? '#BFC0C2' : '#388E3C'}`, borderRadius: 5, border: 'none', fontSize: 10, padding: '5px 10px 5px 10px'}}>LIVE</button>
                </div>
                <div onClick={(e) => { e.stopPropagation() }} align={'center'} style={{ width: '100%', height: 50 }}>
                    <div style={{ position: 'absolute', right: 0, top: 2 }} onClick={onClose}>
                        <IconButton>
                            <ArrowForwardIosIcon fontSize={'small'} />
                        </IconButton>
                    </div>
                </div>

            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#292C33' }}>
                <Grid container justify="space-around">
                    <div style={{ width: 150 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format={"MM/dd/yyyy"}
                                margin="normal"
                                id="date-picker-inline"
                                label="Date"
                                value={selectedDate}
                                //shouldDisableDate={disableDates}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div style={{ width: 150, marginTop: 15 }}>
                        <TextField
                            label="Limit"
                            fullWidth
                            defaultValue={limit}
                            onChange={handleLimit}
                            InputProps={{
                                endAdornment: (
                                    < InputAdornment position="end" >
                                        <DataUsageIcon onClick={() => { }} />
                                    </InputAdornment>
                                )
                            }}
                            placeholder={'Search'} />
                    </div>
                </Grid>
                <Grid container justify="space-around">
                    <div style={{ width: 150 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                variant="inline"
                                label="Start Time"
                                value={selectedStarttime}
                                onChange={handleStartime}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div style={{ width: 150 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                variant="inline"
                                label="End Time"
                                value={selectedEndtime}
                                onChange={handleEndtime}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </Grid>
                <br />
                <div align={'right'} style={{ marginRight: 20 }}>
                    <Button onClick={onSubmit}>Fetch Data</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}

export default MaterialUIPickers