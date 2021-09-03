import React from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, BUTTON, INPUT, MAIN_HEADER, MULTI_FORM, HEADER, ICON_BUTTON } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { fields } from '../../../../services/model/format';
//model
import { Grid } from '@material-ui/core';
import { redux_org } from '../../../../helper/reduxData';
import uuid from 'uuid';
import MexMultiStepper, { updateStepper } from '../../../../hoc/stepper/mexMessageMultiStream'
import { ACTION_UPDATE, OS_LINUX } from '../../../../helper/constant/perpetual';
import { buildTip, osList } from './shared';
import { buildKey, removeBuild } from '../../../../services/modules/gpudriver';
import { addbuild } from '../../../../services/modules/gpudriver/gpudriver';
import { sendWSRequest } from '../../../../services/model/serverData';

class GPUDriverReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            multiStepsArray: [],
        }
        this._isMounted = false
        this.canCloseStepper = false;
        this.isUpdate = Boolean(this.props.id === ACTION_UPDATE)
        this.addList = []
        this.removeList = []
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    removeMultiForm = (e, form) => {
        if (form.parent) {
            let parentForm = form.parent.form
            if (parentForm.existing) {
                this.removeList.push(parentForm)
            }
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
        let childForm = form.multiForm()
        this.addList.push(childForm.uuid)
        forms.splice(parent.id + 1, 0, childForm);
        this.updateState({ forms })
    }

    buildForm = (disabled) => ([
        { field: fields.buildName, label: 'Name', formType: INPUT, placeholder: 'Enter Build Name', rules: { required: true, disabled }, width: 2, visible: true },
        { field: fields.driverPath, label: 'Driver Path', formType: INPUT, placeholder: 'Enter Driver Path', rules: { required: true, disabled }, width: 2, visible: true },
        { field: fields.md5Sum, label: 'MD5 Sum', formType: INPUT, placeholder: 'Enter MD5 Sum', rules: { required: true, disabled }, width: 2, visible: true, },
        { field: fields.driverPathCreds, label: 'Driver Path Creds', formType: INPUT, placeholder: 'Enter username:password', rules: { required: false, type: 'password', disabled }, width: 2, visible: true },
        { field: fields.operatingSystem, label: 'Operating System', formType: SELECT, placeholder: 'Select Operating System', rules: { required: true, disabled }, width: 2, visible: true, options: osList },
        { field: fields.kernelVersion, label: 'Kernel Version', formType: INPUT, placeholder: 'Enter Kernel Version', rules: { required: false, disabled }, width: 2, visible: true },
        { field: fields.hypervisorInfo, label: 'Hypervisor Info', formType: INPUT, placeholder: 'Enter Hypervisor Info', rules: { required: false, disabled }, width: 2, visible: true },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    buildMultiForm = (form) => {
        return ({ uuid: uuid(), field: fields.build, formType: MULTI_FORM, forms: form ? form : this.buildForm(), width: 3, visible: true })
    }

    formKeys = () => {
        return [
            { label: 'Update Builds', formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true, disabled: true }, visible: true, tip: 'Region name' },
            { field: fields.gpuDriverName, label: 'GPU Driver Name', formType: INPUT, placeholder: 'Enter GPU Driver Name', rules: { required: true, disabled: true }, visible: true, tip: 'Name of the driver' },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: ' Organization to which the driver belongs to', update: { key: true } },
            { field: fields.builds, label: 'Builds', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Build', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.buildMultiForm }], update: { id: ['7'], ignoreCase: true }, visible: true, tip: buildTip }
        ]
    }

    onOperatingSystemChange = (currentForm, forms, isInit) => {
        let parentForm = currentForm.parent.form
        for (const form of forms) {
            if (form.uuid === parentForm.uuid) {
                for (const childForm of form.forms) {
                    if (childForm.field === fields.kernelVersion) {
                        childForm.rules.required = currentForm.value === OS_LINUX
                        break;
                    }
                }
                break;
            }
        }
        if (isInit === false || isInit === undefined) {
            this.updateState({ forms })
        }
    }

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.operatingSystem) {
            this.onOperatingSystemChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    sendRequest = (requestList) => {
        if (requestList.length > 0) {
            let item = requestList[0]
            requestList.splice(0, 1)
            sendWSRequest(this, item.request, this.onUpdateResponse, { data: item.orgData, requestList })
        }
        else {
            this.canCloseStepper = true
        }
    }

    onUpdateResponse = (mc) => {
        let data = mc.request.orgData.data
        this.props.handleLoadingSpinner(false)
        if (mc.close) {
            this.sendRequest(mc.request.orgData.requestList)
        }
        if (mc) {
            let responseData = undefined;
            if (mc.response && mc.response.data) {
                responseData = mc.response.data;
            }
            this.updateState({ multiStepsArray: updateStepper(this.state.multiStepsArray, [{ label: 'Build Name', field: fields.name }], data, responseData, mc.wsObj) })
        }
    }

    onUpdate = (data) => {
        let requestData = { region: data[fields.region], organizationName: data[fields.organizationName], gpuDriverName: data[fields.gpuDriverName] }
        let requestList = []
        if (this.removeList.length > 0) {
            for (const item of this.removeList) {
                let forms = item.forms
                let build = {}
                for (const form of forms) {
                    if (form.value && form.field === fields.buildName) {
                        build[form.field] = form.value
                        break;
                    }
                }
                build = buildKey(build)
                requestList.push({ request: removeBuild(this, { ...requestData, build }), orgData: { uuid: item.uuid, ...build } })
            }
        }
        if (this.addList.length > 0) {
            let forms = this.state.forms;
            for (const form of forms) {
                if (form.uuid) {
                    let uuid = form.uuid;
                    if (this.addList.includes(uuid)) {
                        let multiFormData = data[uuid]
                        if (multiFormData) {
                            if (form.field === fields.build) {
                                let build = buildKey(multiFormData)
                                requestList.push({ request: addbuild(this, { ...requestData, build }), orgData: { uuid, ...build } })
                            }
                        }
                    }
                    data[uuid] = undefined
                }
            }
        }

        if (requestList.length > 0) {
            this.props.handleLoadingSpinner(true)
            this.sendRequest(requestList)
        }

    }


    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    onCancel = () => {
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
                        case fields.region:
                            form.options = this.props.regions;
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList;
                            break;
                        case fields.operatingSystem:
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

    loadDefaultData = async (forms, data) => {
        let organization = {}
        organization[fields.organizationName] = data[fields.organizationName];
        this.organizationList = [organization]

        let multiFormCount = 0
        if (data[fields.builds]) {
            let builds = data[fields.builds]
            for (const build of builds) {
                let buildForms = this.buildForm(true)
                for (let form of buildForms) {
                    if (form.field === fields.buildName) {
                        form.value = build[fields.buildName]
                    }
                    else if (form.field === fields.driverPath) {
                        form.value = build[fields.driverPath]
                    }
                    else if (form.field === fields.md5Sum) {
                        form.value = build[fields.md5Sum]
                    }
                    else if (form.field === fields.operatingSystem) {
                        form.value = build[fields.operatingSystem] ? build[fields.operatingSystem] : OS_LINUX
                    }
                    else if (form.field === fields.hypervisorInfo) {
                        form.value = build[fields.hypervisorInfo]
                    }
                    else if (form.field === fields.kernelVersion) {
                        form.value = build[fields.kernelVersion]
                    }
                }
                forms.splice(5 + multiFormCount, 0, { ...this.buildMultiForm(buildForms), existing: true })
                multiFormCount += 1
            }
        }
    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        await this.loadDefaultData(forms, data)
        forms.push(
            { label: 'Update', formType: BUTTON, onClick: this.onUpdate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onCancel })

        this.updateFormData(forms, data)
        this.updateState({ forms })
    }

    multiStepperClose = () => {
        if (this.canCloseStepper) {
            this.state.multiStepsArray.map(item => {
                item.wsObj.close()
            })
            this.updateState({
                multiStepsArray: []
            })
            this.props.onClose()
        }
    }

    render() {
        const { multiStepsArray, forms } = this.state
        return (
            <div className="round_panel">
                <Grid container>
                    <Grid item xs={12}>
                        <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Grid>
                </Grid>
                <MexMultiStepper multiStepsArray={multiStepsArray} onClose={this.multiStepperClose} />
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