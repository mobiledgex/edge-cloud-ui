
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, Menu, Tooltip, Typography } from '@material-ui/core'
import cloneDeep from 'lodash/cloneDeep'
import { validateRole } from '../helper/montconstant'
import CheckIcon from '@material-ui/icons/Check';
import { Icon } from 'semantic-ui-react';
import SearchFilter from '../../../../hoc/filter/SearchFilter'
import { redux_org } from '../../../../helper/reduxData';
import './style.css'

const fetchArray = (props) => {
    return props.data.map(data => { return props.field ? data[props.field] : data })
}

const MonitoringMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [filterText, setFilterText] = React.useState('')
    const [value, setValue] = React.useState(props.disableDefault ? undefined : props.default ? props.default : (props.value ? props.value : (props.multiple ? fetchArray(props) : props.data[0])))
    const orgInfo = useSelector(state => state.organizationInfo.data)

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
        const { labelKey, placeHolder, allCaps } = props
        let data = props.value ? props.value : value
        data = data && labelKey ? data[labelKey] : data
        data = allCaps ? data.toUpperCase() : data
        return data ? data : placeHolder
    }

    const renderIcon = () => (
        <IconButton aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
            {props.icon ? props.icon : <div className='monitoring-menu-label-main'><strong className='monitoring-menu-label'>{getLabel()}</strong><Icon name='chevron down' style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }} /></div>}
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
                let valid = item.role ? validateRole(item.role, redux_org.roleType(orgInfo)) : true
                let selectedValue = props.value ? props.value : value
                return valid ?
                    <ListItem key={i} role={undefined} dense button onClick={() => { onChange(props.field ? item[props.field] : item) }}>
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
                        <ListItemText id={1} primary={<Typography style={{ minWidth: props.showTick ? 40 : 'none', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{itemData}</Typography>} />{props.showTick && selectedValue === item ? <CheckIcon style={{ marginLeft: 5 }} /> : null}
                    </ListItem> : null
            }
        })
    }
    return (
        <Box order={props.order} p={0.1}>
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
                {props.search ? <div style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}><SearchFilter onFilter={onFilter} clear={true}/></div> : null}
                <div style={{ maxHeight: 300, overflow: 'auto', }}>
                    {fetchList(props.data)}
                </div>
            </Menu>
        </Box>
    )
}

export default MonitoringMenu