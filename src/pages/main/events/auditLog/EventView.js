import React from 'react';
import { Card } from "@material-ui/core";
import { eventKeys as keys } from '../helper/constant';
import { time, FORMAT_FULL_DATE_TIME } from '../../../../utils/date_util'

const EventView = (props) => {
    const { data } = props

    const mtags = data.mtags

    const formatData = (key, values, mtags) => {
        const value = key.mtags ? mtags[key.field] : values[key.field]
        if (value) {
            if (key.format) {
                switch (key.field) {
                    case 'timestamp':
                        return time(FORMAT_FULL_DATE_TIME, value)
                }
            }
            return value
        }
    }


    return (
        <React.Fragment>
            <Card style={{ height: 'calc(100vh - 50px)', overflow: 'auto', padding: 10 }}>
                {keys.map(key => {
                    const value = formatData(key, data, mtags)
                    return (
                        value ?
                            <table key={key.field}>
                                <tbody>
                                    <tr style={{ fontSize:15, height:40, verticalAlign:'middle' }}>
                                        <td style={{ width: 150 }}>{key.label}</td>
                                        <td>{value}</td>
                                    </tr>
                                </tbody>
                            </table>
                            : null
                    )
                })}
            </Card>
        </React.Fragment>
    )
}

export default EventView