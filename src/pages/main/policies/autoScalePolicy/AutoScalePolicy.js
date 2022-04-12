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
import DataView from '../../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import AutoScalePolicyReg from './Reg'
import { keys, showAutoScalePolicies, deleteAutoScalePolicy } from '../../../../services/modules/autoScalePolicy';
import {HELP_SCALE_POLICY} from "../../../../tutorial";
import { perpetual, role } from '../../../../helper/constant';
import { localFields } from '../../../../services/fields';
import { developerRoles } from '../../../../constant';
class AutoScalePolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
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

    onRegClose = (isEdited)=>
    {
        this.resetView()
    }

    onAdd = () => {
        this.updateState({ currentView: <AutoScalePolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <AutoScalePolicyReg data={data} action='Update' onClose={this.onRegClose} /> })
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAutoScalePolicy, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAutoScalePolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id:perpetual.PAGE_AUTO_SCALE_POLICY,
            headerLabel: 'Auto Scale Policy',
            requestType: [showAutoScalePolicies],
            isRegion: true,
            nameField: localFields.autoScalePolicyName,
            sortBy: [localFields.region, localFields.autoScalePolicyName],
            keys: this.keys,
            onAdd: role.validateRole(developerRoles, this.props.organizationInfo) ? this.onAdd : undefined,
            selection:true,
            viewMode : HELP_SCALE_POLICY
        })
    }

    render() {
        const {currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_AUTO_SCALE_POLICY} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={developerRoles} currentView={currentView} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoScalePolicy));
