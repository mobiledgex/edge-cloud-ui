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
import DataView from '../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
import { localFields } from '../../../services/fields';
import { keys, showUsers, deleteUser } from '../../../services/modules/users';
import { HELP_USER_ROLES } from '../../../tutorial';
import { connect } from 'react-redux';
import { redux_org } from '../../../helper/reduxData';
import { perpetual } from '../../../helper/constant';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddUserView: false,
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    /**Action menu block */
    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove ${data[localFields.username]} from Organization ${data[localFields.organizationName]}?`
    }

    onDeleteAction = (type, action, data) => {
        if (this.props.roleInfo && !redux_org.isAdmin(this)) {
            let roleInfoList = this.props.roleInfo;
            for (let roleInfo of roleInfoList) {
                if (roleInfo[localFields.organizationName] === data[localFields.organizationName]) {
                    return !roleInfo.role.includes('Manager')
                }
            }
        }
        return false
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteUser, dialogMessage: this.getDeleteActionMessage, disable: this.onDeleteAction, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteUser, icon: 'delete', warning: 'remove selected user\'s from assigned organization', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_USER_ROLES,
            headerLabel: 'Users & Roles',
            nameField: localFields.username,
            requestType: [showUsers],
            sortBy: [localFields.username],
            selection: true,
            keys: this.keys,
            viewMode: HELP_USER_ROLES,
            grouping: true
        })
    }


    render() {
        return (
            <DataView id={perpetual.PAGE_USER_ROLES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        roleInfo: state.roleInfo ? state.roleInfo.role : null
    }
};

export default withRouter(connect(mapStateToProps, null)(UserList));
