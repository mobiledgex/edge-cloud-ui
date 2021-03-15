import React from 'react'
import { Button, Dialog, DialogActions, List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core'

const About = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [open, setOpen] = React.useState(false)

    const handleOpen = ()=>{
        setOpen(true);
        setAnchorEl(null);
    }

    const handleClose = ()=>{
        setAnchorEl(null);
    }

    const handleDialogClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <img className={props.className} width={40} height={40} src={props.src} onClick={(e)=>{setAnchorEl(e.currentTarget)}}  alt="MobiledgeX"/>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleOpen}>
                    About
                </MenuItem>
            </Menu>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                fullWidth={true}
                maxWidth={'xs'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <List>
                    <ListItem>
                        <ListItemText align="center">
                            <p>
                                <img src='/assets/brand/MobiledgeX_Logo_tm_white.svg'  alt="MobiledgeX"/>
                            </p>
                            <p>
                                <strong>{process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'version 0.0.0'}</strong>
                            </p>
                            <p>
                                <a href="https://mobiledgex.com/" target="_blank" style={{ color: '#69A228' }}>www.mobiledgex.com</a>
                            </p>
                        </ListItemText>
                    </ListItem>
                </List>
                <DialogActions>
                    <Button onClick={handleDialogClose}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    )
}

export default About