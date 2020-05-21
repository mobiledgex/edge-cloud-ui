import React from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, INPUT, CHECKBOX, TEXT_AREA, ICON_BUTTON, SELECT_RADIO_TREE } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization } from '../../../services/model/format';
//model
import * as serverData from '../../../services/model/serverData'
import { getOrganizationList } from '../../../services/model/organization';
import { getFlavorList } from '../../../services/model/flavor';
import { getPrivacyPolicyList } from '../../../services/model/privacyPolicy';
import { getAutoProvPolicyList } from '../../../services/model/autoProvisioningPolicy';
import { createApp, updateApp } from '../../../services/model/app';
import { refreshAllAppInst } from '../../../services/model/appInstance';
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { appTutor } from "../../../tutorial";


const appSteps = appTutor();

class AppReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            stepsArray: []
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = _.cloneDeep(props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion)
        if(!this.isUpdate){this.regions.splice(0, 0, 'All')}
        this.flavorList = []
        this.privacyPolicyList = []
        this.autoProvPolicyList = []
        this.requestedRegionList = []
        this.appInstanceList = []
        this.configOptions = [constant.CONFIG_ENV_VAR, constant.CONFIG_HELM_CUST]
        this.originalData = undefined
        this.expandAdvanceMenu = false
    }

    validatePortRange = (form) => {
        if (form.value && form.value.length > 0) {
            let value = parseInt(form.value)
            if (value < 1 || value > 65535) {
                form.error = 'Invalid Port Range (must be between 1-65535)'
                return false;
            }
        }
        form.error = undefined;
        return true;
    }

    /**Deployment manifest block */

    clearManifestData = (e, form) => {
        let manifestForm = form.parent.form.forms[0]
        manifestForm.value = undefined;
        this.reloadForms()
    }

    addManifestData = (e, form) => {
        e.preventDefault();
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "*";
        input.onchange = (event) => {
            let file = event.target.files[0];
            if (file) {
                if (file.size <= 1000000) {
                    let reader = new FileReader();
                    reader.onload = () => {
                        let manifestForm = form.parent.form.forms[0]
                        manifestForm.value = reader.result;
                        this.reloadForms()
                    };
                    reader.readAsText(file)
                }
                else {
                    this.props.handleAlertInfo('error', 'File size cannot be >1MB')
                }
            }
        };
        input.click();
    }

    deploymentManifestForm = () => ([
        { field: fields.deploymentManifest, formType: TEXT_AREA, rules: { required: false }, update: true, width: 14, visible: true },
        { icon: 'browse', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.addManifestData },
        { icon: 'clear', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.clearManifestData }
    ])

    /**Deployment manifest block */

    portForm = () => ([
        { field: fields.portRangeMax, label: 'Port', formType: INPUT, rules: { required: true, type: 'number' }, width: 9, visible: true, update: true, dataValidateFunc: this.validatePortRange },
        { field: fields.protocol, label: 'Protocol', formType: SELECT, placeholder: 'Please select protocol', rules: { required: true, allCaps: true }, width: 3, visible: true, options: ['tcp', 'udp'], update: true },
        { field: fields.tls, label: 'TLS', formType: CHECKBOX, visible: false, value: false, width: 1},
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeMultiForm, update: true }
    ])

    getPortForm = (form) => {
        return ({ uuid: uuid(), field: fields.ports, formType: 'MultiForm', forms: form ? form : this.portForm(), width: 3, visible: true })
    }

    annotationForm = () => ([
        { field: fields.key, label: 'Key', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        { field: fields.value, label: 'Value', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 4, onClick: this.removeMultiForm }
    ])

    getAnnotationForm = (form) => {
        return ({ uuid: uuid(), field: fields.annotations, formType: 'MultiForm', forms: form ? form : this.annotationForm(), width: 3, visible: true })
    }

    multiPortForm = () => ([
        { field: fields.portRangeMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number' }, width: 4, visible: true, update: true, dataValidateFunc: this.validatePortRange },
        { icon: '~', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1 },
        { field: fields.portRangeMax, label: 'Port Range Max', formType: INPUT, rules: { required: true, type: 'number' }, width: 4, visible: true, update: true, dataValidateFunc: this.validatePortRange },
        { field: fields.protocol, label: 'Protocol', formType: SELECT, placeholder: 'Please select protocol', rules: { required: true, allCaps: true }, width: 3, visible: true, options: ['tcp', 'udp'], update: true },
        { field: fields.tls, label: 'TLS', formType: CHECKBOX, visible: false, value: false, width: 1 },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeMultiForm, update: true }
    ])

    getMultiPortForm = (form) => {
        return ({ uuid: uuid(), field: fields.ports, formType: 'MultiForm', forms: form ? form : this.multiPortForm(), width: 3, visible: true })
    }

    configForm = () => ([
        { field: fields.config, label: 'Config', formType: TEXT_AREA, rules: { required: true, type: 'number', rows: 4 }, width: 9, visible: true, update: true },
        { field: fields.kind, label: 'Kind', formType: SELECT, placeholder: 'Select Kind', rules: { required: true }, width: 4, visible: true, options: this.configOptions, update: true },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeMultiForm }
    ])

    getConfigForm = (form) => {
        return ({ uuid: uuid(), field: fields.configs, formType: 'MultiForm', forms: form ? form : this.configForm(), width: 3, visible: true })
    }

    removeMultiForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.setState({
                forms: updateForms
            })
        }
    }

    addMultiForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.multiForm());
        this.setState({ forms: forms })
    }

    updateImagePath = (forms, form) => {
        let organizationName = undefined;
        let version = undefined;
        let deployment = undefined;
        let appName = undefined;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.organizationName) {
                organizationName = form.value
            }
            else if (form.field === fields.version) {
                version = form.value
            }
            else if (form.field === fields.deployment) {
                deployment = form.value
            }
            else if (form.field === fields.appName) {
                appName = form.value
            }
        }
        if (deployment && version && organizationName) {
            form.value = deployment === constant.DEPLOYMENT_TYPE_VM ?
                `https://artifactory.mobiledgex.net/artifactory/repo-${organizationName}` :
                deployment === constant.DEPLOYMENT_TYPE_HELM ?
                    `https://chart.registry.com/charts:${organizationName}/${appName}` :
                    `docker.mobiledgex.net/${organizationName}/images/${appName}:${version}`
        }
    }

    deploymentValueChange = (currentForm, forms, isInit) => {
        forms = forms.filter((form) => {
            if (form.field === fields.imageType) {
                form.value = currentForm.value === constant.DEPLOYMENT_TYPE_HELM ? constant.IMAGE_TYPE_HELM :
                    currentForm.value === constant.DEPLOYMENT_TYPE_VM ? constant.IMAGE_TYPE_QCOW : constant.IMAGE_TYPE_DOCKER
                return form
            }
            else if (form.field === fields.imagePath) {
                this.updateImagePath(forms, form)
                return form
            }
            else if (form.field === fields.scaleWithCluster) {
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? true : false
                return form
            }
            else if (form.field === fields.accessType) {
                form.options = (currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES || currentForm.value === constant.DEPLOYMENT_TYPE_HELM) ?
                    [constant.ACCESS_TYPE_LOAD_BALANCER] :
                    [constant.ACCESS_TYPE_LOAD_BALANCER, constant.ACCESS_TYPE_DIRECT]
                form.value = currentForm.value === constant.DEPLOYMENT_TYPE_VM ? constant.ACCESS_TYPE_DIRECT : constant.ACCESS_TYPE_LOAD_BALANCER
                return form
            }
            else if (form.label === 'Configs') {
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_HELM || currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? true : false
                this.configOptions = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? [constant.CONFIG_ENV_VAR] : [constant.CONFIG_ENV_VAR, constant.CONFIG_HELM_CUST]
                return form
            }
            else if (form.label === 'Annotations') {
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_HELM ? true : false
                return form
            }
            else if (form.field === fields.annotations) {
                if (currentForm.value === constant.DEPLOYMENT_TYPE_HELM) {
                    return form
                }
            }
            else if (form.field === fields.configs) {
                if (currentForm.value === constant.DEPLOYMENT_TYPE_HELM || currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES) {
                    return form
                }
            }
            else {
                return form
            }
        })
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    getFlavorInfo = async (region, form, forms) => {
        if (region && !this.requestedRegionList.includes(region)) {
            let newList = await getFlavorList(this, { region: region })
            this.flavorList = [...this.flavorList, ...newList]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getPrivacyPolicy = async (region, form, forms) => {
        if (region && !this.requestedRegionList.includes(region)) {
            let newList = await getPrivacyPolicyList(this, { region: region })
            this.privacyPolicyList = [...this.privacyPolicyList, ...newList]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getAutoProvPolicy = async (region, form, forms) => {
        if (region && !this.requestedRegionList.includes(region)) {
            let newList = await getAutoProvPolicyList(this, { region: region })
            this.autoProvPolicyList = [...this.autoProvPolicyList, ...newList]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    protcolValueChange = (currentForm, forms, isInit) => {
        let childForms = currentForm.parent.form.forms
        for (let i = 0; i < childForms.length; i++) {
            let form = childForms[i]
            if (form.field === fields.tls) {
                form.visible = currentForm.value === 'tcp'
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    regionDependentDataUpdate = (region, forms, isInit)=>
    {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.autoPolicyName) {
                if (isInit === undefined || isInit === false) {
                    this.getAutoProvPolicy(region, form, forms)
                }
            }
            else if (form.field === fields.flavorName) {
                if (isInit === undefined || isInit === false) {
                    this.getFlavorInfo(region, form, forms)
                }
            }
            else if (form.field === fields.privacyPolicyName) {
                if (isInit === undefined || isInit === false) {
                    this.getPrivacyPolicy(region, form, forms)
                }
            }
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let regions = currentForm.value;
        if(regions.includes('All'))
        {
            regions = _.cloneDeep(this.regions)
            regions.splice(0, 1)
        }
        if (!this.isUpdate && regions.length > 0) {
            regions.map(region => {
                this.regionDependentDataUpdate(region, forms, isInit)
                this.requestedRegionList.push(region)
            })
        }
        else
        {
            let region = this.isUpdate ? currentForm.value : undefined
            this.regionDependentDataUpdate(region, forms, isInit) 
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.imagePath) {
                this.updateImagePath(forms, form)
            }
        }
        this.setState({
            forms: forms
        })
    }

    versionValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.imagePath) {
                this.updateImagePath(forms, form)
            }
        }
        this.setState({
            forms: forms
        })
    }

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === fields.version || form.field === fields.appName) {
            this.versionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.deployment) {
            this.deploymentValueChange(form, forms, isInit)
        }
        else if (form.field === fields.protocol) {
            this.protcolValueChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    advanceMenu = (e, form) => {
        this.expandAdvanceMenu = !this.expandAdvanceMenu
        form.icon = this.expandAdvanceMenu ? 'expand_more' : 'expand_less'
        let forms = this.state.forms

        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.advance !== undefined) {
                form.advance = this.expandAdvanceMenu
            }
        }
        this.reloadForms()
    }

    onUpgradeResponse = (mcRequest) => {
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            let request = mcRequest.request;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let labels = [{ label: 'App', field: fields.appName }]
            this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onAddResponse = (mcRequestList) => {
        if(mcRequestList && mcRequestList.length > 0)
        {
            mcRequestList.map(mcRequest=>{
                if(mcRequest.response)
                {
                    let data = mcRequest.request.data;
                    this.props.handleAlertInfo('success', `App ${data.app.key.name} added successfully`)
                }
            })
        }
        this.props.onClose(true)
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms;
            let ports = ''
            let annotations = ''
            let configs = []
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (multiFormData[fields.portRangeMin] && multiFormData[fields.portRangeMax]) {
                            ports = ports.length > 0 ? ports + ',' : ports
                            ports = ports + multiFormData[fields.protocol].toUpperCase() + ':' + multiFormData[fields.portRangeMin] + '-' + multiFormData[fields.portRangeMax]
                            ports = ports + (multiFormData[fields.tls] ? ':tls' : '')
                        }
                        else if (multiFormData[fields.portRangeMax]) {
                            ports = ports.length > 0 ? ports + ',' : ports
                            ports = ports + multiFormData[fields.protocol].toUpperCase() + ':' + multiFormData[fields.portRangeMax]
                            ports = ports + (multiFormData[fields.tls] ? ':tls' : '')
                        }
                        else if (form.field === fields.deploymentManifest && multiFormData[fields.deploymentManifest]) {
                            data[fields.deploymentManifest] = multiFormData[fields.deploymentManifest].trim()
                        }
                        else if (multiFormData[fields.key] && multiFormData[fields.value]) {
                            annotations = annotations.length > 0 ? annotations + ',' : annotations
                            annotations = annotations + `${multiFormData[fields.key]}=${multiFormData[fields.value]}`
                        }
                        else if (multiFormData[fields.kind] && multiFormData[fields.config]) {
                            configs.push(multiFormData)
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if ((data[fields.imagePath] && data[fields.imagePath].length > 0) || (data[fields.deploymentManifest] && data[fields.deploymentManifest].length > 0)) {
                if (ports.length > 0) {
                    data[fields.accessPorts] = ports

                    if (annotations.length > 0) {
                        data[fields.annotations] = annotations
                    }
                    if (configs.length > 0) {
                        data[fields.configs] = configs
                    }

                    if (this.isUpdate) {
                        if (await updateApp(this, data, this.originalData)) {
                            this.props.handleAlertInfo('success', `App ${data[fields.appName]} updated successfully`)
                            if (data[fields.refreshAppInst]) {
                                serverData.sendWSRequest(this, refreshAllAppInst(data), this.onUpgradeResponse, data)
                            }
                            else {
                                this.props.onClose(true)
                            }
                        }
                    }
                    else {
                        let regions = data[fields.region]
                        let requestDataList = []
                        if(regions.includes('All'))
                        {
                            regions = _.cloneDeep(this.regions)
                            regions.splice(0, 1)
                        }
                        regions.map(region => {
                            let requestData = JSON.parse(JSON.stringify(data))
                            requestData[fields.region] = region
                            requestData[fields.flavorName] = undefined
                            for (let i = 0; i < data[fields.flavorName].length; i++) {
                                let flavor = data[fields.flavorName][i]
                                if (flavor.parent === region) {
                                    requestData[fields.flavorName] = flavor.value
                                    break;
                                }
                            }
                            if (data[fields.privacyPolicyName]) {
                                requestData[fields.privacyPolicyName] = undefined
                                for (let i = 0; i < data[fields.privacyPolicyName].length; i++) {
                                    let privacyPolicy = data[fields.privacyPolicyName][i]
                                    if (privacyPolicy.parent === region) {
                                        requestData[fields.privacyPolicyName] = privacyPolicy.value
                                        break;
                                    }
                                }
                            }
                            if (data[fields.autoPolicyName]) {
                                requestData[fields.autoPolicyName] = undefined
                                for (let i = 0; i < data[fields.autoPolicyName].length; i++) {
                                    let autoPolicy = data[fields.autoPolicyName][i]
                                    if (autoPolicy.parent === region) {
                                        requestData[fields.autoPolicyName] = autoPolicy.value
                                        break;
                                    }
                                }
                            }
                            requestDataList.push(createApp(requestData))
                        })

                        if(requestDataList && requestDataList.length > 0)
                        {
                            serverData.sendMultiRequest(this, requestDataList, this.onAddResponse)
                        }
                    }
                }
                else {
                    this.props.handleAlertInfo('error', 'At least one port is mandatory')
                }
            }
            else {
                this.props.handleAlertInfo('error', 'Please input image path or deployment manifest')
            }
        }
    }


    /*Required*/
    reloadForms = () => {
        this.setState({
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT || form.formType === SELECT_RADIO_TREE) {
                    switch (form.field) {
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.flavorName:
                            form.options = this.flavorList
                            break;
                        case fields.privacyPolicyName:
                            form.options = this.privacyPolicyList
                            break;
                        case fields.autoPolicyName:
                            form.options = this.autoProvPolicyList
                            break;
                        case fields.deployment:
                            form.options = [constant.DEPLOYMENT_TYPE_DOCKER, constant.DEPLOYMENT_TYPE_KUBERNETES, constant.DEPLOYMENT_TYPE_VM, constant.DEPLOYMENT_TYPE_HELM]
                            break;
                        case fields.accessType:
                            form.options = [constant.ACCESS_TYPE_DIRECT, constant.ACCESS_TYPE_LOAD_BALANCER]
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (forms, data) => {
        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            this.flavorList = await getFlavorList(this, { region: data[fields.region] })
            this.privacyPolicyList = await getPrivacyPolicyList(this, { region: data[fields.region] })
            this.autoProvPolicyList = await getAutoProvPolicyList(this, { region: data[fields.region] })
            if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES) {
                this.configOptions = [constant.CONFIG_ENV_VAR]
            }
            let multiFormCount = 0
            if (data[fields.accessPorts]) {
                let portArray = data[fields.accessPorts].split(',')
                for (let i = 0; i < portArray.length; i++) {
                    let portInfo = portArray[i].split(':')
                    let protocol = portInfo[0].toLowerCase();
                    let portMaxNo = portInfo[1];
                    let tls = false
                    if(portInfo.length === 3 && portInfo[2] === 'tls')
                    {
                        tls = true
                    }
                    let portMinNo = undefined

                    let portForms = this.portForm()

                    if (portMaxNo.includes('-')) {
                        portForms = this.multiPortForm()
                        let portNos = portMaxNo.split('-')
                        portMinNo = portNos[0]
                        portMaxNo = portNos[1]
                    }

                    for (let j = 0; j < portForms.length; j++) {
                        let portForm = portForms[j];
                        if (portForm.field === fields.protocol) {
                            portForm.value = protocol
                        }
                        else if (portForm.field === fields.portRangeMax) {
                            portForm.value = portMaxNo
                        }
                        else if (portForm.field === fields.portRangeMin) {
                            portForm.value = portMinNo
                        }
                        else if (portForm.field === fields.tls) {
                            portForm.visible = protocol === 'tcp'
                            portForm.value = tls
                        }
                    }
                    forms.splice(13 + multiFormCount, 0, this.getPortForm(portForms))
                    multiFormCount += 1
                }
            }

            if (data[fields.annotations]) {
                let annotationArray = data[fields.annotations].split(',')
                for (let i = 0; i < annotationArray.length; i++) {
                    let annotation = annotationArray[i].split('=')
                    let annotationForms = this.annotationForm()
                    let key = annotation[0]
                    let value = annotation[1]

                    for (let j = 0; j < annotationForms.length; j++) {
                        let annotationForm = annotationForms[j];
                        if (annotationForm.field === fields.key) {
                            annotationForm.value = key
                        }
                        else if (annotationForm.field === fields.value) {
                            annotationForm.value = value
                        }
                    }
                    forms.splice(14 + multiFormCount, 0, this.getAnnotationForm(annotationForms))
                    multiFormCount += 1
                }
            }
            if (data[fields.configs]) {
                let configs = data[fields.configs]
                for (let i = 0; i < configs.length; i++) {
                    let config = configs[i]
                    let configForms = this.configForm()
                    for (let j = 0; j < configForms.length; j++) {
                        let configForm = configForms[j];
                        if (configForm.field === fields.kind) {
                            configForm.value = config[fields.kind]
                        }
                        else if (configForm.field === fields.config) {
                            configForm.value = config[fields.config]
                        }
                    }
                    forms.splice(15 + multiFormCount, 0, this.getConfigForm(configForms))
                    multiFormCount += 1
                }
            }
        }
    }

    formKeys = () => {
        return [
            { label: 'Create Apps', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: this.isUpdate ? SELECT : MULTI_SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Allows developer to upload app info to different controllers' },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true, tip: 'Organization or Company Name that a Developer is part of' },
            { field: fields.appName, label: 'App Name', formType: INPUT, placeholder: 'Enter App Name', rules: { required: true, onBlur: true }, visible: true, tip: 'App name' },
            { field: fields.version, label: 'App Version', formType: INPUT, placeholder: 'Enter App Version', rules: { required: true, onBlur: true }, visible: true, tip: 'App version' },
            { field: fields.deployment, label: 'Deployment Type', formType: SELECT, placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, tip: 'Deployment type (Kubernetes, Docker, or VM)' },
            { field: fields.accessType, label: 'Access Type', formType: SELECT, placeholder: 'Select Access Type', rules: { required: true }, visible: true },
            { field: fields.imageType, label: 'Image Type', formType: INPUT, placeholder: 'Select Deployment Type', rules: { required: true, disabled: true }, visible: true, tip: 'ImageType specifies image type of an App' },
            { field: fields.imagePath, label: 'Image Path', formType: INPUT, placeholder: 'Enter Image Path', rules: { required: false }, visible: true, update: true, tip: 'URI of where image resides' },
            { field: fields.flavorName, label: 'Default Flavor', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE, placeholder: 'Select Flavor', rules: { required: true, copy:true }, visible: true, update: true, tip: 'FlavorKey uniquely identifies a Flavor.', dependentData: [{ index: 1, field: fields.region }] },
            { uuid: uuid(), field: fields.deploymentManifest, label: 'Deployment Manifest', formType: TEXT_AREA, visible: true, update: true, forms: this.deploymentManifestForm(), tip: 'Deployment manifest is the deployment specific manifest file/config For docker deployment, this can be a docker-compose or docker run file For kubernetes deployment, this can be a kubernetes yaml or helm chart file' },
            { field: fields.refreshAppInst, label: 'Upgrade All App Instances', formType: CHECKBOX, visible: this.isUpdate, value: false, tip: 'Upgrade App Instances running in the cloudlets' },
            { label: 'Ports', formType: 'Header', forms: [{ formType: ICON_BUTTON, label: 'Add Port Mappings', icon: 'add', visible: true, update: true, onClick: this.addMultiForm, multiForm: this.getPortForm }, { formType: ICON_BUTTON, label: 'Add Multiport Mappings', icon: 'add_mult', visible: true, onClick: this.addMultiForm, multiForm: this.getMultiPortForm }], visible: true, tip: 'Comma separated list of protocol:port pairs that the App listens on i.e. TCP:80,UDP:10002,http:443' },
            { label: 'Annotations', formType: 'Header', forms: [{ formType: ICON_BUTTON, label: 'Add Annotations', icon: 'add', visible: true, update: true, onClick: this.addMultiForm, multiForm: this.getAnnotationForm }], visible: false, tip: 'Annotations is a comma separated map of arbitrary key value pairs' },
            { label: 'Configs', formType: 'Header', forms: [{ formType: ICON_BUTTON, label: 'Add Configs', icon: 'add', visible: true, update: true, onClick: this.addMultiForm, multiForm: this.getConfigForm }], visible: false, tip: 'Customization files passed through to implementing services' },
            { label: 'Advanced Settings', formType: 'Header', forms: [{ formType: ICON_BUTTON, label: 'Advance Options', icon: 'expand_less', visible: true, onClick: this.advanceMenu }], visible: true },
            { field: fields.authPublicKey, label: 'Auth Public Key', formType: TEXT_AREA, placeholder: 'Enter Auth Public Key', rules: { required: false }, visible: true, update: true, tip: 'public key used for authentication', advance: false },
            { field: fields.privacyPolicyName, label: 'Default Privacy Policy', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE, placeholder: 'Select Privacy Policy', rules: { required: false }, visible: true, update: true, tip: 'Privacy policy when creating auto cluster', dependentData: [{ index: 1, field: fields.region }], advance: false },
            { field: fields.autoPolicyName, label: 'Auto Provisioning Policy', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE, placeholder: 'Select Auto Provisioning Policy', rules: { required: false }, visible: true, update: true, tip: 'Auto provisioning policy name', dependentData: [{ index: 1, field: fields.region }], advance: false },
            { field: fields.officialFQDN, label: 'Official FQDN', formType: INPUT, placeholder: 'Enter Official FQDN', rules: { required: false }, visible: true, update: true, tip: 'Official FQDN is the FQDN that the app uses to connect by default', advance: false },
            { field: fields.androidPackageName, label: 'Android Package Name', formType: INPUT, placeholder: 'Enter Package Name', rules: { required: false }, visible: true, update: true, tip: 'Android package name used to match the App name from the Android package', advance: false },
            { field: fields.scaleWithCluster, label: 'Scale With Cluster', formType: CHECKBOX, visible: false, value: false, update: true, advance: false, tip: 'Option to run App on all nodes of the cluster' },
            { field: fields.command, label: 'Command', formType: INPUT, placeholder: 'Enter Command', rules: { required: false }, visible: true, update: true, tip: 'Command that the container runs to start service', advance: false },
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.forms && form.formType !== 'Header' && form.formType !== 'MultiForm') {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true)
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        if (data) {
            this.originalData = Object.assign({}, data)
            await this.loadDefaultData(forms, data)
        }
        else {
            this.organizationList = await getOrganizationList(this)
        }

        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })

        this.updateFormData(forms, data)

        this.setState({
            forms: forms
        })

    }

    stepperClose = () => {
        this.setState({
            stepsArray: []
        })
        this.props.onClose(true)
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" >
                    <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                </div>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode(appSteps.stepsCreateApp)
    }

};

const mapStateToProps = (state) => {

    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let _changedRegion = (state.form && state.form.createAppFormDefault && state.form.createAppFormDefault.values) ? state.form.createAppFormDefault.values.Region : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
        changedRegion: _changedRegion
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppReg));
