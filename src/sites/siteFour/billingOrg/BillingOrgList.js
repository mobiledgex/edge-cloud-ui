import React from 'react';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';

import MexListView from '../../../container/MexListView';
import { fields, getUserRole } from '../../../services/model/format';
import { showBillingOrg, deleteBillingOrg, keys } from '../../../services/model/billingOrg';
import Reg from './BillingOrgReg';
import * as constant from '../../../constant'
import { HELP_ALERTS } from '../../../tutorial';

class BillingOrg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = keys();
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onReg = (action, data) => {
        let valid = true
        let actionId = action ? action.id : undefined
        if (actionId === constant.BILLING_REMOVE_CHILD && data[fields.children] === undefined) {
            valid = false
        }
        if (valid) {
            this.setState({ currentView: <Reg data={data} action={actionId} onClose={this.onRegClose} /> });
        }
        else {
            this.props.handleAlertInfo('error', 'Nothing to remove')
        }
    }

    orgActionVisible = (data) => {
        return data[fields.type] === constant.BILLING_TYPE_PARENT.toLowerCase()
    }

    actionMenu = () => {
        return [
            // { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: constant.BILLING_ADD_CHILD, label: 'Add Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { id: constant.BILLING_REMOVE_CHILD, label: 'Remove Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { label: 'Delete', onClick: deleteBillingOrg, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteBillingOrg, icon: 'delete', warning: 'delete all the selected billing org', type: 'Edit' },
        ]
    }

    canAdd = () => {
        let valid = false
        let role = getUserRole();
        if (role === constant.ADMIN_MANAGER || role === constant.OPERATOR_MANAGER || role === constant.OPERATOR_CONTRIBUTOR) {
            valid = true
        }
        return valid
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_BILLING_ORG,
            headerLabel: 'Billing Org',
            nameField: fields.name,
            requestType: [showBillingOrg],
            sortBy: [fields.name],
            selection: true,
            viewMode: HELP_ALERTS,
            keys: this.keys,
            onAdd: this.canAdd() ? this.onReg : undefined,
            grouping: false
        })
    }

    customizedData = () => {

    }


    componentDidMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(BillingOrg));
