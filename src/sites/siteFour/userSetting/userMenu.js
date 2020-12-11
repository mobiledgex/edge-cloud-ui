import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import Profile from './profile';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


class headerGlobalMini extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openProfile: false,
            anchorEl: null,
            userInfo: {}
        }
    }

    logout(path) {
        this.props.handleLogout()
        this.props.history.push({
            pathname: path,
            userInfo: {}
        });

    }

    renderProfile = async () => {
        this.setState({ anchorEl: null, openProfile: true })
    }
    
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {
        const { anchorEl, openProfile, userInfo} = this.state
        return (
            <div style={{ marginTop: '0.4em' }}>
                <IconButton aria-controls="event-menu" aria-haspopup="true" onClick={this.handleClick}>
                    <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                    id="event-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.renderProfile()}>
                        <PersonOutlineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem>
                        <LockOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Change Password" />
                    </MenuItem>
                    <MenuItem onClick={() => this.logout('/logout')}>
                        <ExitToAppOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
                <Profile data={userInfo} open={openProfile} close={()=>{this.setState({openProfile:false})}} currentUser={this.currentUser}/>
            </div >
        )
    }

    currentUser = async ()=>{
        let mc = await serverData.currentUser(this);
        if (mc && mc.response && mc.response.data) {
            this.setState({userInfo: mc.response.data})
        }
    }

    componentDidMount() {
        this.currentUser()
    }
}


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLogout: () => { dispatch(actions.userLogout()) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(headerGlobalMini));
