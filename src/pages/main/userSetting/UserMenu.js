/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import Profile from './Profile';
import Billing from './Billing';
import UpdatePassword from './UpdatePassword';
import Preferences from './preferences/Preferences';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { ListItemText, Menu, MenuItem } from '@material-ui/core';
import {IconButton} from '../../../hoc/mexui'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { redux_org } from '../../../helper/reduxData';
import { updatePwd } from '../../../services/modules/users';

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

    updateUserInfo = () => {
        let userInfo = this.props.userInfo
        userInfo['EnableTOTP'] = !userInfo['EnableTOTP']
        this.props.handleUserInfo(userInfo)
    }

    //kept seperate to isolate landing module
    onUpdatePwd = async (data) => {
        const {currentPassword, password} = data
        return await updatePwd(this, { currentPassword, password })
    }

    render() {
        const { anchorEl } = this.state
        const { userInfo } = this.props
        return (
            <div style={{ marginTop: '0.4em' }}>
                <IconButton tooltip='User Settings' onClick={this.handleClick}>
                    <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                    id="event-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <Profile onClose={this.handleClose} userInfo={userInfo} updateUserInfo={this.updateUserInfo} />
                    {redux_org.isAdmin(this) || redux_org.nonAdminOrg(this) ? <Preferences close={this.handleClose} /> : null}
                    <UpdatePassword close={this.handleClose} dialog={true} onUpdatePwd={this.onUpdatePwd}/>
                    {/* {redux_org.isDeveloperManager(this) ? <Billing onClose={this.handleClose}/> : null} */}
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
        organizationInfo: state.organizationInfo.data,
        userInfo: state.userInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleUserInfo: (data) => { dispatch(actions.userInfo(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(UserMenu));
