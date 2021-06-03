import React, { useEffect } from 'react'
import { currentDate, FORMAT_FULL_DATE, time } from '../../utils/date_util';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';


const MexDate = (props) => {
    let form = props.form;
    const [from, setFrom] = React.useState(currentDate());

    useEffect(() => {
        props.onChange(form, time(FORMAT_FULL_DATE, from))
    }, [from]);

    const setDate = (date) => {
        setFrom(date)
    }

    const getForms = () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <DatePicker
                value={from}
                disablePast
                disabled={props.disabled}
                style={{ width: '100%', border: '0.1em solid #737477', backgroundColor: '#16181D', borderRadius: 5 }}
                inputProps={{ style: { backgroundColor: '#16181D', color: '#929394', border: 'none' } }}
                InputProps={{
                    disableUnderline: true
                }}
                variant="inline"
                onChange={(date) => { setDate(date) }}
                format='yyyy/MM/dd'
            />
        </MuiPickersUtilsProvider>
    )

    return (
        form ? getForms() : null
    )
}

export default MexDate
