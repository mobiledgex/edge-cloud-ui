import React from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, BUTTON, INPUT, MAIN_HEADER, MULTI_FORM, HEADER, ICON_BUTTON, findIndexs } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { localFields } from '../../../../services/fields';
//model
import { Grid } from '@material-ui/core';
import { redux_org } from '../../../../helper/reduxData';
import MexMultiStepper, { updateStepper } from '../../../../hoc/stepper/MexMessageMultiStream'
import { ACTION_UPDATE, OS_LINUX } from '../../../../helper/constant/perpetual';
import { buildTip, osList } from './shared';
import { buildKey, addbuild, removeBuild } from '../../../../services/modules/gpudriver';
import { uniqueId } from '../../../../helper/constant/shared';
import { websocket } from '../../../../services';

class BuildReg extends React.Component {
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
        { field: localFields.buildName, label: 'Name', formType: INPUT, placeholder: 'Enter Build Name', rules: { required: true, disabled }, width: 2, visible: true },
        { field: localFields.driverPath, label: 'Driver Path', formType: INPUT, placeholder: 'Enter Driver Path', rules: { required: true, disabled }, width: 2, visible: true },
        { field: localFields.md5Sum, label: 'MD5 Sum', formType: INPUT, placeholder: 'Enter MD5 Sum', rules: { required: true, disabled }, width: 2, visible: true, },
        { field: localFields.driverPathCreds, label: 'Driver Path Creds', formType: INPUT, placeholder: 'Enter username:password', rules: { required: false, type: 'password', disabled }, width: 2, visible: true },
        { field: localFields.operatingSystem, label: 'Operating System', formType: SELECT, placeholder: 'Select Operating System', rules: { required: true, disabled }, width: 2, visible: true, options: osList },
        { field: localFields.kernelVersion, label: 'Kernel Version', formType: INPUT, placeholder: 'Enter Kernel Version', rules: { required: false, disabled }, width: 2, visible: true },
        { field: localFields.hypervisorInfo, label: 'Hypervisor Info', formType: INPUT, placeholder: 'Enter Hypervisor Info', rules: { required: false, disabled }, width: 2, visible: true },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    buildMultiForm = (form) => {
        return ({ uuid: uniqueId(), field: localFields.build, formType: MULTI_FORM, forms: form ? form : this.buildForm(), width: 3, visible: true })
    }

    formKeys = () => {
        return [
            { label: 'Update Builds', formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true, disabled: true }, visible: true, tip: 'Region name' },
            { field: localFields.gpuDriverName, label: 'GPU Driver Name', formType: INPUT, placeholder: 'Enter GPU Driver Name', rules: { required: true, disabled: true }, visible: true, tip: 'Name of the driver' },
            { field: localFields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: ' Organization to which the driver belongs to', update: { key: true } },
            { field: localFields.builds, label: 'Builds', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Build', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.buildMultiForm }], update: { id: ['7'], ignoreCase: true }, visible: true, tip: buildTip }
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

    sendRequest = (requestList) => {
        if (requestList.length > 0) {
            let item = requestList[0]
            requestList.splice(0, 1)
            websocket.request(this, item.request, this.onUpdateResponse, { data: item.orgData, requestList })
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
            this.updateState({ multiStepsArray: updateStepper(this.state.multiStepsArray, [{ label: 'Build Name', field: localFields.name }], data, responseData, mc.wsObj) })
        }
    }

    onUpdate = (data) => {
        let requestData = { region: data[localFields.region], organizationName: data[localFields.organizationName], gpuDriverName: data[localFields.gpuDriverName] }
        let requestList = []
        if (this.removeList.length > 0) {
            for (const item of this.removeList) {
                let forms = item.forms
                let build = {}
                for (const form of forms) {
                    if (form.value && form.field === localFields.buildName) {
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
                            if (form.field === localFields.build) {
                                let build = buildKey(multiFormData)
                                requestList.push({ request: addbuild(this, { ...requestData, build }), orgData: { uuid, ...build } })
                            }
                        }
                    }
                    data[uuid] = undefined
                }
            }
        }
        else
        {
            this.props.handleAlertInfo('error', 'Nothing to update')
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

    loadDefaultData = async (forms, data) => {
        let organization = {}
        organization[localFields.organizationName] = data[localFields.organizationName];
        this.organizationList = [organization]

        let multiFormCount = 0
        let index = findIndexs(forms, localFields.builds)
        if (data[localFields.builds]) {
            let builds = data[localFields.builds]
            for (const build of builds) {
                let buildForms = this.buildForm(true)
                for (let form of buildForms) {
                    if (form.field === localFields.buildName) {
                        form.value = build[localFields.buildName]
                    }
                    else if (form.field === localFields.driverPath) {
                        form.value = build[localFields.driverPath]
                    }
                    else if (form.field === localFields.md5Sum) {
                        form.value = build[localFields.md5Sum]
                    }
                    else if (form.field === localFields.operatingSystem) {
                        form.value = build[localFields.operatingSystem] ? build[localFields.operatingSystem] : OS_LINUX
                    }
                    else if (form.field === localFields.hypervisorInfo) {
                        form.value = build[localFields.hypervisorInfo]
                    }
                    else if (form.field === localFields.kernelVersion) {
                        form.value = build[localFields.kernelVersion]
                    }
                }
                forms.splice(index + multiFormCount, 0, { ...this.buildMultiForm(buildForms), existing: true })
                multiFormCount++
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(BuildReg));