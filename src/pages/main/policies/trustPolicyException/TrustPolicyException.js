import React from 'react';
import * as actions from '../../../../actions';
import DataView from '../../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { localFields } from '../../../../services/fields';
import { developerRoles, operatorRoles } from '../../../../constant'
import { perpetual, role } from '../../../../helper/constant';
import { keys, showTrustPolicyException, deleteTrustPolicyException } from '../../../../services/modules/trustPolicyException/trustPolicyException';
import TrustPolicyExceptionReg from './Reg'
import { serverFields, uiFormatter } from '../../../../helper/formatter';
import { redux_org } from '../../../../helper/reduxData';

class TrustPolicyExceptionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false;
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

    onAdd = (action, data) => {
        if (action && redux_org.isDeveloper(this) && data[localFields.state] === serverFields.APPROVAL_REQUESTED) {
            this.props.handleAlertInfo('error', 'Cannot update if approval is pending')
        }
        else {
            this.updateState({ currentView: <TrustPolicyExceptionReg data={data} isUpdate={Boolean(action)} onClose={this.onRegClose} /> });
        }
    }

    onDeleteAction = (type, action, data) => {
        return role.validateRole(operatorRoles, this.props.organizationInfo)
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteTrustPolicyException, type: 'Edit', disable: this.onDeleteAction },
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteTrustPolicyException, icon: 'delete', warning: 'delete all the selected Trust Policy Exception', type: 'Edit' },
        ]
    }

    canAdd = () => {
        if (role.validateRole(developerRoles, this.props.organizationInfo)) {
            return this.onAdd
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.state) {
            return uiFormatter.TPEState(data, isDetail)
        }
    }

    canAdd = () => {
        if (role.validateRole(developerRoles, this.props.organizationInfo)) {
            return this.onAdd
        }
    }
    requestInfo = () => {
        return ({
            id: perpetual.PAGE_TRUST_POLICY_EXCEPTION,
            headerLabel: 'Trust Policy Exception',
            nameField: localFields.name,
            requestType: [showTrustPolicyException],
            sortBy: [localFields.name],
            isRegion: true,
            keys: keys(),
            onAdd: this.canAdd(),
            selection: role.validateRole(developerRoles, this.props.organizationInfo),
            formatData: this.dataFormatter
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <React.Fragment>
                <DataView currentView={currentView} resetView={this.resetView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
            </React.Fragment>
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(TrustPolicyExceptionList));