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
//redux
import { connect } from 'react-redux';
import { redux_org } from '../../../helper/reduxData'

import { localFields } from '../../../services/fields';
import NetworkReg from './Reg';
import { operatorRoles } from '../../../constant'
import { HELP_NETWORK_LIST } from "../../../tutorial";
import { perpetual, role } from '../../../helper/constant';
import { deleteNetwork, showNetwork, keys } from '../../../services/modules/network'

class NetworkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false;
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

    onAdd = (action, data) => {
        this.updateState({ currentView: <NetworkReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteNetwork, type: 'Edit' },
        ]
    }


    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteNetwork, icon: 'delete', warning: 'delete all the selected networks', type: 'Edit' },
        ]
    }

    canAdd = () => {
        if (role.validateRole(operatorRoles, this.props.organizationInfo)) {
            return this.onAdd
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_NETWORKS,
            headerLabel: 'Networks',
            nameField: localFields.networkName,
            requestType: [showNetwork],
            selection: !redux_org.isDeveloper(this),
            isRegion: true,
            sortBy: [localFields.region, localFields.networkName],
            keys: this.keys,
            onAdd: this.canAdd(),
            viewMode: HELP_NETWORK_LIST
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <React.Fragment>
                <DataView currentView={currentView} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={operatorRoles} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, null)(NetworkList));