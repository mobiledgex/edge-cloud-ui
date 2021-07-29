import React from 'react'
import MyLocationOutlinedIcon from '@material-ui/icons/MyLocationOutlined';
import { perpetual } from '../../../../../helper/constant';
import { fields } from '../../../../../services/model/format';
import {IconButton} from '../../../../../hoc/mexui'
import './style.css'
import { generateColor } from '../../../../../utils/heatmap_utils';
import { _avg } from "../../../../../helper/constant/operators"
const Details = (props) => {
    
    const {data, markerType} = props
    const values = data[perpetual.CON_VALUES]
    const tags = data[perpetual.CON_TAGS]
    return (
        <React.Fragment>
            <div style={{ marginBottom: 20 }} align='center'><h4><b>Number of Samples</b></h4></div>
            <table className="details">
                <thead><tr><th>Location Tile</th><th>0 - 5 ms</th><th>5 - 10 ms</th><th>10 - 25 ms</th><th>25 - 50 ms</th><th>50 - 100 ms</th><th>&gt; 100 ms</th></tr></thead>
                <tbody>
                    {
                        Object.keys(values).map((key, i) => {
                            const childTotal = values[key][perpetual.CON_TOTAL]
                            const location = values[key][perpetual.CON_TAGS][fields.location]
                            return (
                                <tr key={i}>
                                    <td><IconButton tooltip='View aggregated location tile latency' onClick={() => { props.onClick(key, values, [location.lat, location.lng]) }}><MyLocationOutlinedIcon style={{ color: generateColor(_avg(childTotal[markerType])) }} /></IconButton></td>
                                    <td>{childTotal[fields._0s]}</td>
                                    <td>{childTotal[fields._5ms]}</td>
                                    <td>{childTotal[fields._10ms]}</td>
                                    <td>{childTotal[fields._25ms]}</td>
                                    <td>{childTotal[fields._50ms]}</td>
                                    <td>{childTotal[fields._100ms]}</td>
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