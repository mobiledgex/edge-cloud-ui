import React from 'react'
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core'
import HeaderGlobalAudit from '../events/auditLog/headerGlobalAudit';
import GlobalEventLog from '../events/eventLog/GlobalEventLog';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { getUserRole } from '../../../services/model/format';
import * as constant from '../../../constant'
import TimelineIcon from '@material-ui/icons/Timeline';
import FindInPageIcon from '@material-ui/icons/FindInPage';
const EventMenu = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [audit, setAudit] = React.useState(false);
    const [event, setEvent] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAudit(false)
        setEvent(false)
    };

    const auditClick = () => {
        setAnchorEl(null);
        setAudit(true)
    };

    const eventClick = () => {
        setAnchorEl(null);
        setEvent(true)
    };

    const showEvent = () => {
        return getUserRole() && (getUserRole().includes(constant.DEVELOPER) || getUserRole().includes(constant.OPERATOR))
    }

    return (
        <div style={{ marginTop: '0.4em' }}>
            <IconButton aria-controls="event-menu" aria-haspopup="true" onClick={handleClick}>
                <EventNoteIcon />
            </IconButton>
            <Menu
                id="event-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={auditClick}>
                    <ListItemIcon>
                        <FindInPageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Audit Log" />
                </MenuItem>
                {showEvent() ?
                    <MenuItem onClick={eventClick}>
                        <ListItemIcon>
                            <TimelineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Billing Log" />
                    </MenuItem> : null}
            </Menu>
            <HeaderGlobalAudit open={audit} close={handleClose} />
            {showEvent() ? <GlobalEventLog open={event} close={handleClose} /> : null}
        </div >
    )
}

export default EventMenu