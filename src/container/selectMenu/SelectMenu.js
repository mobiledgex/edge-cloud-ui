import { Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, Menu, Tooltip } from '@material-ui/core'
import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect } from 'react'
import CheckIcon from '@material-ui/icons/Check';
import { Icon } from 'semantic-ui-react';
import './style.css'

/****
 * 
 */


const SelectMenu = (props) => {
    const { labelKey, dataList } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [value, setValue] = React.useState(props.default)

    const Label = (props) => {
        const { tip, icon, placeholder, header } = props
        return (
            icon ? icon :
                <strong className='select-menu-label'>
                    <strong>{header}:</strong>
                    &nbsp;&nbsp;
                    {value ? value : placeholder}
                    &nbsp;&nbsp;
                    <Icon name='chevron down' className='select-menu-label-icon' />
                </strong>

        )
    }

    const onChange = (data) => {
        let isNone = data.label === 'None'
        props.onChange(isNone ? [] : [data])
        setValue(labelKey ? data[labelKey] : data)
        setAnchorEl(null)
    }

    return (
        <Box>
            <Tooltip title={props.tip ? <strong style={{ fontSize: 13 }}>{props.tip}</strong> : ''} arrow>
                <div style={{ display: 'inline', cursor: 'pointer' }} aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <Label {...props} />
                </div>
            </Tooltip>
            <Menu
                id="toolbar-menu"
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null) }}
                keepMounted
                open={Boolean(anchorEl)}
            >
                <div style={{ maxHeight: 300, overflow: 'auto', }}>
                    {
                        dataList.map((item, i) => {
                            let itemData = labelKey ? item[labelKey] : item
                            return (
                                <ListItem dense button key={i} onClick={() => { onChange(item) }}>
                                    <ListItemText id={1} primary={itemData} />
                                </ListItem>
                            )
                        })
                    }
                </div >
            </Menu>
        </Box>
    )
}

export default SelectMenu