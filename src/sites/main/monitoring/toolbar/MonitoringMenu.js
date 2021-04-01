import { Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, Menu, Tooltip } from '@material-ui/core'
import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect } from 'react'
import { validateRole } from '../helper/Constant'
import CheckIcon from '@material-ui/icons/Check';
import { Icon } from 'semantic-ui-react';
import SearchFilter from '../../events/SearchFilter'

const fetchArray = (props) => {
    return props.data.map(data => { return props.field ? data[props.field] : data })
}

const MonitoringMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [filterText, setFilterText] = React.useState('')
    const [value, setValue] = React.useState([])

    useEffect(() => {
        setValue(props.disableDefault ? undefined : props.default ? props.default : (props.value ? props.value : (props.multiple ? fetchArray(props) : props.data[0])))
    }, [props.default, props.value, props.disableDefault, props.data])

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

    const getLabel = () => {
        return props.value ? props.value[props.labelKey] : value ? value[props.labelKey] : props.placeHolder
    }

    const renderIcon = () => (
        <IconButton aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
            {props.icon ? props.icon : <strong style={{ color: 'rgba(118, 255, 3, 0.7)', border: 'solid 1px rgba(118, 255, 3, 0.7)', borderRadius: 5, maxWidth: 150, fontSize: 12, padding: 5, marginTop: -4 }}>{getLabel()} <Icon name='chevron down' style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }} /></strong>}
        </IconButton>
    )

    const onFilter = (value, clear) => {
        if (clear) {
            setFilterText('')
        }
        else {
            if (value !== undefined && value.length >= 0) {
                setFilterText(value.toLowerCase())
            }
        }
    }

    const fetchList = (dataList) => {
        return dataList.map((item, i) => {
            let itemData = props.labelKey ? item[props.labelKey] : item
            if (itemData.toLowerCase().includes(filterText)) {
                let valid = item.role ? validateRole(item.role) : true
                let selectedValue = props.value ? props.value : value
                return valid ? <ListItem key={i} role={undefined} dense button onClick={() => { onChange(props.field ? item[props.field] : item) }}>
                    {props.multiple ?
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={selectedValue.includes(props.field ? item[props.field] : item)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': 1 }}
                            />
                        </ListItemIcon> : null}
                    <ListItemText id={1} primary={itemData} />{props.showTick && selectedValue === item ? <CheckIcon style={{ marginLeft: 10 }} /> : null}
                </ListItem> : null
            }
        })
    }

    return (
        <Box order={props.order}>
            {props.tip ? <Tooltip title={<strong style={{ fontSize: 13 }}>{props.tip}</strong>} arrow>
                {renderIcon()}
            </Tooltip> : renderIcon()}
            <Menu
                id="monitoring-toolbar-menu"
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null) }}
                keepMounted
                open={Boolean(anchorEl)}
            >
                {props.search ? <div style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}><SearchFilter onFilter={onFilter} /></div> : null}
                <div style={{ maxHeight: 300, overflow: 'auto', }}>
                    {fetchList(props.data)}
                </div>
            </Menu>
        </Box>
    )
}

export default MonitoringMenu