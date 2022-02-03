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
import MexForms, { INPUT } from '../../../../hoc/forms/MexForms';
import { uiFormatter } from '../../../../helper/formatter';
import RegisterOperator from "./reg/RegisterOperator";
import RegisterPartner from "./reg/RegisterPartner";
import Reg from "./reg/Reg"
import APIKey from "./reg/APIKey";

class Guest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
            APIKeyForm: undefined,
            loading: false
        },
            this.keys = keys()
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

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
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
        const { tableHeight, currentView, APIKeyForm } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_INBOUND_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                {APIKeyForm ? <APIKey data={APIKeyForm} onClose={() => { this.updateState({ APIKeyForm: undefined }) }} /> : null}
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
        this.props.handleViewMode(HELP_FEDERATION_GUEST_LIST)
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