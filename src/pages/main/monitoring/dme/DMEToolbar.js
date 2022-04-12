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

import { Box, Toolbar } from '@material-ui/core'
import React from 'react'
import { CSVLink } from 'react-csv'
import { IconButton, Select, Icon, Picker } from '../../../../hoc/mexui'

export const ACTION_DATA_TYPE = 'DataType'
export const ACTION_LATENCY_RANGE = 'LatencyRange'
export const ACTION_CLOSE = 'Close'
export const ACTION_PICKER = 'Picker'

const DataType = (props) => {
    const dataTypeList = ['avg', 'min', 'max']

    const onChange = (value) => {
        props.onChange(ACTION_DATA_TYPE, value)
    }

    return (
        <div style={{ border: '1px solid rgba(118, 255, 3, 0.7)', padding: '1px 5px 1px 5px', borderRadius: 5 }}>
            <Select list={dataTypeList} onChange={onChange} height={150} value={dataTypeList[0]} title={true} color='rgba(118, 255, 3, 0.7)' />
        </div>

    )
}

const LatencyRange = (props) => {
    const dataTypeList = ['\u003E 0ms', '\u003E 5ms', '\u003E 10ms', '\u003E 25ms', '\u003E 50ms', '\u003E 100ms']

    const onChange = (value) => {
        props.onChange(ACTION_LATENCY_RANGE, value)
    }

    return (
        <div style={{ border: '1px solid rgba(118, 255, 3, 0.7)', padding: '1px 5px 1px 5px', borderRadius: 5 }}>
            <Select list={dataTypeList} onChange={onChange} value={dataTypeList[0]} height={200} color='rgba(118, 255, 3, 0.7)' />
        </div>
    )
}

const DMEToolbar = (props) => {
    const { csvData, filename } = props
    return (
        <Toolbar>
            <div style={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end">
                    <div style={{ display: 'flex', alignItems: 'center', gap:10 }}>
                        <Picker onChange={(value) => { props.onChange(ACTION_PICKER, value) }} relativemax={6}/>
                        <DataType {...props} />
                        <LatencyRange {...props} />
                        {csvData ?
                            <CSVLink filename={filename} data={csvData}>
                                <IconButton tooltip='Download CSV'><img src='/assets/icons/csv.svg' width={24} /></IconButton>
                            </CSVLink>
                            : null
                        }
                        <IconButton tooltip='Close' onClick={()=>{props.onChange(ACTION_CLOSE)}}><Icon style={{color:'rgba(118, 255, 3, 0.7)'}}>close</Icon></IconButton>
                    </div>
                </Box>
            </div>
        </Toolbar>
    )
}

export default DMEToolbar