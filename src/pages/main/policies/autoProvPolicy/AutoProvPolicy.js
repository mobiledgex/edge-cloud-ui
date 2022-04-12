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
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//redux
import * as actions from '../../../../actions';
//reg
import AutoProvPolicyReg from './Reg'
//model
import { localFields } from '../../../../services/fields';
import { keys, showAutoProvPolicies, deleteAutoProvPolicy, multiDataRequest } from '../../../../services/modules/autoProvPolicy';
import { showApps } from '../../../../services/modules/app';
//list
import DataView from '../../../../hoc/datagrid/DataView';
import { HELP_POLICY_LIST } from "../../../../tutorial";
import { perpetual, role } from '../../../../helper/constant';
import { developerRoles } from '../../../../constant';

class AutoProvPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.keys = keys()
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
        this.updateState({ currentView: <AutoProvPolicyReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    onAddCloudlet = (action, data) => {
        this.updateState({ currentView: <AutoProvPolicyReg data={data} action={perpetual.ADD_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudlet = (action, data) => {
        this.updateState({ currentView: <AutoProvPolicyReg data={data} action={perpetual.DELETE_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudletVisible = (data) => {
        return data[localFields.cloudletCount] > 0
    }

    onDelete = (data, success, errorInfo) => {
        if (!success, errorInfo) {
            if (errorInfo.message === 'Policy in use by App') {
                let appInfo = ''
                let length = 0
                if (data[localFields.apps]) {
                    let apps = data[localFields.apps]
                    length = apps.length
                    apps.map((app, i) => {
                        appInfo = appInfo + app
                        if (i !== length - 1) {
                            appInfo = appInfo + ', '
                        }
                    })
                }
                this.props.handleAlertInfo('error', `Policy in use by App${length > 1 ? 's' : ''} ${appInfo}`)
            }
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { label: 'Add Cloudlet', onClick: this.onAddCloudlet, type: 'Edit' },
            { label: 'Delete Cloudlet', visible: this.onDeleteCloudletVisible, onClick: this.onDeleteCloudlet, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAutoProvPolicy, onFinish: this.onDelete, type: 'Edit' }]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAutoProvPolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_AUTO_PROVISIONING_POLICY,
            headerLabel: 'Auto Provisioning Policy',
            nameField: localFields.autoPolicyName,
            requestType: [showAutoProvPolicies, showApps],
            isRegion: true,
            sortBy: [localFields.region, localFields.autoPolicyName],
            selection: true,
            keys: this.keys,
            onAdd: role.validateRole(developerRoles, this.props.organizationInfo) ? this.onAdd : undefined,
            viewMode: HELP_POLICY_LIST
        })
    }

    render() {
        const {currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_AUTO_PROVISIONING_POLICY} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={developerRoles} currentView={currentView} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicy));