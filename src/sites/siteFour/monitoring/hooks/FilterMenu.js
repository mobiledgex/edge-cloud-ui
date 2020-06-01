import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import RoomIcon from '@material-ui/icons/Room';
import {Dropdown} from "semantic-ui-react";

const StyledPopper = withStyles({

})((props) => (
    <Popper
        elevation={0}
        getContentAnchorEl={null}
        placement="bottom-start"
        modifiers={{
            flip: {
                enabled: false,
            },
            preventOverflow: {
                enabled: false,
            },
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function FilterMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='page_monitoring_location'>
            <Button
                className='page_monitoring_location_button'
                aria-describedby={"customized-popper"}
                // aria-controls="customized-menu"
                // aria-haspopup="true"
                variant="contained"
                onClick={handleClick}
            >
                <RoomIcon style={{color: 'rgb(118, 255, 3)'}} />
            </Button>
            <div className='page_monitoring_location_text'>
                {'All'}
            </div>
            <StyledPopper
                style={{
                    marginTop:5,
                    border: '1px solid #96c8da',
                    borderRadius:4,
                    backgroundColor:'#1b1c1d',
                    padding: '0 20px 10px 20px'
                }}
                id="customized-popper"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <div className="page_monitoring_location_header">
                    Select location
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        Region
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder='All'
                            fluid
                            search
                            selection
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        Cluster / Cloudlet
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder='All'
                            fluid
                            search
                            selection
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        App Instance
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder='All'
                            fluid
                            search
                            selection
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_apply">
                    <Button style={{backgroundColor:'#6b7487', color:'#fff'}} variant="contained" >Apply</Button>
                </div>
            </StyledPopper>
        </div>
    );
}
