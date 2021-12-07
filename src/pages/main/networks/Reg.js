import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM } from '../../../hoc/forms/MexForms';
import { redux_org } from '../../../helper/reduxData'
//model
import { service, fields } from '../../../services';
import { createNetwork, updateNetwork } from '../../../services/modules/network';
import { HELP_NETWORK_REG } from "../../../tutorial";

import { Grid } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { getOrganizationList } from '../../../services/modules/organization';
import { showCloudlets } from '../../../services/modules/cloudlet';
class NetworkReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            region: undefined,
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        //To avoid refeching data from server
        this.operatorList = [];
        this.cloudletList = []

    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.updateState({ region })
        if (region) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                }
            }
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (!isInit) {
                    this.getCloudletInfo(form, forms)
                    this.updateState({ forms })
                }
            }
        }
    }

    getCloudletInfo = async (form, forms) => {
        let region = undefined;
        let operatorName = undefined;
        for (let i = 0; i < forms.length; i++) {
            let tempForm = forms[i]
            if (tempForm.field === fields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === fields.operatorName) {
                operatorName = tempForm.value
            }
        }
        if (region && operatorName) {
            let requestData = { cloudlet: { key: { organization: operatorName } }, region }
            this.props.handleLoadingSpinner(true)
            let mcList = await service.showAuthSyncRequest(this, showCloudlets(this, requestData, true))
            this.cloudletList = mcList.map(org => (org[fields.cloudletName]))
            this.props.handleLoadingSpinner(false)
            this.updateUI(form)
            this.updateState({ forms })
        }

    }
    checkForms = (form, forms, isInit = false) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        if (form.field === fields.operatorName) {
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
            if (this.props.isUpdate) {
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateNetwork(this, updateData)
                }
            }
            else {
                let mcRequest = await createNetwork(this, data)
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    this.props.handleLoadingSpinner(true)
                    this.props.handleAlertInfo('success', `Network ${data[fields.networkName]} created successfully`)
                    this.props.onClose(true)
                }
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

    onAddCancel = () => {
        this.props.onClose(false)
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
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.regions;
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
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to Network.', update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the cloudlet site', update: { key: true } },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: SELECT, placeholder: 'Select Cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.', update: { key: true } },
            { field: fields.networkName, label: 'Network Name', formType: INPUT, placeholder: 'Enter Network Name', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.connectionType, label: 'Connection Type', formType: SELECT, placeholder: 'Enter Connection Type', rules: { required: true }, visible: true, update: { key: true } }
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.field === fields.envVars && data[fields.envVars] === undefined) {
                    form.visible = false;
                }
                else if (form.forms && form.formType !== HEADER && form.formType !== MULTI_FORM) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true, data)
                }
            }
        }

    }
    onAddCancel = () => {
        this.props.onClose(false)
    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        let orgList = await getOrganizationList(this, { type: perpetual.OPERATOR })
        this.operatorList = orgList.map(org => {
            return org[fields.organizationName]
        })
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        this.updateFormData(forms, data)
        this.updateState({
            forms
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_NETWORK_REG)
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
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(NetworkReg));