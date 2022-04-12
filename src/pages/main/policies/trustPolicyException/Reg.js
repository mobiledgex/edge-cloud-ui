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
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON, fetchDataByField, findIndexs } from '../../../../hoc/forms/MexForms';
import { redux_org } from '../../../../helper/reduxData'
//model
import { service, updateFieldDataNew } from '../../../../services';
import { getOrganizationList } from '../../../../services/modules/organization';

import { Grid } from '@material-ui/core';
import { perpetual, role } from '../../../../helper/constant';
import { uniqueId, validateRemoteCIDR } from '../../../../helper/constant/shared';
import { _sort } from '../../../../helper/constant/operators';
import { getAppList } from '../../../../services/modules/app';
import { developerRoles } from '../../../../constant'
import { updateTrustPolicyException, createTrustPolicyException } from '../../../../services/modules/trustPolicyException';
import { HELP_TRUST_POLICY_EXCEPTION } from '../../../../tutorial';
import cloneDeep from 'lodash/cloneDeep';
import { showConfirmation } from '../../../../services/modules/poolAccess';
import { responseValid } from '../../../../services/config';
import { localFields } from '../../../../services/fields';

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
        this.stateList = [perpetual.APPROVE, perpetual.REJECT]
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getAppInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            let dataList = await getAppList(this, { region: region })
            dataList = dataList.filter(item => {
                return Boolean(item.trusted)
            })
            this.appList = [...this.appList, ...dataList]
        }
        this.updateUI(form)
        this.appNameValueChange(form, forms, true)
        this.updateState({ forms })
    }

    appNameValueChange = (currentForm, forms, isInit) => {
        for (const form of forms) {
            if (form.field === localFields.version) {
                this.updateUI(form)
                break;
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    getCloudletPoolInfo = async (form, forms, region) => {
        let requestData = undefined
        if (redux_org.isAdmin(this)) {
            requestData = fetchDataByField(forms, [localFields.region, localFields.organizationName])
            requestData[localFields.type] = perpetual.DEVELOPER
        }
        else {
            requestData = { region }
        }
        if (requestData) {
            this.cloudletPoolList = await service.showAuthSyncRequest(this, showConfirmation(this, requestData))
            this.updateUI(form)
            this.updateState({ forms })
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (const form of forms) {
            if (form.field === localFields.poolName) {
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
        if (!isInit && region) {
            for (const form of forms) {
                if (form.field === localFields.operatorName) {
                    this.getCloudletPoolInfo(form, forms, region)
                }
                else if (form.field === localFields.appName) {
                    this.getAppInfo(region, form, forms)
                }
            }
            this.requestedRegionList.push(region)
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === localFields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        if (form.field === localFields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.appName) {
            this.appNameValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.ocProtocol) {
            this.ocProtcolValueChange(form, forms, isInit)
        }
    }

    ocProtcolValueChange = (currentForm, forms, isInit) => {
        let parentForm = currentForm.parent.form
        let isICMP = currentForm.value === perpetual.PROTOCOL_ICMP
        for (const form of forms) {
            if (form.uuid === parentForm.uuid) {
                for (let childForm of form.forms) {
                    if (childForm.field === localFields.ocPortMin || childForm.field === localFields.ocPortMax || childForm.icon === '~') {
                        childForm.visible = !isICMP
                        childForm.value = undefined
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
        for (const form of forms) {
            if (form.field === localFields.operatorName) {
                this.getCloudletPoolInfo(form, forms)
            }
            else if (form.field === localFields.appName) {
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
                        if (form.field === localFields.requiredOutboundConnectionmulti) {
                            outboundList.push({ 'port_range_min': multiFormData[localFields.ocPortMin] && parseInt(multiFormData[localFields.ocPortMin]), 'port_range_max': multiFormData[localFields.ocPortMax] && parseInt(multiFormData[localFields.ocPortMax]), 'protocol': multiFormData[localFields.ocProtocol], 'remote_cidr': multiFormData[localFields.ocRemoteCIDR] })
                        }
                    }
                    data[uuid] = undefined
                }
            }
            role.validateRole(developerRoles, this.props.organizationInfo) && outboundList.length > 0 ? data[localFields.requiredOutboundConnections] = outboundList : null
            if (this.props.isUpdate) {
                let updateData = updateFieldDataNew(this, forms, data, this.originalData)
                if (updateData) {
                    mc = await updateTrustPolicyException(this, updateData)
                }
            }
            else {
                mc = await createTrustPolicyException(this, data)
            }
            if (responseValid(mc)) {
                const text = this.props.isUpdate ? 'updated' : 'created'
                this.props.handleAlertInfo('success', `Trust Policy Exception ${data[localFields.trustPolicyExceptionName]} ${text} successfully`)
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
                        case localFields.operatorName:
                            form.options = this.cloudletPoolList
                            break;
                        case localFields.poolName:
                            form.options = this.cloudletPoolList
                            break;
                        case localFields.organizationName:
                            form.options = this.organizationList
                            break;
                        case localFields.region:
                            form.options = this.props.regions;
                            break;
                        case localFields.appName:
                            form.options = this.appList
                            break;
                        case localFields.version:
                            form.options = this.appList
                            break;
                        case localFields.state:
                            form.options = this.stateList;
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
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want Trust Exception Policy.', update: { key: true } },
            { field: localFields.organizationName, label: 'App Developer', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: 'The name of the organization you are currently managing.', update: { key: true } },
            { field: localFields.trustPolicyExceptionName, label: 'Trust Policy Exception', formType: INPUT, placeholder: 'Enter Name', rules: { required: true }, visible: true, update: { key: true }, tip: 'Name of the Trust Policy Exception.' },
            { field: localFields.appName, label: 'App', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select App', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }, { index: 2, field: localFields.organizationName }], update: { key: true }, tip: 'The name of the application to deploy, only trusted apps' },
            { field: localFields.version, label: 'App Version', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select App Version', rules: { required: true }, visible: true, dependentData: [{ index: 4, field: localFields.appName }], update: { key: true }, tip: 'The version of the application to deploy.' },
            { field: localFields.operatorName, label: 'Operator', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }], tip: 'Organization of the cloudlet pool site', update: { key: true } },
            { field: localFields.poolName, label: 'Cloudlet Pool', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Cloudlet Pool', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }, { index: 6, field: localFields.operatorName }], update: { key: true }, tip: 'CloudletPool Name' },
            { field: localFields.state, label: 'Action', formType: SELECT, placeholder: 'Select Action', rules: { required: true }, visible: redux_org.isOperator(this), tip: 'State of the exception within the approval process.', update: { edit: true } },
            { field: localFields.requiredOutboundConnections, label: 'Required Outbound Connections', formType: HEADER, forms: !redux_org.isOperator(this) ? [{ formType: ICON_BUTTON, label: 'Add Connections', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getOutboundConnectionsForm }] : undefined, update: { edit: true, ignoreCase: true }, visible: true, tip: 'Connections this app require to determine if the app is compatible with a trust policy Exception' },
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

    outboundConnectionsForm = (canDelete = true) => ([
        { field: localFields.ocProtocol, label: 'Protocol', formType: SELECT, placeholder: 'Select', rules: { required: true, allCaps: true, required: true, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, options: [perpetual.PROTOCOL_TCP, perpetual.PROTOCOL_UDP, perpetual.PROTOCOL_ICMP], update: { edit: true } },
        { field: localFields.ocRemoteCIDR, label: 'Remote CIDR', formType: INPUT, rules: { required: true, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: validateRemoteCIDR },
        { field: localFields.ocPortMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number', min: 1, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: this.validateOCPortRange },
        { icon: '~', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1 },
        { field: localFields.ocPortMax, label: 'Port Range Max', formType: INPUT, rules: { required: true, type: 'number', min: 1, disabled: role.validateRole(developerRoles, this.props.organizationInfo) ? false : true }, width: 3, visible: true, update: { edit: true }, dataValidateFunc: this.validateOCPortRange },
        { icon: 'delete', formType: ICON_BUTTON, visible: canDelete && role.validateRole(developerRoles, this.props.organizationInfo) ? true : false, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getOutboundConnectionsForm = (form) => {
        return ({ uuid: uniqueId(), field: localFields.requiredOutboundConnectionmulti, formType: MULTI_FORM, forms: form ? form : this.outboundConnectionsForm(), width: 3, visible: true })
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
        let index = findIndexs(forms, localFields.requiredOutboundConnections)
        if (data[localFields.requiredOutboundConnections]) {
            let requiredOutboundConnections = data[localFields.requiredOutboundConnections]
            for (const requiredOutboundConnection of requiredOutboundConnections) {
                let outboundConnectionsForms = this.outboundConnectionsForm()
                let isNotICMP = requiredOutboundConnection['protocol'] !== perpetual.PROTOCOL_ICMP
                for (let outboundConnectionsForm of outboundConnectionsForms) {
                    if (outboundConnectionsForm.field === localFields.ocProtocol) {
                        outboundConnectionsForm.value = requiredOutboundConnection['protocol']
                    }
                    else if (outboundConnectionsForm.field === localFields.ocRemoteCIDR) {
                        outboundConnectionsForm.value = requiredOutboundConnection['remote_cidr']
                    }
                    else if (outboundConnectionsForm.field === localFields.ocPortMin) {
                        outboundConnectionsForm.visible = isNotICMP
                        outboundConnectionsForm.value = requiredOutboundConnection['port_range_min']
                    }
                    else if (outboundConnectionsForm.field === localFields.ocPortMax) {
                        outboundConnectionsForm.visible = isNotICMP
                        outboundConnectionsForm.value = requiredOutboundConnection['port_range_max']
                    }
                    else if (outboundConnectionsForm.icon ==='~') {
                        outboundConnectionsForm.visible = isNotICMP
                    }
                }
                forms.splice(index + multiFormCount, 0, this.getOutboundConnectionsForm(outboundConnectionsForms))
                multiFormCount++
            }
        }
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    getFormData = async (data) => {
        let forms = this.formKeys()

        if (data) {
            this.originalData = cloneDeep(data)
            await this.loadDefaultData(forms, data)
        }
        else {
            let organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
            this.organizationList = _sort(organizationList.map(org => org[localFields.organizationName]))
            forms.push(this.getOutboundConnectionsForm(this.outboundConnectionsForm(false)))
        }
        this.updateFormData(forms, data)
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })
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