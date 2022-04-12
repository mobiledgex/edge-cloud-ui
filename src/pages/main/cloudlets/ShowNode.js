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
import { Card, Box, IconButton } from '@material-ui/core'
import { syntaxHighLighter } from '../../../hoc/highLighter/highLighter'
import CloseIcon from '@material-ui/icons/Close';

const ShowNode = (props) => {
    const dataArray = props.data

    const getHighLighter = (language, data) => {
        return (
            <div style={{ backgroundColor: 'grey', padding: 1, maxWidth: '50vw', border: '1px solid #808080' }}>
                {syntaxHighLighter(language, data.toString())}
            </div>
        )
    }

    return (
        dataArray && dataArray.length > 0 ?
            <Card style={{ backgroundColor: '#2A2C33' }}>
                <div style={{ color: 'white' }}>
                    <Box display="flex" p={1}>
                        <Box p={1} flexGrow={1}>
                            <h2><b>Nodes</b></h2>
                        </Box>
                        <Box p={1}>
                            <IconButton onClick={() => props.onClose(true)}><CloseIcon /></IconButton>
                        </Box>
                    </Box>
                    <div style={{ height: 'calc(86vh - 5px)', paddingLeft: 10, overflowY: 'auto' }}>
                        {dataArray.map((data, i) => {
                            return (
                                <div key={i} style={{ marginBottom: 10 }}>
                                    {getHighLighter('json', JSON.stringify(data, null, 1))}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Card> : null
    )
}

export default ShowNode