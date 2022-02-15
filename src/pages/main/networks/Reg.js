import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON } from '../../../hoc/forms/MexForms';
import { redux_org } from '../../../helper/reduxData'
//model
import { service, fields, updateFieldData } from '../../../services';
import { createNetwork, updateNetwork } from '../../../services/modules/network';
import { HELP_NETWORK_LIST } from "../../../tutorial";

import { Grid } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { fetchPartnerOperator, showCloudlets } from '../../../services/modules/cloudlet';
import { uniqueId, validateRemoteCIDR, validateRemoteIP } from '../../../helper/constant/shared';

class NetworkReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refetching data from server
        this.requestedRegionList = []
        this.cloudletList = []
        this.routesList = [];

    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getCloudletInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.cloudletList = [...this.cloudletList, ...await service.showAuthSyncRequest(this, showCloudlets(this, { region }))]
        }
        this.updateUI(form)
        if (redux_org.isOperator(this)) {
            for (let form of forms) {
                if (form.field === fields.cloudletName) {
                    this.updateUI(form)
                    break;
                }
            }
        }
        this.updateState({ forms })
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let form of forms) {
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (!isInit) {
                    this.updateState({ forms })
                }
                break;
            }
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        if (region) {
            for (let form of forms) {
                if (form.field === fields.operatorName) {
                    if (!isInit) {
                        this.getCloudletInfo(region, form, forms)
                    }
                    break;
                }
            }
            this.requestedRegionList.includes(region) ? this.requestedRegionList : this.requestedRegionList.push(region)
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreate = async (data) => {
        if (data) {
            let mc;
            let forms = this.state.forms;
            let routesList = []
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.routes) {
                            routesList.push(multiFormData)
                        }
                    }
                    data[uuid] = undefined
                }
            }
            routesList.length > 0 ? data[fields.accessRoutes] = routesList : null
            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, this.state.forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    mc = await updateNetwork(this, updateData)
                }
            }
            else {
                data[fields.partnerOperator] = fetchPartnerOperator(this.cloudletList, data, fields.partnerOperator)
                mc = await createNetwork(this, data)
            }
            if (service.responseValid(mc)) {
                let networkName = mc.request.data.Network.key.name;
                const text = this.props.isUpdate ? 'updated' : 'created'
                this.props.handleAlertInfo('success', `Network ${networkName} ${text} successfully`)
                this.props.onClose(true)
            }
        }
    }


    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }


    render() {
        const { forms } = this.state
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <div className="round_panel">
                            <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
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

    updateUI(form) {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case fields.region:
                            form.options = this.props.regions;
                            break;
                        case fields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case fields.connectionType:
                            form.options = [perpetual.CONNECT_TO_ALL, perpetual.CONNECT_TO_CLUSTER_NODES, perpetual.CONNECT_TO_LOAD_BALANCER];
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Network`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want Network.', update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), dependentData: [{ index: 1, field: fields.region }], tip: 'Organization of the cloudlet site', update: { key: true } },
            { field: fields.partnerOperator, label: 'Partner Operator', formType: INPUT, visible: false, update: { key: true }},
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.', update: { key: true }, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.operatorName }] },
            { field: fields.networkName, label: 'Network Name', formType: INPUT, placeholder: 'Enter Network Name', rules: { required: true }, visible: true, update: { key: true }, tip: 'Name of the network.' },
            { field: fields.connectionType, label: 'Connection Type', formType: SELECT, placeholder: 'Enter Connection Type', rules: { required: true }, update: { id: ['4'] }, visible: true, tip: 'Network connection type.' },
            { field: fields.accessRoutes, label: 'Routes', formType: HEADER, update: { id: ['3', '3.1', '3.2'] }, forms: [{ formType: ICON_BUTTON, label: 'Add Connections', icon: 'add', visible: true, onClick: this.addForm, Form: this.getRoutesForm }], visible: true, tip: 'CIDR:</b> Destination CIDR\n IP:</b> Next hop IP\n' }
        ]
    }

    addForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.Form());
        this.updateState({ forms })
    }

    getRoutesForm = (form) => {
        return ({ uuid: uniqueId(), field: fields.routes, formType: MULTI_FORM, forms: form ? form : this.routeFormArray(), width: 3, visible: true })
    }

    routeFormArray = () => ([
        { field: fields.destinationCidr, label: 'Destination CIDR', placeholder: 'Enter Destination CIDR', formType: INPUT, rules: { required: true }, width: 4, visible: true, update: { edit: true }, dataValidateFunc: validateRemoteCIDR },
        { field: fields.nextHopIp, label: 'Destination Hop IP', placeholder: 'Enter Destination Hop IP', formType: INPUT, rules: { required: true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: validateRemoteIP },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeForm }
    ])

    removeForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.updateState({
                forms: updateForms
            })
        }
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
               if (form.forms && form.formType !== HEADER && form.formType !== MULTI_FORM) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true)
                }
            }
        }
    }
    
    loadDefaultData = (forms, data) => {
            let multiFormCount = 0
            if (data[fields.accessRoutes]) {
                let routeArray = data[fields.accessRoutes]
                for (let i = 0; i < routeArray.length; i++) {
                    let routeArr = routeArray[i]
                    let routeForms = this.routeFormArray()
                    for (let j = 0; j < routeForms.length; j++) {
                        let routeForm = routeForms[j];
                        if (routeForm.field === fields.destinationCidr) {
                            routeForm.value = routeArr[fields.destinationCidr]
                        }
                        else if (routeForm.field === fields.nextHopIp) {
                            routeForm.value = routeArr[fields.nextHopIp]
                        }
                    }
                    forms.splice(7 + multiFormCount, 0, this.getRoutesForm(routeForms))
                    multiFormCount = +1
                }
            }
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })
        if (data) {
            await this.loadDefaultData(forms, data)
        }
        this.updateFormData(forms, data)
        this.updateState({
            forms
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_NETWORK_LIST)
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(NetworkReg));