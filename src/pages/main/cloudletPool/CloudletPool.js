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
import DataView from '../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { localFields } from '../../../services/fields';
import { redux_org } from '../../../helper/reduxData';
import { keys, showCloudletPools, deleteCloudletPool, multiDataRequest } from '../../../services/modules/cloudletPool';
import CloudletPoolReg from './Reg';
import {HELP_CLOUDLET_POOL_LIST} from "../../../tutorial";
import { showConfirmation, showInvitation } from '../../../services/modules/poolAccess';
import { perpetual, role } from '../../../helper/constant';
import { operatorRoles } from '../../../constant';
class CloudletPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onAdd = () => {
        this.updateState({ currentView: <CloudletPoolReg onClose={() => this.resetView()} /> });
    }

    /**Action menu block */
    onActionClick = (action, data) => {
        this.updateState({ currentView: <CloudletPoolReg data={data} isUpdate={action ? true : false} action={action.id} onClose={() => this.resetView()} /> });
    }

    onOrgActionClick = (action, data) => {
        this.updateState({ currentView: <CloudletPoolReg data={data} org={true} isUpdate={action ? true : false} action={action.id} onClose={() => this.resetView()} /> });
    }

    showDeleteCloudletPool = (action, data) => {
        let valid = true
        if(data[localFields.organizationCount] !== 0)
        {
            this.props.handleAlertInfo('error', 'Please unlink all organizations before deleting cloudlet pool');
            valid = false
        }
        return valid;
    }

    onConfirmVisible = (data) => {
        return redux_org.isAdmin(this)
    }

    actionMenu = () => {
        return [
            { id: perpetual.ADD_ORGANIZATION, label: 'Invite Organization', onClick: this.onOrgActionClick, type:'Edit' },
            { id: perpetual.DELETE_ORGANIZATION, label: 'Withdraw Invitation', onClick: this.onOrgActionClick, type:'Edit' },
            { id: perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM, label: 'Accept Invitation', visible: this.onConfirmVisible, onClick: this.onOrgActionClick, type:'Edit'  },
            { id: perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT, label: 'Reject Invitation', visible: this.onConfirmVisible, onClick: this.onOrgActionClick, type:'Edit'  },
            { id: perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE, label: 'Withdraw Confirmation', visible: this.onConfirmVisible, onClick: this.onOrgActionClick, type:'Edit'  },
            { id: perpetual.ADD_CLOUDLET, label: 'Update Cloudlets', onClick: this.onActionClick, type:'Edit' },
            { id: perpetual.DELETE, label: 'Delete', onClickInterept:this.showDeleteCloudletPool, onClick: deleteCloudletPool, type:'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudletPool, icon: 'delete', warning: 'delete all the selected cloudlet pool', type: 'Edit' },
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_CLOUDLET_POOLS,
            headerLabel: 'Cloudlet Pools',
            nameField: localFields.poolName,
            requestType: [showCloudletPools, showConfirmation, showInvitation],
            isRegion: true,
            sortBy: [localFields.poolName],
            selection:true,
            keys: this.keys,
            onAdd: role.validateRole(operatorRoles, this.props.organizationInfo) ? this.onAdd : undefined,
            viewMode : HELP_CLOUDLET_POOL_LIST
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_CLOUDLET_POOLS} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} actionRoles={operatorRoles} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletPoolList));