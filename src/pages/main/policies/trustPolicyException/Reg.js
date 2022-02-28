import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON } from '../../../../hoc/forms/MexForms';
import { redux_org } from '../../../../helper/reduxData'
//model
import { service, fields } from '../../../../services';
import { getOrganizationList } from '../../../../services/modules/organization';

import { Grid } from '@material-ui/core';
import { perpetual, role } from '../../../../helper/constant';
import { uniqueId, validateRemoteCIDR } from '../../../../helper/constant/shared';
import { _sort } from '../../../../helper/constant/operators';
import { showCloudletPools } from '../../../../services/modules/cloudletPool'
import { getAppList } from '../../../../services/modules/app';
import { developerRoles, operatorRoles } from '../../../../constant'
import { updateTrustPolicyException, createTrustPolicyException } from '../../../../services/modules/trustPolicyException';
import { serverFields } from '../../../../helper/formatter';
import { HELP_TRUST_POLICY_EXCEPTION } from '../../../../tutorial';

class TrustPolicyExceptionReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refetching data from server
        this.requestedRegionList = []
        this.organizationList = []
        this.appList = []
        this.cloudletPoolList = []
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getAppInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.appList = [...this.appList, ...await getAppList(this, { region: region })]
        }
        this.updateUI(form)
        this.appNameValueChange(form, forms, true)
        this.updateState({ forms })
    }

    appNameValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.version) {
                this.updateUI(form)
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    getCloudletPoolInfo = async (form, forms) => {
        let region = undefined;
        let organizationName = undefined;
        for (let i = 0; i < forms.length; i++) {
            let tempForm = forms[i]
            if (tempForm.field === fields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === fields.organizationName) {
                organizationName = tempForm.value
            }
        }
        if (region && organizationName) {
            let requestData = { region: region, org: organizationName }
            let cloudletInfo = await service.showAuthSyncRequest(this, showCloudletPools(this, requestData))
            this.cloudletPoolList = cloudletInfo
            this.updateUI(form)
            this.updateState({ forms })
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.poolName) {
                this.updateUI(form)
                if (!isInit) {
                    this.updateState({ forms })
                }
            }
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        if (region) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                    if (!isInit) {
                        this.getCloudletPoolInfo(form, forms)
                    }
                }
                else if (form.field === fields.appName) {
                    if (!isInit) {
                        this.getAppInfo(region, form, forms)
                    }
                }
            }
            this.requestedRegionList.push(region)
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === fields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === fields.appName) {
            this.appNameValueChange(form, forms, isInit)
        }
        else if (form.field === fields.ocProtocol) {
            this.ocProtcolValueChange(form, forms, isInit)
        }
    }

    ocProtcolValueChange = (currentForm, forms, isInit) => {
        let parentForm = currentForm.parent.form
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.uuid === parentForm.uuid) {
                for (let outboundConnectionForm of form.forms) {
                    if (outboundConnectionForm.field === fields.ocPortMin || outboundConnectionForm.field === fields.ocPortMax) {
                        outboundConnectionForm.visible = !(currentForm.value === 'icmp')
                        outboundConnectionForm.value = undefined
                    }
                }
                break;
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (!isInit) {
                    this.getCloudletPoolInfo(form, forms)
                }
            }
            else if (form.field === fields.appName) {
                this.updateUI(form)
                this.appNameValueChange(form, forms, true)
            }
        }
        if (!isInit) {
            this.updateState({ forms })
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
            let outboundList = []
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.requiredOutboundConnectionmulti) {
                            outboundList.push({ 'port_range_min': multiFormData[fields.ocPortMin] && parseInt(multiFormData[fields.ocPortMin]), 'port_range_max': multiFormData[fields.ocPortMax] && parseInt(multiFormData[fields.ocPortMax]), 'protocol': multiFormData[fields.ocProtocol], 'remote_cidr': multiFormData[fields.ocRemoteCIDR] })
                        }
                    }
                    data[uuid] = undefined
                }
            }
            role.validateRole(developerRoles, this.props.organizationInfo) && outboundList.length > 0 ? data[fields.requiredOutboundConnections] = outboundList : null
            if (this.props.isUpdate) {
                mc = await updateTrustPolicyException(this, data)
            }
            else {
                mc = await createTrustPolicyException(this, data)
            }
            if (service.responseValid(mc)) {
                const text = this.props.isUpdate ? 'updated' : 'created'
                this.props.handleAlertInfo('success', `Trust Policy Exception ${data[fields.trustPolicyExceptionName]} ${text} successfully`)
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
        console.log(forms, "forms")
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
                            form.options = this.cloudletPoolList
                            break;
                        case fields.poolName:
                            form.options = this.cloudletPoolList
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.props.regions;
                            break;
                        case fields.appName:
                            form.options = this.appList
                            break;
                        case fields.version:
                            form.options = this.appList
                            break;
                        case fields.state:
                            form.options = [serverFields.APPROVAL_REQUESTED, serverFields.ACTIVE, serverFields.REJECTED];
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
            { label: `${this.isUpdate ? 'Update' : 'Create'} Trust Policy Exception`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want Trust Exception Policy.', update: { key: true } },
            { field: fields.organizationName, label: 'Organization', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: 'The name of the organization you are currently managing.', update: { key: true } },
            { field: fields.trustPolicyExceptionName, label: 'Trust Policy Exception', formType: INPUT, placeholder: 'Enter Name', rules: { required: true }, visible: true, update: { key: true }, tip: 'Name of the Trust Policy Exception.' },
            { field: fields.appName, label: 'App', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select App', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }], update: { key: true }, tip: 'The name of the application to deploy.' },
            { field: fields.version, label: 'App Version', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select App Version', rules: { required: true }, visible: true, dependentData: [{ index: 3, field: fields.appName }], update: { key: true }, tip: 'The version of the application to deploy.' },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'Organization of the cloudlet pool site', update: { key: true } },
            { field: fields.poolName, label: 'Cloudlet Pool', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Cloudlet Pool', rules: { required: true }, visible: true, dependentData: [{ index: 6, field: fields.operatorName }], update: { key: true }, tip: 'CloudletPool Name' },
            { field: fields.state, label: 'State Type', formType: SELECT, placeholder: 'Enter State Type', rules: { required: true, disabled: role.validateRole(operatorRoles, this.props.organizationInfo) && this.isUpdate ? false : true }, visible: this.isUpdate, tip: 'State of the exception within the approval process.', update: { edit: true } },
            { field: fields.requiredOutboundConnections, label: 'Required Outbound Connections', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Connections', icon: role.validateRole(developerRoles, this.props.organizationInfo) ? 'add' : '', visible: true, onClick: this.addMultiForm, multiForm: this.getOutboundConnectionsForm }], visible: true, tip: 'Connections this app require to determine if the app is compatible with a trust policy Exception' },
        ]
    }

    addMultiForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.multiForm());
        this.updateState({ forms })
    }

    removeMultiForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.updateState({
                forms: updateForms
            })
        }
    }

    outboundConnectionsForm = () => ([
        { field: fields.ocProtocol, label: 'Protocol', formType: SELECT, placeholder: 'Select', rules: { required: true, allCaps: true, required: true, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 4, visible: true, options: ['tcp', 'udp', 'icmp'], update: { edit: true } },
        { field: fields.ocPortMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number', min: 1, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: this.validateOCPortRange },
        { icon: '~', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1 },
        { field: fields.ocPortMax, label: 'Port Range Max', formType: INPUT, rules: { required: true, type: 'number', min: 1, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: this.validateOCPortRange },
        { field: fields.ocRemoteCIDR, label: 'Remote CIDR', formType: INPUT, rules: { required: true, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 4, visible: true, update: { edit: true }, dataValidateFunc: validateRemoteCIDR },
        { icon: 'delete', formType: 'IconButton', visible: role.validateRole(developerRoles, this.props.organizationInfo) ? true : false, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getOutboundConnectionsForm = (form) => {
        return ({ uuid: uniqueId(), field: fields.requiredOutboundConnectionmulti, formType: MULTI_FORM, forms: form ? form : this.outboundConnectionsForm(), width: 3, visible: true })
    }

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
        if (data[fields.requiredOutboundConnections]) {
            let requiredOutboundConnections = data[fields.requiredOutboundConnections]
            for (let i = 0; i < requiredOutboundConnections.length; i++) {
                let requiredOutboundConnection = requiredOutboundConnections[i]
                let outboundConnectionsForms = this.outboundConnectionsForm()
                for (let j = 0; j < outboundConnectionsForms.length; j++) {
                    let outboundConnectionsForm = outboundConnectionsForms[j];
                    if (outboundConnectionsForm.field === fields.ocProtocol) {
                        outboundConnectionsForm.value = requiredOutboundConnection['protocol']
                    }
                    else if (outboundConnectionsForm.field === fields.ocRemoteCIDR) {
                        outboundConnectionsForm.value = requiredOutboundConnection['remote_cidr']
                    }
                    else if (outboundConnectionsForm.field === fields.ocPortMin) {
                        outboundConnectionsForm.visible = requiredOutboundConnection['protocol'] !== 'icmp'
                        outboundConnectionsForm.value = requiredOutboundConnection['port_range_min']
                    }
                    else if (outboundConnectionsForm.field === fields.ocPortMax) {
                        outboundConnectionsForm.visible = requiredOutboundConnection['protocol'] !== 'icmp'
                        outboundConnectionsForm.value = requiredOutboundConnection['port_range_max']
                    }
                }
                forms.splice(19 + multiFormCount, 0, this.getOutboundConnectionsForm(outboundConnectionsForms))
                multiFormCount += 1
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
        if (!this.isUpdate) {
            let organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
            this.organizationList = _sort(organizationList.map(org => org[fields.organizationName]))
        }
        this.updateFormData(forms, data)
        this.updateState({
            forms
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_TRUST_POLICY_EXCEPTION)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(TrustPolicyExceptionReg));