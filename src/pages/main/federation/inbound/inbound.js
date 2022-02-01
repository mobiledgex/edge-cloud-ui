import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../container/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, LinearProgress } from '@material-ui/core';
//model
import { HELP_INBOUND_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { deleteFederation, showFederation, deRegisterFederation, registerFederation, setApiKey } from "../../../../services/modules/federation"
import { showFederator, deleteFederator } from "../../../../services/modules/federator"
import { multiDataRequest, iconKeys, keys, showPartnerFederatorZone } from "../../../../services/modules/inbound"
import InboundReg from "./reg/Reg"
import { codeHighLighter } from '../../../../hoc/highLighter/highLighter';
import { service, fields } from '../../../../services'
import PartnerZones from './PartnerZone'
import MexForms, { INPUT, BUTTON } from '../../../../hoc/forms/MexForms';
import { uiFormatter } from '../../../../helper/formatter';
class InboundList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
            open: false,
            loading: false
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

    resetFormValue = (form) => {
        let rules = form.rules
        if (rules) {
            let disabled = rules.disabled ? rules.disabled : false
            if (!disabled) {
                form.value = undefined;
            }
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_INBOUND_FEDERATION,
            headerLabel: 'Inbound Federation',
            requestType: [showFederation, showFederator, showPartnerFederatorZone],
            sortBy: [fields.region, fields.federationName],
            isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.federationName,
            viewMode: HELP_INBOUND_LIST,
            grouping: true,
            iconKeys: iconKeys(),
            formatData: this.dataFormatter
        })
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    onAdd = (type) => {
        this.updateState({ currentView: <InboundReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <InboundReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
    }

    onAddPartnerData = (action, data) => {
        this.updateState({ currentView: <InboundReg data={data} action={action.id} onClose={this.onRegClose} /> });
    }

    onCreateFederation = (action, data) => {
        this.updateState({ currentView: <InboundReg data={data} onClose={this.onRegClose} /> })
    }

    onViewPartner = (action, data) => {
        data[fields.zoneCount] > 0 ? this.updateState({ currentView: <PartnerZones data={data} onClose={this.onRegClose} /> }) : this.props.handleAlertInfo('error', 'No Zones available for this federation !')
    }

    onRegisterZones = (action, data) => {
        this.updateState({ currentView: <InboundReg data={data} action={action.id} onClose={this.onRegClose} /> })
    }

    registerVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] === false ? true : false
    }

    deregisterVisible = (data) => {
        return data[fields.federationName] !== undefined && data[fields.partnerRoleShareZoneWithSelf] ? true : false
    }

    onShareZones = (action, data) => {
        data[fields.zoneId] || action.id === perpetual.ACTION_SHARE_ZONES ? this.updateState({ currentView: <InboundReg action={action.id} data={data} onClose={this.onRegClose} /> }) : this.props.handleAlertInfo('error', 'No Zones to Share !')
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

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (data) {
                if (form.forms && form.formType !== HEADER) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true)
                }
            }
        }
    }

    onSetApiKey = async (action, data) => {
        let forms = this.forms()
        this.loadDefaultData(forms, data)
        forms.push({ label: 'Set', formType: BUTTON, onClick: this.onCreateApiKey, validate: true, visible: true })
        forms.push({ label: 'Cancel', formType: BUTTON, onClick: this.handleClose, visible: true })
        this.updateState({ open: true, forms: forms })
    }

    onRegisterFederation = async (action, data) => {
        let text = action === perpetual.ACTION_REGISTER_FEDERATION ? 'Registered' : 'Deregistered'
        let requestCall = action.id === perpetual.ACTION_REGISTER_FEDERATION ? registerFederation : deRegisterFederation
        let mc = await requestCall(this, data)
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `Federation ${text} successfully !`)
        }
    }

    onCreateApiKey = async (data) => {
        this.updateState({ loading: true })
        let mc = await setApiKey(this, { selfoperatorid: data[fields.operatorName], name: data[fields.federationName], apikey: data[fields.apiKey] })
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `api key changed for  ${data[fields.federationName]}`)
        }
        else {
            this.props.handleAlertInfo('error', 'set Api key failed !')
        }
        this.updateState({ loading: false, open: false })
    }

    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove federation ?`
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_REGISTER_ZONES, label: 'View Partner Zones', onClick: this.onViewPartner, type: 'Register Federation' },
            { id: perpetual.ACTION_UPDATE_PARTNER, label: 'Enter Partner Detail', visible: this.createVisible, onClick: this.onAddPartnerData, type: 'Add Partner Data' },
            { id: perpetual.ACTION_SET_API_KEY, label: 'Set API Key', onClick: this.onSetApiKey, visible: this.federationNameVisible, type: 'Generate API Key' },
            { id: perpetual.ACTION_REGISTER_FEDERATION, label: 'Register', onClick: this.onRegisterFederation, visible: this.registerVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_DEREGISTER_FEDERATION, label: 'Deregister', onClick: this.onRegisterFederation, visible: this.deregisterVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_REGISTER_ZONES, label: 'Register Zones', onClick: this.onRegisterZones, visible: this.federationNameVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_DEREGISTER_ZONES, label: 'Deregister Zones', onClick: this.onRegisterZones, visible: this.federationNameVisible, type: 'Register Federation' },
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Add Partner Data' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.createVisible, onClick: deleteFederator, type: 'Delete', dialogMessage: this.getDeleteActionMessage },
            { id: perpetual.ACTION_DELETE, label: 'Delete', visible: this.federationNameVisible, onClick: deleteFederation, type: 'Delete' },
        ]
    }

    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    renderSetApiForm = () => (
        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop: 5 }} />
    )

    forms = () => (
        [
            { field: fields.operatorName, label: 'Operator', formType: INPUT, rules: { required: true, disabled: true }, visible: true },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, rules: { required: true, disabled: true }, visible: true },
            { field: fields.apiKey, label: 'Api key', formType: INPUT, rules: { required: true }, visible: true },
        ]
    )

    render() {
        const { tableHeight, currentView, open, loading } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_INBOUND_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                {this.apiKey ? <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>Api key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <div style={{ display: 'inline' }}>{codeHighLighter(this.apiKey)}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button> 
                    </DialogActions>
                </Dialog> : <Dialog open={open} onClose={this.onDialogClose} aria-labelledby="update_password" disableEscapeKeyDown={true}>
                    <DialogTitle id="update_password">
                        {loading ? <LinearProgress /> : null}
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3>Set Api Key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                            {this.renderSetApiForm()}
                    </DialogContent>
                </Dialog>}
            </div>
        )
    }

    loadDefaultData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_INBOUND_LIST)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(InboundList));