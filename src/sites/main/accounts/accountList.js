import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showAccounts, deleteAccount } from '../../../services/model/accounts';
import { Button, Icon } from 'semantic-ui-react';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import * as serverData from '../../../services/model/serverData'
import { ACTION_DELETE } from '../../../constant/actions';
import { uiFormatter } from '../../../helper/formatter';

class AccountList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            openAddUserView: false,
            dialogMessageInfo: {},
            refreshViewToggle: false
        }

        this.action = '';
        this.data = {}
        this.keys = keys();
    }



    /**Action menu block */
    deleteVisible = (data) => {
        return data[fields.username] !== 'mexadmin'
    }

    actionMenu = () => {
        return [
            { id: ACTION_DELETE, label: 'Delete', visible: this.deleteVisible, onClick: deleteAccount, type: 'Edit' }
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
        if (data[fields.locked]) {
            locked = false
        }

        let requestData = { email: data[fields.email], locked: locked }
        if (await serverData.settingLock(this, requestData)) {
            data[fields.locked] = locked
            this.setState({ refreshViewToggle: !this.state.refreshViewToggle })
        }
    }

    onSendEmail = async (username, email) => {
        let data = { username: username, email: email, callbackurl: `https://${window.location.host}/#/verify` }
        if (await serverData.sendVerify(this, data)) {
            this.props.handleAlertInfo('success', 'Verification email sent')
        }
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            switch (action.field) {
                case fields.emailVerified:
                    this.onSendEmail(action.username, action.email)
                    break;
            }
        }
    }

    sendEmailWarning = (username, email) => {
        this.setState({
            dialogMessageInfo: {
                message: `Are you sure you want to send a verification email to ${email}?`,
                action: {
                    field: fields.emailVerified,
                    username: username,
                    email: email
                }
            }
        });
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.emailVerified) {
            return uiFormatter.emailVerfied(key, data, isDetail, () => this.sendEmailWarning(data[fields.username], data[fields.email]))
        }
        else if (key.field === fields.locked) {
            return uiFormatter.lock(key, data, isDetail, this.onLocking)
        }
    }

    requestInfo = () => {
        return ({
            id: 'accounts',
            headerLabel: 'Accounts',
            nameField: fields.username,
            selection: true,
            requestType: [showAccounts],
            sortBy: [fields.username],
            keys: this.keys,
            viewMode: null,
            formatData: this.dataFormatter
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height: '100%' }}>
                    <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} refreshToggle={this.state.refreshViewToggle} groupActionMenu={this.groupActionMenu} />
                </div>
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(AccountList));