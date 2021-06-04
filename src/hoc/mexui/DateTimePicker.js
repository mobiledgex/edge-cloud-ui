import React, { useEffect } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { currentDate, FORMAT_FULL_DATE, FORMAT_FULL_DATE_TIME, time } from '../../utils/date_util';

export default function DateTimePicker(props) {
    const [date, setDate] = React.useState(props.value ? props.value : `${time(FORMAT_FULL_DATE, currentDate())} 00:00:00`)

    useEffect(() => {
        let format = props.format ? props.format : FORMAT_FULL_DATE_TIME
        props.onChange(time(format, date))
    }, [date]);

    const onChange = (date) => {
        setDate(date)
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
                value={date}
                disableFuture
                variant="inline"
                onChange={onChange}
                label={props.label ? props.label : ''}
                format='yyyy/MM/dd HH:mm'
            />
        </MuiPickersUtilsProvider>
    );
}