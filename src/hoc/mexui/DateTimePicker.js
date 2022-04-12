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

import React, { useEffect } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { currentDate, FORMAT_FULL_DATE, FORMAT_FULL_DATE_TIME, time } from '../../utils/date_util';

export default function DateTimePicker(props) {
    const {className, style} = props
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
                className={className}
                style={style}
            />
        </MuiPickersUtilsProvider>
    );
}