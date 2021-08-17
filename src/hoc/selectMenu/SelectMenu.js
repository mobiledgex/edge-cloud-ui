import { Box, ListItem, ListItemText, Menu, Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import { Icon } from 'semantic-ui-react';
import SearchFilter from '../filter/SearchFilter'
import './style.css'

const SelectMenu = (props) => {
    const { labelKey, dataList } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [value, setValue] = React.useState(props.default)
    const [filterText, setFilterText] = React.useState('')


    const onClear = (e)=>{
        setValue(undefined)
        e.stopPropagation()
    }
    const Label = (props) => {
        const { tip, icon, placeholder, header, color, labelWidth, clear } = props
        return (
            icon ? icon :
                <div className='select-menu-label' style={{ color }}>
                    {header ? <strong>{header}:</strong> : null}
                    <Tooltip title={value ? value : ''}><Typography style={{ maxWidth: labelWidth ? labelWidth : 150, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-flex', marginRight: 5, marginLeft: 5 }}>{value ? value : placeholder}</Typography></Tooltip>
                    <Icon name='chevron down' className='select-menu-label-icon' style={{ float: 'right', color }} />
                    {clear ? <Icon onClick={onClear} name='close' className='select-menu-label-icon' style={{ float: 'right', color }} /> : null }
                </div>

        )
    }

    const onChange = (data) => {
        let isNone = data.label === 'None'
        props.onChange(isNone ? [] : [data])
        setValue(labelKey ? data[labelKey] : data)
        setAnchorEl(null)
    }

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

    return (
        <React.Fragment>
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
                {props.search ? <div style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}><SearchFilter onFilter={onFilter} /></div> : null}
                <div style={{ maxHeight: 300, overflow: 'auto', }}>
                    {
                        dataList.map((item, i) => {
                            let itemData = labelKey ? item[labelKey] : item
                            return (
                                itemData.toLowerCase().includes(filterText) ?
                                    <ListItem dense button key={i} onClick={() => { onChange(item) }}>
                                        <ListItemText id={1} primary={<Typography style={{ maxWidth: 250, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{itemData}</Typography>} />
                                    </ListItem> : null
                            )
                        })
                    }
                </div >
            </Menu>
        </React.Fragment>
    )
}

export default SelectMenu