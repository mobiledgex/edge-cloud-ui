import React from 'react';
import { withRouter } from 'react-router-dom';
import MexForms, { MAIN_HEADER, INPUT, SELECT, TIME_COUNTER, TEXT_AREA, HEADER, ICON_BUTTON } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { fields } from '../../../../services/model/format';
import { redux_org } from '../../../../helper/reduxData'
//model
import { getOrganizationList } from '../../../../services/modules/organization';
import MexMultiStepper, { updateStepper } from '../../../../hoc/stepper/mexMessageMultiStream'
import { Grid } from '@material-ui/core';
import { service, updateFieldData } from '../../../../services';
import { perpetual } from '../../../../helper/constant';
import { createAlertPolicy, updateAlertPolicy } from '../../../../services/modules/alertPolicy';
import { responseValid } from '../../../../services/service';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';

const ALERT_SEVERITY = [perpetual.INFO, perpetual.WARNING, perpetual.ERROR]
class Reg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            stepsArray: [],
        }
        this._isMounted = false
        this.isUpdate = this.props.action === perpetual.UPDATE
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    updateForms = (forms, isInit) => {
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    onCPUMemDiskChange = (currentForm, forms, isInit) => {
        let cpuLimit = undefined
        let memLimit = undefined
        let diskLimit = undefined
        let activeFormIndex = -1
        forms.forEach((form, i) => {
            if (form.field === fields.cpuUtilizationLimit) {
                cpuLimit = form.value
            }
            else if (form.field === fields.memUtilizationLimit) {
                memLimit = form.value
            }
            else if (form.field === fields.diskUtilizationLimit) {
                diskLimit = form.value
            }
            else if (form.field === fields.activeConnectionLimit) {
                activeFormIndex = i
            }
        })
        if (activeFormIndex >= 0) {
            forms[activeFormIndex].rules.disabled = Boolean(cpuLimit) || Boolean(diskLimit) || Boolean(memLimit)
        }
        this.updateForms(forms, isInit)
    }

    onActiveConnectionChange = (currentForm, forms, isInit) => {
        const value = currentForm.value
        for (const form of forms) {
            if (form.field === fields.cpuUtilizationLimit || form.field === fields.memUtilizationLimit || form.field === fields.diskUtilizationLimit) {
                form.rules.disabled = value !== undefined
            }
        }
        this.updateForms(forms, isInit)
    }

    checkForms = (form, forms, isInit, data) => {
        if (form.field === fields.cpuUtilizationLimit || form.field === fields.memUtilizationLimit || form.field === fields.diskUtilizationLimit) {
            this.onCPUMemDiskChange(form, forms, isInit)
        }
        else if (form.field === fields.activeConnectionLimit) {
            this.onActiveConnectionChange(form, forms, isInit)
        }
    }

    onValueChange = (currentForm) => {
        let forms = this.state.forms;
        this.checkForms(currentForm, forms)
    }

    validateLimit = (currentForm) => {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            if (currentForm.field === fields.activeConnectionLimit) {
                if (value < 1 || value > 4294967295) {
                    currentForm.error = 'Limit must be between 1-4294967295'
                }
            }
            else if (value < 1 || value > 100) {
                currentForm.error = 'Limit must be between 1-100'
                return false;
            }
        }
        currentForm.error = undefined;
        return true;
    }

    validateTriggerTime = (currentForm) => {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = currentForm.value
            let indexS = value.indexOf('s')
            let indexM = value.indexOf('m')
            if (indexM < 0) {
                const time = value.substring(0, indexS)
                if (time < 30) {
                    currentForm.error = 'Trigger time cannot be less than 30 sec'
                    return false;
                }
            }
        }
        currentForm.error = undefined;
        return true;
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

    /*Multi Form*/
    labelsForm = () => ([
        { field: fields.key, label: 'Key', formType: INPUT, rules: { required: true }, update: { edit: true }, width: 6, visible: true },
        { field: fields.value, label: 'Value', formType: INPUT, rules: { required: true }, update: { edit: true }, width: 6, visible: true },
        this.isUpdate ? {} :
            { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 4, onClick: this.removeMultiForm }
    ])

    getLabelsForm = (form) => {
        return ({ uuid: uuid(), field: fields.labels, formType: 'MultiForm', forms: form ? form : this.labelsForm(), width: 3, visible: true })
    }

    getAnnotationForm = (form) => {
        return ({ uuid: uuid(), field: fields.annotations, formType: 'MultiForm', forms: form ? form : this.labelsForm(), width: 3, visible: true })
    }

    getForms = () => ([
        { label: `${this.isUpdate ? 'Update' : 'Create'} Alert Policy`, formType: MAIN_HEADER, visible: true },
        { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, serverField: 'region', update: { key: true } },
        { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: redux_org.isAdmin(this) ? false : true, disabled: !redux_org.isAdmin(this) ? true : false }, value: redux_org.nonAdminOrg(this), visible: true, update: { key: true }, tip: ' Name of the organization for the app that this alert can be applied to' },
        { field: fields.alertPolicyName, label: 'Alert Policy Name', formType: INPUT, placeholder: 'Enter Alert Policy Name', rules: { required: true }, visible: true, update: { key: true }, tip: 'Alert Policy name' },
        { field: fields.severity, label: 'Severity', formType: SELECT, placeholder: 'Select Severity', rules: { required: true, firstCaps: true }, visible: true, update: { id: [fields.severity] }, tip: 'Alert severity level - one of "info", "warning", "error"' },
        { field: fields.triggerTime, label: 'Trigger time', formType: TIME_COUNTER, placeholder: 'Enter Trigger Time', rules: { required: true, onBlur: true }, visible: true, update: { id: [fields.triggerTime] }, tip: 'Duration for which alert interval is active', dataValidateFunc: this.validateTriggerTime },
        { field: fields.cpuUtilizationLimit, label: 'CPU Utilization Limit', formType: INPUT, placeholder: 'Enter CPU Utilization Limit', rules: { type: 'number', onBlur: true }, unit: '%', visible: true, update: { id: [fields.cpuUtilizationLimit] }, dataValidateFunc: this.validateLimit, tip: 'Container or pod CPU utilization rate(percentage) across all nodes. Valid values 1-100' },
        { field: fields.memUtilizationLimit, label: 'Memory Utilization Limit', formType: INPUT, placeholder: 'Enter Memory Utilization Limit', rules: { type: 'number', onBlur: true }, unit: '%', visible: true, update: { id: [fields.memUtilizationLimit] }, dataValidateFunc: this.validateLimit, tip: 'Container or pod memory utilization rate(percentage) across all nodes. Valid values 1-100' },
        { field: fields.diskUtilizationLimit, label: 'Disk Utilization Limit', formType: INPUT, placeholder: 'Enter Disk Utilization Limit', rules: { type: 'number', onBlur: true }, unit: '%', visible: true, update: { id: [fields.diskUtilizationLimit] }, dataValidateFunc: this.validateLimit, tip: 'Container or pod disk utilization rate(percentage) across all nodes. Valid values 1-100' },
        { field: fields.activeConnectionLimit, label: 'Active Connection Limit', formType: INPUT, placeholder: 'Enter Number of Active Connections', rules: { type: 'number', onBlur: true }, visible: true, update: { id: [fields.activeConnectionLimit] }, dataValidateFunc: this.validateLimit, tip: 'Active Connections alert threshold. Valid values 1-4294967295' },
        { field: fields.labels, label: 'Labels', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Labels', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getLabelsForm }], visible: true, update: { id: [fields.labels] }, tip: 'Additional Labels, specify labels:empty=true to clear' },
        { field: fields.annotations, label: 'Annotations', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Labels', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getAnnotationForm }], visible: true, update: { id: [fields.annotations] }, tip: 'Additional Annotations for extra information about the alert, specify annotations:empty=true to clear' }
    ])

    onUpdateResponse = (mc) => {
        this.props.handleLoadingSpinner(false)
        if (mc) {
            let responseData = undefined;
            let request = mc.request;
            if (mc.response && mc.response.data) {
                responseData = mc.response.data;
            }
            let labels = [{ label: 'Alert Policy', field: fields.trustPolicyName }]
            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onCreate = async (data) => {
        let mc = undefined
        if (data) {
            let labels = undefined
            let annotations = undefined
            let forms = this.state.forms
            for (const form of forms) {
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.labels) {
                            labels = labels ? labels : {}
                            labels[multiFormData[fields.key]] = multiFormData[fields.value]
                        }
                        else if (form.field === fields.annotations) {
                            annotations = annotations ? annotations : {}
                            annotations[multiFormData[fields.key]] = multiFormData[fields.value]
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if (labels) {
                data[fields.labels] = labels
            }

            if (annotations) {
                data[fields.annotations] = annotations
            }
            if (this.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    mc = await updateAlertPolicy(this, updateData, this.onUpdateResponse)
                }
            }
            else {
                mc = await service.authSyncRequest(this, createAlertPolicy(data))
            }
            if (mc && responseValid(mc)) {
                let policyName = mc.request.data.alertPolicy.key.name;
                this.props.handleAlertInfo('success', `Alert Policy ${policyName} ${this.isUpdate ? 'updated' : 'created'} successfully`)
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

    stepperClose = () => {
        this.updateState({
            stepsArray: []
        })
        this.props.onClose(true)
    }


    render() {
        return (
            <div className="round_panel">
                <Grid container>
                    <Grid item xs={12}>
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                    </Grid>
                </Grid>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region || field === fields.alertPolicyName) {
            rules.disabled = true;
        }
    }

    addMultiKeyValueDataForm = (position, data, forms, field, multiFormCount, formBody, newForm) => {
        let dataArray = data[field]
        Object.keys(dataArray).forEach(key => {
            let value = dataArray[key]
            let newForms = formBody()
            for (let form of newForms) {
                if (form.field === fields.key) {
                    form.value = key
                }
                else if (form.field === fields.value) {
                    form.value = value
                }
            }
            forms.splice(position + multiFormCount, 0, newForm(newForms))
            multiFormCount += 1
        })
        return multiFormCount
    }

    loadData(forms, data) {
        let multiFormCount = 0
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.formType === SELECT) {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.props.regions
                            break;
                        case fields.severity:
                            form.options = ALERT_SEVERITY;
                            break;
                        default:
                            form.options = undefined;
                    }
                }

                if (data) {
                    if (form.uuid) {
                        continue;
                    }
                    else if (form.field === fields.organizationName) {
                        form.value = data[fields.organizationName]
                    }
                    else if (form.field === fields.activeConnectionLimit) {
                        form.visible = data[fields.cpuUtilizationLimit] === undefined && data[fields.memUtilizationLimit] === undefined && data[fields.diskUtilizationLimit] === undefined
                        form.value = data[form.field]
                    }
                    else if (form.field === fields.cpuUtilizationLimit || form.field === fields.memUtilizationLimit || form.field === fields.diskUtilizationLimit) {
                        form.visible = data[fields.activeConnectionLimit] === undefined
                        form.value = data[form.field]
                    }
                    else {
                        form.value = data[form.field]
                    }
                    this.disableFields(form)
                }
            }
        }


        multiFormCount = this.addMultiKeyValueDataForm(11, data, forms, fields.labels, multiFormCount, this.labelsForm, this.getLabelsForm)
        multiFormCount = this.addMultiKeyValueDataForm(12, data, forms, fields.annotations, multiFormCount, this.labelsForm, this.getAnnotationForm)

    }

    getFormData = async (data) => {
        let forms = this.getForms();
        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'} Policy`, formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName]
            this.organizationList = [organization]

            this.loadData(forms, data)

        }
        else {
            this.organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
            this.loadData(forms)
        }
        this.updateState({ forms })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        regions: state.regionInfo.region,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Reg));