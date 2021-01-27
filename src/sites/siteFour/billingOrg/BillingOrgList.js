import React from 'react';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';

import MexListView from '../../../container/MexListView';
import { fields } from '../../../services/model/format';
import { showBillingOrg, deleteBillingOrg, keys } from '../../../services/model/billingOrg';
import Reg from './BillingOrgReg';
import {validateRole, operatorRoles, BILLING_REMOVE_CHILD, BILLING_TYPE_PARENT, BILLING_ADD_CHILD, PAGE_BILLING_ORG} from '../../../constant'
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
        if (actionId === BILLING_REMOVE_CHILD && data[fields.children] === undefined) {
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
        return data[fields.type] === BILLING_TYPE_PARENT.toLowerCase()
    }

    actionMenu = () => {
        return [
            // { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: BILLING_ADD_CHILD, label: 'Add Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { id: BILLING_REMOVE_CHILD, label: 'Remove Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { label: 'Delete', onClick: deleteBillingOrg, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteBillingOrg, icon: 'delete', warning: 'delete all the selected billing org', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: PAGE_BILLING_ORG,
            headerLabel: 'Billing Org',
            nameField: fields.name,
            requestType: [showBillingOrg],
            sortBy: [fields.name],
            selection: true,
            viewMode: HELP_ALERTS,
            keys: this.keys,
            onAdd: validateRole(operatorRoles) ? this.onReg : undefined,
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
