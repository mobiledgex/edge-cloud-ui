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
import * as actions from '../../../../actions';
import DataView from '../../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { localFields } from '../../../../services/fields';
import { developerRoles } from '../../../../constant'
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
        return redux_org.isOperator(this)
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