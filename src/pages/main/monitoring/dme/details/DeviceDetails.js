import React from 'react'
import { perpetual } from '../../../../../helper/constant';
import { fields } from '../../../../../services/model/format';
import './style.css'

const Details = (props) => {

    const { data } = props
    const values = data[perpetual.CON_VALUES]
    return (
        <React.Fragment>
            <div style={{ marginBottom: 20 }} align='center'><h4><b>No of Samples</b></h4></div>
            <table className="details">
                <thead><tr><th>0 ms</th><th>5 ms</th><th>10 ms</th><th>25 ms</th><th>50 ms</th><th>100 ms</th></tr></thead>
                <tbody>
                    {
                        values.map((data, i) => {
                            return (
                                <tr key={i}>
                                    <td>{data[fields._0s]}</td>
                                    <td>{data[fields._5ms]}</td>
                                    <td>{data[fields._10ms]}</td>
                                    <td>{data[fields._25ms]}</td>
                                    <td>{data[fields._50ms]}</td>
                                    <td>{data[fields._100ms]}</td>
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