import React from 'react';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../../actions';
//redux
import { connect } from 'react-redux';

import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';
import { showBillingOrg, deleteBillingOrg, keys } from '../../../../services/model/billingOrg';

import Invoices from '../invoices/Invoices';
import Reg from './BillingOrgReg';
import { perpetual } from '../../../../helper/constant';
import { redux_org } from '../../../../helper/reduxData';
class BillingOrg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.action = '';
        this.data = {};
        this.keys = keys();
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onReg = (action, data) => {
        let valid = true
        let actionId = action ? action.id : undefined
        if (actionId === perpetual.ACTION_BILLING_REMOVE_CHILD && data[fields.children] === undefined) {
            valid = false
        }
        if (valid) {
            this.updateState({ currentView: <Reg data={data} action={actionId} onClose={this.onRegClose} /> });
        }
        else {
            this.props.handleAlertInfo('error', 'Nothing to remove')
        }
    }

    orgActionVisible = (data) => {
        return data[fields.type] === perpetual.BILLING_TYPE_PARENT.toLowerCase()
    }

    invoices = async (action, data) => {
        this.updateState({ currentView: <Invoices data={data} onClose={this.onRegClose} /> });
    }

    onBillingAction = (type, action, data) => {
        return redux_org.isAdmin(this)
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onReg, type: 'Edit' },
            { label: 'Invoices', onClick: this.invoices, type: 'Edit' },
            { id: perpetual.ACTION_BILLING_ADD_CHILD, label: 'Add Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { id: perpetual.ACTION_BILLING_REMOVE_CHILD, label: 'Remove Child', onClick: this.onReg, visible: this.orgActionVisible, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteBillingOrg, visibility: this.onBillingAction, type: 'Edit' }
        ]
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_BILLING_ORG,
            headerLabel: 'Billing Org',
            nameField: fields.name,
            requestType: [showBillingOrg],
            sortBy: [fields.name],
            keys: this.keys,
            onAdd: redux_org.isAdmin(this) ? this.onReg : undefined,
            grouping: false
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_BILLING_ORG} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
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
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(BillingOrg));
