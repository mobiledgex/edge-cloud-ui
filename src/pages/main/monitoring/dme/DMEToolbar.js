import { Box, Toolbar } from '@material-ui/core'
import React from 'react'
import { IconButton, Select, Icon, Picker } from '../../../../hoc/mexui'

export const ACTION_DATA_TYPE = 'DataType'
export const ACTION_LATENCY_RANGE = 'LatencyRange'
export const ACTION_CLOSE = 'Close'
export const ACTION_PICKER = 'Picker'

const DataType = (props) => {
    const {order} = props
    const dataTypeList = ['avg', 'min', 'max']

    const onChange = (value) => {
        props.onChange(ACTION_DATA_TYPE, value)
    }
    
    return (
        <Box order={order} m={1.2}>
            <Select list={dataTypeList} onChange={onChange} value={dataTypeList[0]} width={50} height={120} upper={true} color='rgba(118, 255, 3, 0.7)' border={true}/>
        </Box>
    )
}

const LatencyRange = (props) =>{
    const {order} = props
    const dataTypeList = ['> 0ms', '> 5ms', '> 10ms', '> 25ms', '> 50ms', '> 100ms']

    const onChange = (value) => {
        props.onChange(ACTION_LATENCY_RANGE, value)
    }
    
    return (
        <Box order={order} m={1.2}>
            <Select list={dataTypeList} onChange={onChange} value={dataTypeList[0]} width={50} height={150} upper={true} color='rgba(118, 255, 3, 0.7)' border={true}/>
        </Box>
    )
}

const MPicker = (props) => {
    const { order } = props
    return (
        <Box order={order} style={{ marginLeft: 15, marginRight: 10 }} m={1.2}>
            <Picker onChange={(value) => { props.onChange(ACTION_PICKER, value) }}/>
        </Box>
    )
}

const Close = (props) => {
    const {order} = props

    return (
        <Box order={order}>
            <IconButton tooltip='Close' onClick={()=>{props.onChange(ACTION_CLOSE)}}><Icon style={{color:'rgba(118, 255, 3, 0.7)'}}>close</Icon></IconButton>
        </Box> 
    )
}
const DMEToolbar = (props) => {

    return (
        <Toolbar>
            <div style={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end">
                    <Close order={4} {...props}/>
                    <DataType order={2} {...props}/>
                    <LatencyRange order={3} {...props}/>
                    <MPicker order={1} {...props}/>
                </Box>
            </div>
        </Toolbar>
    )
}

export default DMEToolbar