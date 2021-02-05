import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import Profile from './profile';
import UpdatePassword from './updatePassword';
import Preferences from './preferences/preferences';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { LS_USER_META_DATA } from '../../../constant';
import { getOrganization, isAdmin } from '../../../services/model/format';

class headerGlobalMini extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
    
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {
        const { anchorEl, userInfo} = this.state
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
                    <Profile data={userInfo} currentUser={this.currentUser} close={this.handleClose}/>
                    {isAdmin() || getOrganization() ? <Preferences close={this.handleClose} /> : null}
                    <UpdatePassword close={this.handleClose} dialog={true}/>
                    <MenuItem onClick={() => this.logout('/logout')}>
                        <ExitToAppOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
            </div >
        )
    }

    currentUser = async ()=>{
        let mc = await serverData.currentUser(this);
        if (mc && mc.response && mc.response.data) {
            this.setState({userInfo: mc.response.data},()=>{
                localStorage.setItem(LS_USER_META_DATA, this.state.userInfo.Metadata)
            })
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
