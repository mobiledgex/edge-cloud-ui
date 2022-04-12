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