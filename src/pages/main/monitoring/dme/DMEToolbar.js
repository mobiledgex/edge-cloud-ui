import { Box, Toolbar } from '@material-ui/core'
import React from 'react'
import { IconButton, Select, Icon } from '../../../../hoc/mexui'

export const ACTION_DATA_TYPE = 'DataType'
export const ACTION_CLOSE = 'Close'

const DataType = (props) => {
    const {order} = props
    const dataTypeList = ['avg', 'min', 'max']

    const onChange = (value) => {
        props.onChange(ACTION_DATA_TYPE, value)
    }
    
    return (
        <Box order={order} m={2.5}>
            <Select list={dataTypeList} onChange={onChange} value={dataTypeList[0]} width={50} height={120} upper={true}/>
        </Box>
    )
}

const Close = (props) => {
    const {order} = props

    return (
        <Box order={order}>
            <IconButton tooltip='Close' onClick={()=>{props.onChange(ACTION_CLOSE)}}><Icon>close</Icon></IconButton>
        </Box> 
    )
}
const DMEToolbar = (props) => {

    return (
        <Toolbar variant='dense'>
            <div style={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end">
                    <Close order={2} {...props}/>
                    <DataType order={1} {...props}/>
                </Box>
            </div>
        </Toolbar>
    )
}

export default DMEToolbar