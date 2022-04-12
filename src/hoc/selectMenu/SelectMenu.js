/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Box, ListItem, ListItemText, Menu, Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import SearchFilter from '../filter/SearchFilter'
import { Icon, IconButton } from '../mexui'

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
                <div style={{ color, display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                    {header ? <strong>{header}:</strong> : null}
                    <Tooltip title={value ?? ''}>
                        <strong style={{ fontSize: 13, maxWidth: labelWidth ?? 150, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginRight: 5, marginLeft: 5 }}>{value ? value : placeholder}</strong>
                    </Tooltip>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, float: 'right' }}>
                        <Icon name='chevron down' color={color}>keyboard_arrow_down</Icon>
                        {clear ? <IconButton size='small' onClick={onClear}><Icon color={color} size={16}>clear</Icon></IconButton> : null}
                    </div>
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
                {props.search ? <div style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}><SearchFilter onFilter={onFilter} clear={true}/></div> : null}
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