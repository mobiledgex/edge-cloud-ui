import React from 'react'
import { perpetual } from '../../../../../helper/constant';
import './style.css'

const Details = (props) => {

    const { data, keys } = props
    const values = data[perpetual.CON_VALUES]
    return (
        <React.Fragment>
            <div style={{ marginBottom: 20 }} align='center'><h4><b>Number of Samples</b></h4></div>
            <table className="details">
                <thead>
                    <tr>
                        {keys.map((item, i) => (
                            <th key={i}>{item.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        values.map((data, i) => {
                            return (
                                <tr key={i}>
                                    {keys.map((item, i) => (
                                        <td key={i}>{data[item.field] ? data[item.field] : 0}</td>
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