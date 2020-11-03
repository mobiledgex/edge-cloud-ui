import { Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, Menu } from '@material-ui/core'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { getUserRole } from '../../../../services/model/format'

const fetchArray = (props) => {
    return props.data.map(data => { return props.field ? data[props.field] : data })
}

const MonitoringMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [value, setValue] = React.useState(props.multiple ? fetchArray(props) : props.data[0])

    const onChange = (data) => {
        if (props.multiple) {
            let values = cloneDeep(value)
            if (values.includes(data)) {
                values = values.filter(item => {
                    return item !== data
                })
            }
            else {
                values.push(data)
            }
            if (props.onChange) {
                props.onChange(values)
            }
            setValue(values)
        }
        else {
            setValue(data)
            if (props.onChange) {
                props.onChange(data)
            }
            setAnchorEl(null)
        }
    }

    return (
        <Box order={props.order}>
            <IconButton aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                {props.icon ? props.icon : <strong style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)', borderRadius: 5, maxWidth: 100, height: 20, fontSize: 12, padding: '2px 5px 0px 5px' }}>{value[props.labelKey]}</strong>}
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null) }}
                keepMounted
                open={Boolean(anchorEl)}
            >
                {props.data.map((item, i) => {
                    let valid = item.role ? getUserRole().includes(item.role) : true
                    return valid ? <ListItem key={i} role={undefined} dense button onClick={() => { onChange(props.field ? item[props.field] : item) }}>
                        {props.multiple ?
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={value.includes(props.field ? item[props.field] : item)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': 1 }}
                                />
                            </ListItemIcon> : null}
                        <ListItemText id={1} primary={props.labelKey ? item[props.labelKey] : item} />
                    </ListItem> : null
                })}
            </Menu>
        </Box>
    )
}

export default MonitoringMenu