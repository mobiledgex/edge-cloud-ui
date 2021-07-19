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