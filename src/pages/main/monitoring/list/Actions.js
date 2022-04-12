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

import React from 'react'
import { useSelector } from 'react-redux'
import { Grow, Popper, ClickAwayListener, MenuList, MenuItem, Paper } from '@material-ui/core'
import { validateRole } from '../../../../helper/constant/role'
import { redux_org } from '../../../../helper/reduxData'


const Actions = (props) => {
    const { anchorEl, onClose, actionMenu, onClick, group } = props
    const orgInfo = useSelector(state => state.organizationInfo.data)
    return (
        <React.Fragment>
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal style={{ zIndex: 999 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                    >
                        <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                            <ClickAwayListener onClickAway={onClose}>
                                <MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow" >
                                    {
                                        actionMenu.map((action, i) => {
                                            let visible = group ? action.group : true
                                            visible = visible && action.roles ? validateRole(action.roles, orgInfo) : visible
                                            return visible ? <MenuItem key={i} onClick={(e) => { onClick(e, { ...action, group }) }}>{action.label}</MenuItem> : null
                                        })
                                    }
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    )
}

export default Actions