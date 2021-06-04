import React, { useEffect } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { currentDate, FORMAT_FULL_DATE, time } from '../../utils/date_util';

export default function DatePicker(props) {
    const [date, setDate] = React.useState(currentDate())

    useEffect(() => {
        let format = props.format ? props.format : FORMAT_FULL_DATE
        props.onChange(time(format, date))
    }, [date]);

    const onChange = (date) => {
        setDate(date)
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                value={date}
                disableFuture
                variant="inline"
                onChange={onChange}
                label={props.label ? props.label : ''}
                format='yyyy/MM/dd'
            />
        </MuiPickersUtilsProvider>
    );
}