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

import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../hoc/datagrid/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//model
import { HELP_FEDERATION_GUEST_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { showFederator, showFederation, deleteFederator, multiDataRequest, keys, iconKeys, deRegisterFederation, registerFederation } from "../../../../services/modules/federation"
import { uiFormatter } from '../../../../helper/formatter';

import RegisterOperator from "../reg/Federator";
import RegisterPartner from "../reg/Fedaration";
import Reg from "./reg/Reg"
import APIKey from "./reg/APIKey";
import { showPartnerFederatorZone } from "../../../../services/modules/partnerZones/partnerZones";
import { responseValid } from "../../../../services/config";
import { localFields } from "../../../../services/fields";

class Guest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            APIKeyForm: undefined
        }
        this.keys = keys()
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAPIKeyForm = async (action, data) => {
        this.updateState({ APIKeyForm: data });
    }

    onAdd = (type) => {
        this.updateState({ currentView: <Reg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <div className="round_panel"><RegisterOperator data={data} isUpdate={true} onClose={this.onRegClose} /></div> });
    }

    onAddPartnerData = (action, data) => {
        this.updateState({ currentView: <div className="round_panel"><RegisterPartner data={data} onClose={this.onRegClose} /></div> });
    }

    onCreateFederation = (action, data) => {
        this.updateState({ currentView: <Reg data={data} onClose={this.onRegClose} /> })
    }

    registerVisible = (type, action, data) => {
        return !data[localFields.partnerRoleShareZoneWithSelf]
    }

    deregisterVisible = (type, action, data) => {
        return data[localFields.partnerRoleShareZoneWithSelf]
    }

    createVisible = (type, action, data) => {
        return data[localFields.partnerFederationName] === undefined
    }

    federationNameVisible = (type, action, data) => {
        return data[localFields.partnerFederationName] !== undefined
    }

    handleClose = () => {
        this.updateState({
            open: false
        })
    }

    onRegisterFederation = async (action, data, callback) => {
        let isRegister = action.id === perpetual.ACTION_REGISTER_FEDERATION
        let requestCall = isRegister ? registerFederation : deRegisterFederation
        let mc = await requestCall(this, data)
        if (responseValid(mc)) {
            this.props.handleAlertInfo('success', `Federation ${data[localFields.partnerFederationName]} ${isRegister ? 'R' : 'Der'}egistered successfully !`)
            callback()
        }
    }

    onDeleteHost = async (action, data, callback) => {
        let mc = await deleteFederator(this, data)
        if (responseValid(mc)) {
            this.props.handleAlertInfo('success', 'Federation host deleted successfully')
            callback()
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Add Partner Data' },
            { id: perpetual.ACTION_UPDATE_PARTNER, label: 'Enter Partner Details', visibility: this.createVisible, onClick: this.onAddPartnerData, type: 'Add Partner Data' },
            { id: perpetual.ACTION_SET_API_KEY, label: 'Update API Key', onClick: this.onAPIKeyForm, visibility: this.federationNameVisible, type: 'Generate API Key' },
            { id: perpetual.ACTION_REGISTER_FEDERATION, label: 'Register', onClick: this.onRegisterFederation, visibility: this.registerVisible, warning: 'register federation' },
            { id: perpetual.ACTION_DEREGISTER_FEDERATION, label: 'Deregister', onClick: this.onRegisterFederation, visibility: this.deregisterVisible, warning: 'deregister federation' },
            { id: perpetual.ACTION_HOST_DELETE, label: 'Delete', disable: this.deregisterVisible, onClick: this.onDeleteHost, warning: 'delete' }
        ]
    }

    render() {
        const { tableHeight, currentView, APIKeyForm } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_INBOUND_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                {APIKeyForm ? <APIKey data={APIKeyForm} onClose={() => { this.updateState({ APIKeyForm: undefined }) }} /> : null}
            </div>
        )
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_INBOUND_FEDERATION,
            headerLabel: 'Guest - Federation',
            requestType: [showFederation, showFederator, showPartnerFederatorZone],
            sortBy: [localFields.operatorName],
            // isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: localFields.partnerFederationName,
            viewMode: HELP_FEDERATION_GUEST_LIST,
            iconKeys: iconKeys(),
            formatData: this.dataFormatter
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_FEDERATION_GUEST_LIST)
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Guest));