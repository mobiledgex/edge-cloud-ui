
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Box, Checkbox, ListItem, ListItemIcon, ListItemText, Menu, Typography } from '@material-ui/core'
import { IconButton } from '../../../../hoc/mexui'
import cloneDeep from 'lodash/cloneDeep'
import CheckIcon from '@material-ui/icons/Check';
import { Icon } from 'semantic-ui-react';
import SearchFilter from '../../../../hoc/filter/SearchFilter';
import { validateRole } from '../../../../helper/constant/role';
import { FixedSizeList } from 'react-window';
import './style.css'
import { toFirstUpperCase } from '../../../../utils/string_utils';

const fetchArray = (props) => {
    const { data, field } = props
    return data.map(data => { return field ? data[field] : data })
}

const MonitoringMenu = (props) => {
    const { order, labelKey, large, search, icon, tip, multiple, showTick, field, disableDefault, fCaps } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [filterText, setFilterText] = React.useState('')
    const [dataList, setList] = React.useState([])
    const [value, setValue] = React.useState()
    const orgInfo = useSelector(state => state.organizationInfo.data)

    useEffect(() => {
        const { data, labelKey, search } = props
        if (search) {
            let filteredList = data && data.filter(item => {
                let value = item[labelKey]
                return value && value.toLowerCase().includes(filterText)
            })
            if (filteredList) {
                setList(filteredList)
            }
        }
    }, [filterText]);

    useEffect(() => {
        setList(props.data)
        setValue(disableDefault ? undefined : props.default ? props.default : (props.value ? props.value : (multiple ? fetchArray(props) : props.data[0])))
    }, [props.data, props.default]);

    const onChange = (data) => {
        if (multiple) {
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
        const { placeHolder } = props
        let data = props.value ? props.value : value
        data = data && labelKey ? data[labelKey] : data
        data = fCaps ? toFirstUpperCase(data) : data
        return data ? data : placeHolder
    }

    const renderIcon = () => (
        <IconButton tooltip={tip ? tip : ''} aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
            {
                icon ? icon :
                    <div className='monitoring-menu-label-main'>
                        <strong className='monitoring-menu-label'>{getLabel()}</strong>
                        <Icon name='chevron down' style={{ marginLeft: 5, color: 'rgba(118, 255, 3, 0.7)' }} />
                    </div>
            }
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

    const renderListItem = (index, item, itemData, selection) => {
        return (
            <ListItem key={index} role={undefined} dense button onClick={() => { onChange(field ? item[field] : item) }}>
                {multiple ?
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={selection.includes(field ? item[field] : item)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': 1 }}
                        />
                    </ListItemIcon> : null}
                <ListItemText id={1} primary={<Typography style={{ minWidth: showTick ? 40 : 'none', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{itemData}</Typography>} />{showTick && selection === item ? <CheckIcon style={{ marginLeft: 5 }} /> : null}
            </ListItem>
        )
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        let item = dataList[index]
        let itemData = labelKey ? item[labelKey] : item
        let selection = props.value ? props.value : value
        return (
            <div style={{ ...style }} >
                {renderListItem(index, item, itemData, selection)}
            </div>
        )
    }

    const fetchList = () => {
        return dataList.map((item, i) => {
            let itemData = labelKey ? item[labelKey] : item
            itemData = fCaps ? toFirstUpperCase(itemData) : itemData
            if (itemData.toLowerCase().includes(filterText)) {
                let valid = item.role ? validateRole(item.role, orgInfo) : true
                let selectedValue = props.value ? props.value : value
                return valid ? renderListItem(i, item, itemData, selectedValue) : null
            }
        })
    }

    const renderSearch = () => {
        return (
            search ? <div style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}>
                <SearchFilter onFilter={onFilter} clear={true} />
            </div> : null
        )
    }

    const renderList = () => (
        large ?
            (<FixedSizeList height={200} itemSize={40} itemCount={dataList.length}>
                {renderRow}
            </FixedSizeList>) :
            (<div style={{ maxHeight: 300, overflow: 'auto', }}>
                {fetchList()}
            </div>)
    )

    return (
        <Box order={order} p={icon ? 0.1 : 0.3}>
            {renderIcon()}
            <Menu
                id="monitoring-toolbar-menu"
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null) }}
                keepMounted
                open={Boolean(anchorEl)}
            >
                {renderSearch()}
                {renderList()}
            </Menu>
        </Box>
    )
}

export default MonitoringMenu