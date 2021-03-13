import React from 'react'
import { Menu, MenuItem, IconButton, ListItemText } from '@material-ui/core'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import WhatsNew from './whatsnew'
import { tutor } from '../../../../tutorial'
import './style.css'
import { isAdmin } from '../../../../services/model/format';

const HelpMenu = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openNew, setOpenNew] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const docClick = () => {
        setAnchorEl(null);
        let path = tutor(props.viewMode, true)
        if (path) {
            window.open(tutor(props.viewMode, true), '_blank');
        }
    };

    const newClick = () => {
        setAnchorEl(null);
        setOpenNew(true);
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
                {isAdmin() ? null :<MenuItem onClick={docClick} disabled={!(props.viewMode && tutor(props.viewMode, true))}>
                    <DescriptionOutlinedIcon fontSize="small" color={props.viewMode && tutor(props.viewMode, true) ? 'inherit' : 'disabled'} style={{ marginRight: 15 }} />
                    <ListItemText primary="Guide" />
                </MenuItem>}
                <MenuItem onClick={newClick}>
                    <NewReleasesIcon fontSize="small" color={props.viewMode && tutor(props.viewMode, true) ? 'inherit' : 'disabled'} style={{ marginRight: 15 }} />
                    <ListItemText primary="What's new" />
                </MenuItem>
            </Menu>
            <WhatsNew open={openNew} close={()=>{setOpenNew(false)}}/>
        </div >
    )
}

export default HelpMenu