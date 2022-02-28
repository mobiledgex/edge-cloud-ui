import React from 'react';
import DataView from '../../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../../services/model/format';
import { developerRoles, operatorRoles } from '../../../../constant'
import { perpetual, role } from '../../../../helper/constant';
import { keys, showTrustPolicyException, deleteTrustPolicyException } from '../../../../services/modules/trustPolicyException/trustPolicyException';
import TrustPolicyExceptionReg from './Reg'
import * as shared from '../../../../services/model/shared';

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
        this.updateState({ currentView: <TrustPolicyExceptionReg data={data} isUpdate={Boolean(action)} onClose={this.onRegClose} /> });
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
        if (key.field === fields.state) {
            return this.showStatus(data, isDetail)
        }
    }

    showStatus = (data) => {
        let progressRender = null
        progressRender = shared.showProgress(data)
        return progressRender
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
            nameField: fields.name,
            requestType: [showTrustPolicyException],
            sortBy: [fields.name],
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

export default withRouter(connect(mapStateToProps, null)(TrustPolicyExceptionList));