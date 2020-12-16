import React from 'react'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import EmojiPeopleOutlinedIcon from '@material-ui/icons/EmojiPeopleOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { tutor } from '../../../tutorial'

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
                {/* <MenuItem onClick={tutorialClick} disabled={!(props.viewMode && tutor(props.viewMode))}>
                    <EmojiPeopleOutlinedIcon fontSize="small" color={props.viewMode && tutor(props.viewMode) ? 'inherit' : 'disabled'} style={{ marginRight: 15 }} />
                    <ListItemText primary="Tutorial" />
                </MenuItem> */}
                <MenuItem onClick={docClick} disabled={!(props.viewMode && tutor(props.viewMode, true))}>
                    <DescriptionOutlinedIcon fontSize="small" color={props.viewMode && tutor(props.viewMode, true) ? 'inherit' : 'disabled'} style={{ marginRight: 15 }} />
                    <ListItemText primary="Guide" />
                </MenuItem>
            </Menu>
        </div >
    )
}

export default HelpMenu