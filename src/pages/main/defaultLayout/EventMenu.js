import React from 'react'
import { useSelector } from 'react-redux'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HeaderGlobalAudit from '../events/auditLog/headerGlobalAudit';
import GlobalUsageLog from '../events/usageLog/GlobalUsageLog';
import EventNoteIcon from '@material-ui/icons/EventNote';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import {redux_org} from '../../../helper/reduxData'

const EventMenu = () => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [audit, setAudit] = React.useState(false);
    const [event, setEvent] = React.useState(false);
    const [usage, setUsage] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAudit(false)
        setEvent(false)
        setUsage(false)
    };

    const auditClick = () => {
        setAnchorEl(null);
        setAudit(true)
    };

    const eventClick = () => {
        setAnchorEl(null);
        setEvent(true)
    };

    const usageClick = () => {
        setAnchorEl(null);
        setUsage(true)
    };


    const visible = () => {
        return redux_org.role(orgInfo) !== undefined
    }

    const menuOptions = [
        { label: 'Audit Log', icon: <BallotOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: auditClick, visible: true },
        { label: 'Event Log', icon: <EventOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: eventClick, visible: true },
        { label: 'Usage Log', icon: <TimelineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />, onClick: usageClick, visible: true },
    ]

    return (
        visible() ? <div style={{ marginTop: '0.4em' }}>
            <IconButton aria-label="event-menu" aria-haspopup="true" onClick={handleClick}>
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
            <GlobalUsageLog open={usage} close={handleClose} />
        </div > : null
    )
}

export default EventMenu