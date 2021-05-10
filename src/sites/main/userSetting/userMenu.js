import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import Profile from './profile';
import UpdatePassword from './updatePassword';
import Preferences from './preferences/preferences';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { redux_org } from '../../../helper/reduxData';

class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    logout = () => {
        this.props.history.push('/logout');
    }

    handleClick = (event) => {
        this.updateState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.updateState({ anchorEl: null });
    }

    render() {
        const { anchorEl } = this.state
        const { userInfo } = this.props
        return (
            <div style={{ marginTop: '0.4em' }}>
                <IconButton aria-label="user-menu" aria-haspopup="true" onClick={this.handleClick}>
                    <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                    id="event-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <Profile data={userInfo} currentUser={this.currentUser} close={this.handleClose} />
                    {redux_org.isAdmin(this) || redux_org.nonAdminOrg(self) ? <Preferences close={this.handleClose} /> : null}
                    <UpdatePassword close={this.handleClose} dialog={true} />
                    <MenuItem onClick={() => this.logout()}>
                        <ExitToAppOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
            </div >
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo.data,
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(UserMenu));
