import React from 'react'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HeaderGlobalAudit from '../events/auditLog/headerGlobalAudit';
import GlobalBillingLog from '../events/billingLog/GlobalBillingLog';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { getUserRole } from '../../../services/model/format';
import * as constant from '../../../constant'
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';

const EventMenu = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [audit, setAudit] = React.useState(false);
    const [event, setEvent] = React.useState(false);
    const [billing, setBilling] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAudit(false)
        setEvent(false)
        setBilling(false)
    };

    const auditClick = () => {
        setAnchorEl(null);
        setAudit(true)
    };

    const eventClick = () => {
        setAnchorEl(null);
        setEvent(true)
    };

    const billingClick = () => {
        setAnchorEl(null);
        setBilling(true)
    };

    const showBilling = () => {
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
                    <BallotOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Audit Log" />
                </MenuItem>
                <MenuItem onClick={eventClick}>
                    <EventOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Event Log" />
                </MenuItem>
                {showBilling() ?
                    <MenuItem onClick={billingClick}>
                        <TimelineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Billing Log" />
                    </MenuItem> : null}
            </Menu>
            <HeaderGlobalAudit open={event} close={handleClose} type={'event'} />
            <HeaderGlobalAudit open={audit} close={handleClose} type={'audit'} />
            {showBilling() ? <GlobalBillingLog open={billing} close={handleClose} /> : null}
        </div >
    )
}

export default EventMenu