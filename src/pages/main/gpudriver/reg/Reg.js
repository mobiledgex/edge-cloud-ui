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
//Mex
import MexForms, { SELECT, BUTTON, INPUT, MAIN_HEADER, MULTI_FORM, HEADER, ICON_BUTTON, TEXT_AREA } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { localFields } from '../../../../services/fields';
//model
import { Grid } from '@material-ui/core';
import { redux_org } from '../../../../helper/reduxData';
import { getOrganizationList } from '../../../../services/modules/organization';
import { perpetual } from '../../../../helper/constant';
import { buildKey, createGPUDriver } from '../../../../services/modules/gpudriver';
import MexMultiStepper, { updateStepper } from '../../../../hoc/stepper/MexMessageMultiStream'
import { ACTION_UPDATE, OS_LINUX } from '../../../../helper/constant/perpetual';
import { uploadData } from '../../../../utils/file_util';
import { buildTip, osList } from './shared';
import { uniqueId } from '../../../../helper/constant/shared';

class GPUDriverReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            stepsArray: [],
        }
        this._isMounted = false
        this.canCloseStepper = false;
        this.organizationList = [];
        this.isUpdate = Boolean(this.props.id === ACTION_UPDATE)
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
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

    addMultiForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.multiForm());
        this.updateState({ forms })
    }

    buildForm = () => ([
        { field: localFields.buildName, label: 'Name', formType: INPUT, placeholder: 'Enter Build Name', rules: { required: true, type: 'search' }, width: 2, visible: true, update: { edit: true } },
        { field: localFields.driverPath, label: 'Driver Path', formType: INPUT, placeholder: 'Enter Driver Path', rules: { required: true, type: 'search' }, width: 2, visible: true, update: { edit: true } },
        { field: localFields.md5Sum, label: 'MD5 Sum', formType: INPUT, placeholder: 'Enter MD5 Sum', rules: { required: true, type: 'search' }, width: 2, visible: true, update: { edit: true } },
        { field: localFields.driverPathCreds, label: 'Driver Path Creds', formType: INPUT, placeholder: 'Enter username:password', rules: { required: false, type: 'password', autocomplete: "off" }, width: 2, visible: true, update: { edit: true } },
        { field: localFields.operatingSystem, label: 'Operating System', formType: SELECT, placeholder: 'Select Operating System', rules: { required: true }, width: 2, visible: true, update: { edit: true }, options: osList },
        { field: localFields.kernelVersion, label: 'Kernel Version', formType: INPUT, placeholder: 'Enter Kernel Version', rules: { required: false, type: 'search' }, width: 2, visible: true, update: { edit: true } },
        { field: localFields.hypervisorInfo, label: 'Hypervisor Info', formType: INPUT, placeholder: 'Enter Hypervisor Info', rules: { required: false, type: 'search' }, width: 2, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm, update: { edit: true } }
    ])

    buildMultiForm = (form) => {
        return ({ uuid: uniqueId(), field: localFields.build, formType: MULTI_FORM, forms: form ? form : this.buildForm(), width: 3, visible: true })
    }

    propertyForm = () => ([
        { field: localFields.key, label: 'Key', formType: INPUT, rules: { required: true }, width: 7, visible: true },
        { field: localFields.value, label: 'Value', formType: INPUT, rules: { required: true }, width: 7, visible: true },
        this.isUpdate ? {} :
            { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 2, onClick: this.removeMultiForm }
    ])

    getPropertyForm = (form) => {
        return ({ uuid: uniqueId(), field: localFields.property, formType: MULTI_FORM, forms: form ? form : this.propertyForm(), width: 3, visible: true })
    }

    onLicenseConfigLoad = (data, extra) => {
        let form = extra.form
        let manifestForm = form.parent.form.forms[0]
        manifestForm.value = data
        this.reloadForms()
    }

    clearLicenseConfig = (e, form) => {
        let manifestForm = form.parent.form.forms[0]
        manifestForm.value = undefined;
        this.reloadForms()
    }

    addLicenseConfig = (e, form) => {
        uploadData(e, this.onLicenseConfigLoad, { form: form })
    }

    deploymentManifestForm = () => ([
        { field: localFields.licenseConfig, formType: TEXT_AREA, rules: { required: false, onBlur: true }, update: { edit: true }, width: 14, visible: true },
        { icon: 'browse', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.addLicenseConfig },
        { icon: 'clear', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.clearManifestData }
    ])

    formKeys = () => {
        return [
            { label: 'Create GPU Driver', formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Region name' },
            { field: localFields.gpuDriverName, label: 'GPU Driver Name', formType: INPUT, placeholder: 'Enter GPU Driver Name', rules: { required: true }, visible: true, tip: 'Name of the driver' },
            { field: localFields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: ' Organization to which the driver belongs to', update: { key: true } },
            { uuid: uniqueId(), field: localFields.licenseConfig, label: 'License Config', formType: TEXT_AREA, visible: true, update: { id: ['16'] }, forms: this.deploymentManifestForm(), tip: 'Deployment manifest is the deployment specific manifest file/config For docker deployment, this can be a docker-compose or docker run file For kubernetes deployment, this can be a kubernetes yaml or helm chart file' },
            { field: localFields.builds, label: 'Builds', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Build', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.buildMultiForm }], update: { id: ['7'], ignoreCase: true }, visible: true, tip: buildTip },
            { field: localFields.properties, label: 'Properties', formType: HEADER, forms: this.isUpdate ? [] : [{ formType: ICON_BUTTON, label: 'Add Env Vars', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getPropertyForm }], visible: true, tip: 'Additional properties associated with GPU driver build For example: license server information, driver release date, etc, specify properties:empty=true to clear' },
        ]
    }

    onOperatingSystemChange = (currentForm, forms, isInit) => {
        let parentForm = currentForm.parent.form
        for (const form of forms) {
            if (form.uuid === parentForm.uuid) {
                for (const childForm of form.forms) {
                    if (childForm.field === localFields.kernelVersion) {
                        childForm.rules.required = currentForm.value === OS_LINUX
                        break;
                    }
                }
                break;
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === localFields.operatingSystem) {
            this.onOperatingSystemChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = async (mc) => {
        if (mc) {
            this.props.handleLoadingSpinner(false)
            if (mc.close) {
                this.canCloseStepper = true
            }
            if (mc.close && this.state.stepsArray.length === 0) {
                this.props.onClose(true)
            }
            else {
                let responseData = undefined;
                let request = mc.request;
                if (mc.response && mc.response.data) {
                    responseData = mc.response.data;
                }
                let labels = [{ label: 'GPU Driver', field: localFields.gpuDriverName }]
                this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
            }
        }
    }

    onCreate = (data) => {
        if (data) {
            let builds = []
            let properties = {}
            let forms = this.state.forms;
            for (const form of forms) {
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === localFields.build) {
                            builds.push(buildKey(multiFormData))
                        }
                        else if (form.field === localFields.licenseConfig && multiFormData[localFields.licenseConfig]) {
                            data[localFields.licenseConfig] = multiFormData[localFields.licenseConfig].trim()
                        }
                        else if (form.field === localFields.property) {
                            properties[multiFormData[localFields.key]] = multiFormData[localFields.value]
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if (builds.length > 0) {
                data[localFields.builds] = builds
            }
            if (Boolean(properties)) {
                data[localFields.properties] = properties
            }
            if (this.props.isUpdate) {
            }
            else {
                this.props.handleLoadingSpinner(true)
                createGPUDriver(this, data, this.onCreateResponse)
            }
        }
    }


    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
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
                if (form.formType === SELECT) {
                    switch (form.field) {
                        case localFields.region:
                            form.options = this.props.regions;
                            break;
                        case localFields.organizationName:
                            form.options = this.organizationList;
                            break;
                        case localFields.operatingSystem:
                            form.options = osList
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
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
                    this.checkForms(form, forms, true, data)
                }
            }
        }

    }

    loadDefaultData = async (data) => {
        if (data) {
        }
        else {
            if (redux_org.isAdmin(this)) {
                this.organizationList.push({ organizationName: perpetual.MOBILEDGEX })
            }
            this.organizationList = [...this.organizationList, ...await getOrganizationList(this, { type: perpetual.OPERATOR })]
        }
    }

    getFormData = async (data) => {
        await this.loadDefaultData(data)
        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })

        this.updateFormData(forms, data)
        this.updateState({ forms })
    }

    stepperClose = () => {
        if (this.canCloseStepper) {
            this.updateState({
                stepsArray: []
            })
            this.props.onClose(true)
        }
    }

    render() {
        const { stepsArray, forms } = this.state
        return (
            <div className="round_panel">
                <Grid container>
                    <Grid item xs={12}>
                        <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                    </Grid>
                </Grid>
                <MexMultiStepper multiStepsArray={stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data);
        this.props.handleViewMode(undefined)
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region,
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(GPUDriverReg));