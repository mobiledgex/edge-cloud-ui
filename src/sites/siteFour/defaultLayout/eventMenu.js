import React from 'react'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HeaderGlobalAudit from '../events/auditLog/headerGlobalAudit';
import GlobalBillingLog from '../events/billingLog/GlobalBillingLog';
import EventNoteIcon from '@material-ui/icons/EventNote';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import { getUserRole } from '../../../services/model/format';

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
        return getUserRole() !== undefined
    }

    const menuOptions = [
        { label: 'Audit Log', icon: <BallotOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: auditClick, visible :true },
        { label: 'Event Log', icon: <EventOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: eventClick, visible :true },
        { label: 'Billing Log', icon: <TimelineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: billingClick, visible :showBilling() },
    ]

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
                {menuOptions.map((option, i) => (
                    option && option.visible ? <MenuItem key={i} onClick={option.onClick}>
                        {option.icon}
                        <ListItemText primary={option.label} />
                    </MenuItem> : null
                ))}

            </Menu>
            <HeaderGlobalAudit open={event} close={handleClose} type={'event'} />
            <HeaderGlobalAudit open={audit} close={handleClose} type={'audit'} />
            <GlobalBillingLog open={billing} close={handleClose} />
        </div >
    )
}

export default EventMenu