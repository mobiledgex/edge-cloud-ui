import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Input, InputAdornment, TextField, Button } from '@material-ui/core';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import * as dateUtil from '../../../utils/date_util'

const MaterialUIPickers = (props) => {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(dateUtil.utcTime(dateUtil.currentTime()));
    const [selectedStarttime, setStarttime] = React.useState(dateUtil.utcTime(dateUtil.currentTime()));
    const [selectedEndtime, setEndtime] = React.useState(dateUtil.utcTime(dateUtil.currentTime()));
    const [limit, setLimit] = React.useState(25);

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

    return (
        <div style={{ marginTop: '50%' }} align="center">
            <div style={{ width: 200 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format={"MM/dd/yyyy"}
                        margin="normal"
                        id="date-picker-inline"
                        label="Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <div style={{ width: 200 }}>
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
            <div style={{ width: 200 }}>
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
            <br />
            <div style={{ width: 200 }}>
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
            <br />
            <div align={'right'} style={{ marginRight: 20 }}>
                <Button onClick={onSubmit}>Fetch Data</Button>
            </div>
        </div>
    );
}

export default  MaterialUIPickers