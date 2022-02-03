import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../container/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//model
import { HELP_FEDERATION_GUEST_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { deleteFederation, showFederation, deRegisterFederation, registerFederation } from "../../../../services/modules/federation"
import { showFederator, deleteFederator } from "../../../../services/modules/federator"
import { multiDataRequest, iconKeys, keys, showPartnerFederatorZone } from "../../../../services/modules/guest"
import { service, fields } from '../../../../services'
import { uiFormatter } from '../../../../helper/formatter';

import RegisterOperator from "../reg/Federator";
import RegisterPartner from "../reg/Fedaration";
import Reg from "./reg/Reg"
import APIKey from "./reg/APIKey";

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

    registerVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] === false ? true : false
    }

    deregisterVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] ? true : false
    }

    createVisible = (data) => {
        return data[fields.federationName] === undefined
    }

    federationNameVisible = (data) => {
        return data[fields.federationName] !== undefined
    }

    handleClose = () => {
        this.updateState({
            open: false
        })
    }

    onRegisterFederation = async (action, data) => {
        let text = action === perpetual.ACTION_REGISTER_FEDERATION ? 'Registered' : 'Deregistered'
        let requestCall = action.id === perpetual.ACTION_REGISTER_FEDERATION ? registerFederation : deRegisterFederation
        let mc = await requestCall(this, data)
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `Federation ${text} successfully !`)
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Add Partner Data' },
            { id: perpetual.ACTION_UPDATE_PARTNER, label: 'Enter Partner Details', visible: this.createVisible, onClick: this.onAddPartnerData, type: 'Add Partner Data' },
            { id: perpetual.ACTION_SET_API_KEY, label: 'Update API Key', onClick: this.onAPIKeyForm, visible: this.federationNameVisible, type: 'Generate API Key' },
            { id: perpetual.ACTION_REGISTER_FEDERATION, label: 'Register', onClick: this.onRegisterFederation, visible: this.registerVisible, warning: 'register federation' },
            { id: perpetual.ACTION_DEREGISTER_FEDERATION, label: 'Deregister', onClick: this.onRegisterFederation, visible: this.deregisterVisible, warning: 'deregister federation' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.createVisible, onClick: deleteFederator, type: 'Delete', warning: true },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.federationNameVisible, onClick: deleteFederation, type: 'Delete' },
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
        if (key.field === fields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_INBOUND_FEDERATION,
            headerLabel: 'Federation - Guest',
            requestType: [showFederation, showFederator, showPartnerFederatorZone],
            sortBy: [fields.region, fields.federationName],
            isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.federationName,
            viewMode: HELP_FEDERATION_GUEST_LIST,
            grouping: true,
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