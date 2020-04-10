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

class OrganizationList extends React.Component {
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
        this.keys = Object.assign([], keys);
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAccount }
        ]
    }
    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'accounts',
            headerLabel: 'Accounts',
            nameField: fields.username,
            requestType: [showAccounts],
            sortBy: [fields.username],
            keys: this.keys,
        })
    }

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

    getLock = (data, isDetailView) => {
        if (isDetailView) {
            return data ? 'Yes' : 'No'
        }
        else {
            let lock = data[fields.locked];
            return (
                <Icon name={lock === true ? 'lock' : 'lock open'} style={{ color: lock === true ? '#6a6a6a' : 'rgba(136,221,0,.9)' }} onClick={() => this.onLocking(data)} />
            )
        }
    }

    onSendEmail = async (username, email) => {
        let data = { username: username, email: email, callbackurl: `https://${window.location.host}/verify` }
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

    getEmailVerfied = (data, isDetailView) => {
        if (isDetailView) {
            return data ? 'Yes' : 'No'
        }
        else {
            return (
                (data[fields.emailVerified] === true) ? <Icon name='check' style={{ color: 'rgba(136,221,0,.9)' }} />
                    :
                    <Button onClick={() => this.sendEmailWarning(data[fields.username], data[fields.email])}>Verify</Button>
            )
        }
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.emailVerified) {
                key.customizedData = this.getEmailVerfied
            }
            else if (key.field === fields.locked) {
                key.customizedData = this.getLock
            }
        }
    }

    /**
    * Customized data block
    * ** */

    componentWillMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height:'100%' }}>
                    <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} refreshToggle={this.state.refreshViewToggle} />
                </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        roleInfo: state.roleInfo ? state.roleInfo.role : null,
        userRole: state.showUserRole ? state.showUserRole.role : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) },
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationList));
