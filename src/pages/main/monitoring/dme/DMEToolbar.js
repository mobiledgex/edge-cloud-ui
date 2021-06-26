import { Box, Toolbar } from '@material-ui/core'
import React from 'react'
import { Select } from '../../../../hoc/mexui'

export const ACTION_DATA_TYPE = 'DataType'

const DataType = (props) => {
    const {order} = props
    const dataTypeList = ['avg', 'min', 'max']

    const onChange = (value) => {
        props.onChange(ACTION_DATA_TYPE, value)
    }
    
    return (
        <Box order={order}>
            <Select list={dataTypeList} onChange={onChange} value={dataTypeList[0]} width={50} height={120} upper={true}/>
        </Box>
    )
}
const DMEToolbar = (props) => {

    return (
        <Toolbar>
            <div style={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end">
                    <DataType order={1} {...props}/>
                </Box>
            </div>
        </Toolbar>
    )
}

export default DMEToolbar