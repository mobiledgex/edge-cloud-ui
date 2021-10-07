import React, { Component, Fragment } from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showAccounts, deleteAccount, multiDataRequest } from '../../../services/modules/accounts';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import * as serverData from '../../../services/model/serverData';
import { perpetual } from '../../../helper/constant';
import { uiFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { showUsers } from '../../../services/modules/users';
import { ADMIN_MANAGER } from '../../../helper/constant/perpetual';

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
        return data[fields.role] === ADMIN_MANAGER
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
        if (data[fields.locked]) {
            locked = false
        }

        let requestData = { email: data[fields.email], locked: locked }
        if (await serverData.settingLock(this, requestData)) {
            data[fields.locked] = locked
            this.updateState({ refreshViewToggle: !this.state.refreshViewToggle })
        }
        return data[fields.locked]
    }

    onSendEmail = async (username, email) => {
        let data = { username: username, email: email, callbackurl: `https://${window.location.host}/#/verify` }
        if (await serverData.sendVerify(this, data)) {
            this.props.handleAlertInfo('success', 'Verification email sent')
        }
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        this.updateState({ dialogMessageInfo: {} })
        if (valid) {
            switch (action.field) {
                case fields.emailVerified:
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
            id: perpetual.PAGE_ACCOUNTS,
            headerLabel: 'Accounts',
            nameField: fields.username,
            selection: true,
            requestType: [showAccounts, showUsers],
            sortBy: [fields.username],
            filter: { role: ADMIN_MANAGER },
            keys: this.keys,
            viewMode: null,
            formatData: this.dataFormatter
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