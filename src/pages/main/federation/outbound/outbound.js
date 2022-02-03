import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../container/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core';
//model
import { HELP_OUTBOUND_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { showFederation, multiDataRequest, keys, deleteFederation, iconKeys } from "../../../../services/modules/federation"
import { showFederator, deleteFederator, generateApiKey } from "../../../../services/modules/federator"
import FederationReg from "./Reg"
import { codeHighLighter } from '../../../../hoc/highLighter/highLighter';
import { deRegisterFederation, registerFederation } from '../../../../services/modules/federation'
import { service, fields } from '../../../../services'
import SharingZones from './SharingZones'
import { showSelfFederatorZone } from "../../../../services/modules/zones";
import { uiFormatter } from '../../../../helper/formatter';
class FederationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
            open: false,
        },
        this.keys = keys()
        this.apiKey = undefined
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }
    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }


    checkForms = (form, forms, isInit) => {

    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }


    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_OUTBOUND_FEDERATION,
            headerLabel: 'Federation - Host',
            requestType: [showFederation, showFederator, showSelfFederatorZone],
            sortBy: [fields.region, fields.federationName],
            isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.federationName,
            viewMode: HELP_OUTBOUND_LIST,
            grouping: true,
            iconKeys: iconKeys(),
            formatData: this.dataFormatter
        })
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
        if (key.field === fields.partnerRoleAccessToSelfZones) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    onAdd = (type) => {
        this.updateState({ currentView: <FederationReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
    }

    onAddPartnerData = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} action={action.id} onClose={this.onRegClose} /> });
    }

    onCreateFederation = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} onClose={this.onRegClose} /> })
    }

    onShareZones = (action, data) => {
        data[fields.zoneId] || action.id === perpetual.ACTION_SHARE_ZONES ? this.updateState({ currentView: <FederationReg action={action.id} data={data} onClose={this.onRegClose} /> }) : this.props.handleAlertInfo('error', 'No Zones to Share !')
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
        this.apiKey = undefined // to reset when there is no page reload
    }

    onGenerateApiKey = async (action, data) => {
        let mcRequest = await generateApiKey(this, data)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', 'Api Key generated successfully !')
            this.apiKey = mcRequest.response.data.apikey
            this.updateState({
                open: true
            })
        }
    }

    onRegisterFederation = async (action, data) => {
        let text = action === perpetual.ACTION_REGISTER_FEDERATION ? 'Registered' : 'Deregistered'
        let requestCall = action.id === perpetual.ACTION_REGISTER_FEDERATION ? registerFederation : deRegisterFederation
        let mc = await requestCall(this, data)
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `Federation ${text} successfully !`)
        }
    }

    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove Host Federation ?`
    }

    registerVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] === false ? true : false
    }

    deregisterVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] ? true : false
    }

    showShareZones = (action, data) => {
        data[fields.zoneId] ? this.updateState({ currentView: <SharingZones data={data} onClose={this.onRegClose} /> }) : this.props.handleAlertInfo('error', 'No Zones available for this federation !')
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_VIEW_SHARE_ZONES, label: 'View Zones Shared', onClick: this.showShareZones, type: 'edit' },
            { id: perpetual.ACTION_SHARE_ZONES, label: 'Share Zones', onClick: this.onShareZones, visible: this.federationNameVisible, type: 'edit' },
            { id: perpetual.ACTION_UNSHARE_ZONES, label: 'Unshare Zones', onClick: this.onShareZones, visible: this.federationNameVisible, type: 'edit' },
            { id: perpetual.ACTION_UPDATE_PARTNER, label: 'Enter Partner Details', visible: this.createVisible, onClick: this.onAddPartnerData, type: 'Add Partner Data' },
            { id: perpetual.ACTION_GENERATE_API_KEY, label: 'Generate API Key', onClick: this.onGenerateApiKey, type: 'Generate API Key' },
            { id: perpetual.ACTION_REGISTER_FEDERATION, label: 'Register', onClick: this.onRegisterFederation, visible: this.registerVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_DEREGISTER_FEDERATION, label: 'Deregister', onClick: this.onRegisterFederation, visible: this.deregisterVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Add Partner Details' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.createVisible, onClick: deleteFederator, type: 'Delete', dialogMessage: this.getDeleteActionMessage },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.federationNameVisible, onClick: deleteFederation, type: 'Delete' },
        ]
    }

    onValueChange = (form) => {

    }

    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>API Key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <div style={{ display: 'inline' }}>{codeHighLighter(this.apiKey)}</div>
                    </DialogContent>
                    <DialogActions>
                        {this.apiKey ? <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button> : null}
                    </DialogActions>
                </Dialog>
            </div>

        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_OUTBOUND_LIST)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FederationList));