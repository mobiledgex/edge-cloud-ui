import React from 'react'
import MyLocationOutlinedIcon from '@material-ui/icons/MyLocationOutlined';
import { perpetual } from '../../../../../helper/constant';
import { fields } from '../../../../../services/model/format';
import {IconButton} from '../../../../../hoc/mexui'
import './style.css'
import { generateColor } from '../../../../../utils/heatmap_utils';
import { _avg } from "../../../../../helper/constant/operators"

export const keys = [
    { label: '0 - 5 ms', field: fields._0s, default: 0 },
    { label: '5 - 10 ms', field: fields._5ms, default: 0 },
    { label: '10 - 25 ms', field: fields._10ms, default: 0 },
    { label: '25 - 50 ms', field: fields._25ms, default: 0 },
    { label: '50 - 100 ms', field: fields._50ms, default: 0 },
    { label: '> 100 ms', field: fields._100ms, default: 0 }
]

const Details = (props) => {
    
    const {data, markerType} = props
    const values = data[perpetual.CON_VALUES]
    const tags = data[perpetual.CON_TAGS]
    return (
        <React.Fragment>
            <div style={{ marginBottom: 20 }} align='center'><h4><b>Number of Samples</b></h4></div>
            <table className="details">
                <thead>
                    <tr>
                        <th>Location Tile</th>
                        {keys.map((item, i) => (
                            <th key={i}>{item.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(values).map((key, i) => {
                            const childTotal = values[key][perpetual.CON_TOTAL]
                            const location = values[key][perpetual.CON_TAGS][fields.location]
                            return (
                                <tr key={i}>
                                    <td><IconButton tooltip='View aggregated location tile latency' onClick={() => { props.onClick(key, values, [location.lat, location.lng]) }}><MyLocationOutlinedIcon style={{ color: generateColor(_avg(childTotal[markerType])) }} /></IconButton></td>
                                    {keys.map((item, j) => (
                                        <td key={`${i}_${j}`}>{childTotal[item.field] ? childTotal[item.field] : item.default}</td>
                                    ))}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default Details