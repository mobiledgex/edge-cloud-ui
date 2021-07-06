import React from 'react'
import { Paper, Grow, Popper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'

const Action = (props) => {
    const { selectedRow, groupAction, viewerEdit,  } = props
    const [anchorEl, setAnchorEl] = React.useState(null)

    return (
        <React.Fragment>
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                    >
                        <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                            <ClickAwayListener onClickAway={() => this.setState({ anchorEl: null })}>
                                <MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow" >
                                    {/* {this.actionMenu.map((action, i) => {
                                        let visible = canEdit(this, viewerEdit, action) ? action.visible ? action.visible(selectedRow) : true : false
                                        visible = action.visibility ? action.visibility(perpetual.ACTION_VISIBLE, action, selectedRow) : visible
                                        visible = groupAction ? action.group : visible
                                        return visible ? <MenuItem key={i} onClick={(e) => { this.actionClose(action, groupAction) }} disabled={action.disable ? action.disable(perpetual.ACTION_DISABLE, action, selectedRow) : false}>{this.actionLabel(action, selectedRow)}</MenuItem> : null
                                    })} */}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    )

}

export default Action