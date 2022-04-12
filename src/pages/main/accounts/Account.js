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

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { localFields } from '../../../services/fields';
import DataView from '../../../hoc/datagrid/DataView';
import { keys, showAccounts, deleteAccount, multiDataRequest, iconKeys } from '../../../services/modules/accounts';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import { perpetual } from '../../../helper/constant';
import { showUsers } from '../../../services/modules/users';
import { ADMIN_MANAGER } from '../../../helper/constant/perpetual';
import { EmailVerfied, Lock } from '../../../helper/formatter/ui';
import { settingLock } from '../../../services/modules/accounts/accounts';
import { sendVerify } from '../../../services/modules/landing';

class AccountList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddUserView: false,
            dialogMessageInfo: {},
            refreshViewToggle: false
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    /**Action menu block */
    deleteAction = (type, action, data) => {
        return data[localFields.role] === ADMIN_MANAGER
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAccount, type: 'Edit', disable: this.deleteAction }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAccount, icon: 'delete', warning: 'delete all the selected user\'s account', type: 'Edit' },
        ]
    }
    /*Action menu block*/

    /**
     * Customized data block
     * ** */

    onLocking = async (data) => {
        let locked = true;
        if (data[localFields.locked]) {
            locked = false
        }

        let requestData = { email: data[localFields.email], locked: locked }
        if (await settingLock(this, requestData)) {
            data[localFields.locked] = locked
            this.updateState({ refreshViewToggle: !this.state.refreshViewToggle })
        }
        return data[localFields.locked]
    }

    onSendEmail = async (username, email) => {
        let data = { username, email }
        if (await sendVerify(this, data)) {
            this.props.handleAlertInfo('success', 'Verification email sent')
        }
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        this.updateState({ dialogMessageInfo: {} })
        if (valid) {
            switch (action.field) {
                case localFields.emailVerified:
                    this.onSendEmail(action.username, action.email)
                    break;
            }
        }
    }

    sendEmailWarning = (username, email) => {
        this.updateState({
            dialogMessageInfo: {
                message: `Are you sure you want to send a verification email to ${email}?`,
                action: {
                    field: localFields.emailVerified,
                    username: username,
                    email: email
                }
            }
        });
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.emailVerified) {
            return <EmailVerfied column={key} data={data} isDetail={isDetail} callback={() => this.sendEmailWarning(data[localFields.username], data[localFields.email])} />
        }
        else if (key.field === localFields.locked) {
            return <Lock column={key} data={data} isDetail={isDetail} callback={this.onLocking} />
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_ACCOUNTS,
            headerLabel: 'Accounts',
            nameField: localFields.username,
            selection: true,
            requestType: [showAccounts, showUsers],
            sortBy: [localFields.username],
            filter: { role: ADMIN_MANAGER },
            keys: this.keys,
            viewMode: null,
            formatData: this.dataFormatter,
            iconKeys: iconKeys()
        })
    }

    render() {
        return (
            <Fragment>
                <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                <DataView id={perpetual.PAGE_ACCOUNTS} actionMenu={this.actionMenu} requestInfo={this.requestInfo} refreshToggle={this.state.refreshViewToggle} groupActionMenu={this.groupActionMenu} multiDataRequest={multiDataRequest} />
            </Fragment>
        )
    }

    componentDidMount(){
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AccountList));