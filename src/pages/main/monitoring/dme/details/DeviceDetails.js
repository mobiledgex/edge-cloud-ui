import React from 'react'
import { perpetual } from '../../../../../helper/constant';
import './style.css'

const Details = (props) => {

    const { data, keys } = props
    const values = data[perpetual.CON_VALUES]
    return (
        <React.Fragment>
            <div className='details-main' align='center'>
                <div className='details-header'><h4><b>Number of Samples</b></h4></div>
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
                                            <td key={i}>{data[item.field] ? data[item.field] : item.default}</td>
                                        ))}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}

export default Details