import React from 'react'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import EmojiPeopleOutlinedIcon from '@material-ui/icons/EmojiPeopleOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import * as constant from '../../../constant'
import { tutor } from '../../../tutorial'
import { getUserRole } from '../../../services/model/format';

const HelpMenu = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const tutorialClick = () => {
        setAnchorEl(null);
        let currentStep = props.viewMode ? tutor(props.viewMode) : null;
        if (currentStep) {
            props.helpClick(currentStep)
        }
    };

    const docClick = () => {
        setAnchorEl(null);
        let path = tutor(props.viewMode, true)
        if (path) {
            window.open(tutor(props.viewMode, true), '_blank');
        }
    };

    return (
        <div style={{ marginTop: '0.4em' }}>
            <IconButton aria-controls="event-menu" aria-haspopup="true" onClick={handleClick}>
                <HelpOutlineOutlinedIcon />
            </IconButton>
            <Menu
                id="event-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={tutorialClick} disabled={props.viewMode !== null ? false : true}>
                    <EmojiPeopleOutlinedIcon fontSize="small" color={props.viewMode && tutor(props.viewMode) ? 'inherit' : 'disabled'} style={{ marginRight: 15 }} />
                    <ListItemText primary="Tutorial" />
                </MenuItem>
                {getUserRole() && getUserRole().includes(constant.DEVELOPER) ? <MenuItem onClick={docClick} disabled={props.viewMode !== null ? false : true}>
                    <DescriptionOutlinedIcon fontSize="small" color={props.viewMode === null ? 'disabled' : 'inherit'} style={{ marginRight: 15 }} />
                    <ListItemText primary="Doc" />
                </MenuItem> : null}
            </Menu>
        </div >
    )
}

export default HelpMenu