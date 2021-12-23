import React from 'react'
import { useSelector } from 'react-redux'
import { Grow, Popper, ClickAwayListener, MenuList, MenuItem, Paper } from '@material-ui/core'
import { ACTION_VISIBLE } from '../../helper/constant/perpetual'
import { redux_org } from '../../helper/reduxData'

const canEdit = (orgInfo, viewerEdit, action) => {
    let valid = true
    if (action.type === 'Edit') {
        if (redux_org.isViewer(orgInfo)) {
            valid = false
        }
    }
    return valid || viewerEdit
}

const Actions = (props) => {
    const { anchorEl, onClose, actionMenu, onClick, group, viewerEdit, data } = props   
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
                                            let visible = data && canEdit(orgInfo, viewerEdit, action) ? action.visible ? action.visible(data) : true : false
                                            visible = data && action.visibility ? action.visibility(ACTION_VISIBLE, action, data) : visible
                                            visible = group ? action.group : visible
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