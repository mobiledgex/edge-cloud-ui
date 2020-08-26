import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, CHECKBOX, ICON_BUTTON, TEXT_AREA, formattedData, MAIN_HEADER, HEADER } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/model/organization';
import { getOrgCloudletList, showOrgCloudlets } from '../../../services/model/cloudlet';
import { getPrivacyPolicyList, showPrivacyPolicies } from '../../../services/model/privacyPolicy';
import { getClusterInstList, showClusterInsts } from '../../../services/model/clusterInstance';
import { getFlavorList, showFlavors } from '../../../services/model/flavor';
import { getAppList } from '../../../services/model/app';
import * as serverData from '../../../services/model/serverData'
import { createAppInst, updateAppInst } from '../../../services/model/appInstance';

import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { appInstTutor } from "../../../tutorial";

import * as appFlow from '../../../hoc/mexFlow/appFlow'
import { Grid } from 'semantic-ui-react';
import { SHOW_ORG_CLOUDLET, SHOW_CLUSTER_INST, SHOW_FLAVOR, SHOW_PRIVACY_POLICY } from '../../../services/model/endPointTypes';
const MexFlow = React.lazy(() => import('../../../hoc/mexFlow/MexFlow'));

const appInstSteps = appInstTutor();

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            stepsArray: [],
            showGraph: false,
            flowDataList: []
        }
        this.isUpdate = this.props.isUpdate
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.requestedRegionList = []
        this.organizationList = []
        this.cloudletList = []
        this.clusterInstList = []
        this.privacyPolicyList = []
        this.flavorList = []
        this.appList = []
        this.updateFlowDataList = []
        //To avoid refecthing data from server
    }

    getCloudletInfo = async (form, forms) => {
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
            this.cloudletList = await getOrgCloudletList(this, { region: region, org: organizationName })
            this.updateUI(form)
            this.setState({ forms: forms })
        }
    }

    getClusterInstInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.clusterInstList = [...this.clusterInstList, ...await getClusterInstList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getAppInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.appList = [...this.appList, ...await getAppList(this, { region: region })]
        }
        this.updateUI(form)
        this.appNameValueChange(form, forms, true)
        this.setState({ forms: forms })
    }

    getFlavorInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.flavorList = [...this.flavorList, ...await getFlavorList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getPrivacyPolicyInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.privacyPolicyList = [...this.privacyPolicyList, ...await getPrivacyPolicyList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (isInit === undefined || isInit === false) {
                    this.setState({ forms: forms })
                }
                break;
            }
        }
    }

    autoClusterValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.clusterName) {
                form.rules.disabled = currentForm.value ? true : false
                form.error = currentForm.value ? undefined : form.error
            }
            else if (form.field === fields.ipAccess) {
                form.visible = currentForm.value
                form.value = currentForm.value ? form.value : undefined
                this.ipAccessValueChange(form, forms, true)
            }
            else if (form.field === fields.sharedVolumeSize) {
                form.visible = currentForm.value ? true : false
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    ipAccessValueChange = (currentForm, forms, isInit, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.privacyPolicyName) {
                form.visible = currentForm.value === constant.IP_ACCESS_DEDICATED ? true : false
                if (data) {
                    form.visible = data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM ? false : form.visible
                }
                form.value = undefined
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    appNameValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.version) {
                this.updateUI(form)
                this.versionValueChange(form, forms, isInit)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    updateIPAccess = (form, data) => {
        if (data) {
            if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
                form.visible = true
                form.rules.disabled = true
                form.value = constant.IP_ACCESS_DEDICATED
                form.options = [constant.IP_ACCESS_DEDICATED]
            }
            else {
                form.options = data[fields.accessType] === constant.ACCESS_TYPE_LOAD_BALANCER ? [constant.IP_ACCESS_DEDICATED, constant.IP_ACCESS_SHARED] : [constant.IP_ACCESS_DEDICATED]
                form.value = undefined
            }
        }
        return form
    }

    versionValueChange = (currentForm, forms, isInit, flowDataList) => {
        //hide cluster and autoCluster if deployment type is vm
        let nForms = []
        let appName = undefined;
        let dependentData = currentForm.dependentData
        for (let i = 0; i < dependentData.length; i++) {
            let form = forms[dependentData[i].index]
            if (form.field === fields.appName) {
                appName = form.value
                break;
            }
        }
        for (let i = 0; i < this.appList.length; i++) {
            let app = this.appList[i]
            if (app[fields.appName] === appName && app[fields.version] === currentForm.value) {
                nForms = forms.filter((form) => {
                    if (form.field === fields.autoClusterInstance) {
                        form.visible = app[fields.deployment] === constant.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = false
                        this.autoClusterValueChange(form, forms, isInit)
                        return form
                    }
                    else if (form.field === fields.ipAccess) {
                        return this.updateIPAccess(form, app)
                    }
                    else if (form.field === fields.clusterName) {
                        form.visible = app[fields.deployment] === constant.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = undefined
                        return form
                    }
                    else if (form.label === 'Configs') {
                        form.visible = app[fields.deployment] === constant.DEPLOYMENT_TYPE_HELM || app[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES ? true : false
                        return form
                    }
                    else if (form.field === fields.configs) {
                        if (app[fields.deployment] === constant.DEPLOYMENT_TYPE_HELM || app[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES) {
                            return form
                        }
                    }
                    else {
                        return form
                    }
                })
                flowDataList.push(appFlow.ipAccessFlowApp(app))
                flowDataList.push(appFlow.deploymentTypeFlow(app, constant.APP))
                if (app[fields.accessPorts]) {
                    flowDataList.push(appFlow.portFlow(app[fields.accessPorts].includes('tls') ? 1 : 0))
                }
                break;
            }
            else {
                nForms = forms.filter((form) => {
                    if (form.field === fields.autoClusterInstance) {
                        form.visible = false
                        form.value = false
                        this.autoClusterValueChange(form, forms, true)
                        return form
                    }
                    else if (form.field === fields.clusterName || form.label === 'Configs') {
                        form.visible = false
                        form.value = undefined
                        return form
                    }
                    else if (form.field === fields.configs) {
                        //remove all configs
                    }
                    else {
                        return form
                    }
                })
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: nForms })
        }
    }


    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.clusterName) {
                if (isInit === undefined || isInit === false) {
                    this.getClusterInstInfo(region, form, forms)
                }
            }
            else if (form.field === fields.flavorName) {
                if (isInit === undefined || isInit === false) {
                    this.getFlavorInfo(region, form, forms)
                }
            }
            else if (form.field === fields.appName) {
                if (isInit === undefined || isInit === false) {
                    this.getAppInfo(region, form, forms)
                }
            }
            else if (form.field === fields.privacyPolicyName) {
                if (isInit === undefined || isInit === false) {
                    this.getPrivacyPolicyInfo(region, form, forms)
                }
            }
        }
        this.requestedRegionList.push(region)
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.appName) {
                this.updateUI(form)
                this.appNameValueChange(form, forms, true)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    cloudletValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.clusterName) {
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    /**config blog */

    removeConfigForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.setState({
                forms: updateForms
            })
        }

    }

    configForm = () => ([
        { field: fields.config, label: 'Config', formType: TEXT_AREA, rules: { required: true, type: 'number', rows: 2 }, width: 9, visible: true, update: true },
        { field: fields.kind, label: 'Kind', formType: SELECT, rules: { required: true }, width: 4, visible: true, options: ['envVarsYaml', 'helmCustomizationYaml'], update: true },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeConfigForm }
    ])

    getConfigForm = (form) => (
        { uuid: uuid(), field: fields.configs, formType: 'MultiForm', forms: form, width: 3, visible: true }
    )

    addConfigs = () => {
        this.setState(prevState => ({ forms: [...prevState.forms, this.getConfigForm(this.configForm())] }))
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} App Instances`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true, tip: 'Organization or Company Name that a Developer is part of' },
            { field: fields.appName, label: 'App', formType: SELECT, placeholder: 'Select App', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }] },
            { field: fields.version, label: 'App Version', formType: SELECT, placeholder: 'Select App Version', rules: { required: true }, visible: true, dependentData: [{ index: 3, field: fields.appName }] },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.cloudletName, label: 'Cloudlet', formType: MULTI_SELECT, placeholder: 'Select Cloudlets', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 5, field: fields.operatorName }] },
            { field: fields.flavorName, label: 'Flavor', formType: SELECT, placeholder: 'Select Flavor', rules: { required: false }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.autoClusterInstance, label: 'Auto Cluster Instance', formType: CHECKBOX, visible: false, value: false },
            { field: fields.ipAccess, label: 'IP Access', formType: SELECT, placeholder: 'Select IP Access', rules: { required: false }, visible: false },
            { field: fields.sharedVolumeSize, label: 'Shared Volume Size', formType: 'Input', placeholder: 'Enter Shared Volume Size', unit: 'GB', rules: { type: 'number' }, visible: false },
            { field: fields.privacyPolicyName, label: 'Privacy Policy', formType: SELECT, placeholder: 'Select Privacy Policy', rules: { required: false }, visible: false, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }] },
            { field: fields.clusterName, label: 'Cluster', formType: SELECT, placeholder: 'Select Clusters', rules: { required: true }, visible: false, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }, { index: 5, field: fields.operatorName }, { index: 6, field: fields.cloudletName }] },
            { label: 'Configs', formType: HEADER, forms: [{ formType: ICON_BUTTON, icon: 'add', visible: true, update: true, onClick: this.addConfigs, style: { color: 'white' } }], visible: false }
        ]
    }

    checkForms = (form, forms, isInit, data) => {
        let flowDataList = []
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === fields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === fields.autoClusterInstance) {
            this.autoClusterValueChange(form, forms, isInit)
        }
        else if (form.field === fields.appName) {
            this.appNameValueChange(form, forms, isInit)
        }
        else if (form.field === fields.version) {
            this.versionValueChange(form, forms, isInit, flowDataList)
        }
        else if (form.field === fields.ipAccess) {
            this.ipAccessValueChange(form, forms, isInit, data)
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(appFlow.clusterFlow(finalData))
        }
        if (flowDataList.length > 0) {
            if (isInit) {
                this.updateFlowDataList = [...this.updateFlowDataList, ...flowDataList]
            }
            else {
                this.setState({ showGraph: true, flowDataList: flowDataList })
            }
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = (mcRequest) => {
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            let request = mcRequest.request;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let labels = [{ label: 'Cloudlet', field: fields.cloudletName }]
            this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms;
            let configs = []
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        configs.push(multiFormData)
                    }
                    data[uuid] = undefined
                }
            }
            if (configs.length > 0) {
                data[fields.configs] = configs
            }

            let cloudlets = data[fields.cloudletName];
            if (data[fields.clusterName] || data[fields.autoClusterInstance]) {
                data[fields.clusterName] = data[fields.autoClusterInstance] ? 'autocluster' + data[fields.appName].toLowerCase().replace(/ /g, "") : data[fields.clusterName]
            }
            if (this.props.isUpdate) {
                this.props.handleLoadingSpinner(true)
                data[fields.clusterdeveloper] = this.clusterInstList[0][fields.clusterdeveloper]
                updateAppInst(this, data, this.onCreateResponse)
            }
            else if (cloudlets && cloudlets.length > 0) {
                for (let i = 0; i < cloudlets.length; i++) {
                    let cloudlet = cloudlets[i];
                    data[fields.cloudletName] = cloudlet;
                    this.props.handleLoadingSpinner(true)
                    createAppInst(this, Object.assign({}, data), this.onCreateResponse)
                }
            }
        }
    }

    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    stepperClose = () => {
        this.setState({
            stepsArray: []
        })
        this.props.onClose(true)
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

    updateUI(form, data) {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case fields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case fields.flavorName:
                            form.options = this.flavorList
                            break;
                        case fields.clusterName:
                            form.options = this.clusterInstList
                            break;
                        case fields.appName:
                            form.options = this.appList
                            break;
                        case fields.privacyPolicyName:
                            form.options = this.privacyPolicyList
                            break;
                        case fields.version:
                            form.options = this.appList
                            break;
                        case fields.ipAccess:
                            form = this.updateIPAccess(form, data)
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                else if (form.formType === CHECKBOX) {
                    switch (form.field) {
                        case fields.autoClusterInstance:
                            form.visible = (this.isUpdate && form.visible) ? false : form.visible
                    }
                }
            }
        }
    }

    loadDefaultData = async (forms, data) => {
        if (data) {
            let requestTypeList = []
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            if (this.props.isLaunch) {
                requestTypeList.push(showOrgCloudlets({ region: data[fields.region], org: data[fields.organizationName] }))
                requestTypeList.push(showClusterInsts({ region: data[fields.region] }))
                requestTypeList.push(showFlavors({ region: data[fields.region] }))
                let disabledFields = [fields.region, fields.organizationName, fields.appName, fields.version]

                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i];
                    if (disabledFields.includes(form.field)) {
                        form.rules.disabled = true;
                    }
                }
            }
            else {
                let cloudlet = {}
                cloudlet[fields.region] = data[fields.region]
                cloudlet[fields.cloudletName] = data[fields.cloudletName]
                cloudlet[fields.operatorName] = data[fields.operatorName]
                this.cloudletList.push(cloudlet)

                let clusterInst = {}
                clusterInst[fields.region] = data[fields.region]
                clusterInst[fields.organizationName] = data[fields.organizationName]
                clusterInst[fields.clusterName] = data[fields.clusterName]
                clusterInst[fields.cloudletName] = data[fields.cloudletName]
                clusterInst[fields.operatorName] = data[fields.operatorName]
                clusterInst[fields.clusterdeveloper] = data[fields.clusterdeveloper]
                this.clusterInstList.push(clusterInst)

                let flavor = {}
                flavor[fields.region] = data[fields.region]
                flavor[fields.flavorName] = data[fields.flavorName]
                this.flavorList.push(flavor)

                let multiFormCount = 0
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
                        forms.splice(12 + multiFormCount, 0, this.getConfigForm(configForms))
                        multiFormCount += 1
                    }
                }
            }

            let app = {}
            app[fields.appName] = data[fields.appName]
            app[fields.region] = data[fields.region]
            app[fields.organizationName] = data[fields.organizationName]
            app[fields.version] = data[fields.version]
            app[fields.deployment] = data[fields.deployment]
            app[fields.accessType] = data[fields.accessType]
            this.appList = [app];

            requestTypeList.push(showPrivacyPolicies({ region: data[fields.region] }))

            let mcRequestList = await serverData.showSyncMultiData(this, requestTypeList)
            if (mcRequestList && mcRequestList.length > 0) {
                for (let i = 0; i < mcRequestList.length; i++) {
                    let mcRequest = mcRequestList[i];
                    let request = mcRequest.request;
                    if (request.method === SHOW_ORG_CLOUDLET) {
                        this.cloudletList = mcRequest.response.data
                    }
                    else if (request.method === SHOW_CLUSTER_INST) {
                        this.clusterInstList = mcRequest.response.data
                    }
                    else if (request.method === SHOW_FLAVOR) {
                        this.flavorList = mcRequest.response.data
                    }
                    else if (request.method === SHOW_PRIVACY_POLICY) {
                        this.privacyPolicyList = mcRequest.response.data
                    }
                }
            }
        }
    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        if (data) {
            await this.loadDefaultData(forms, data)
        }
        else {
            this.organizationList = await getOrganizationList(this)
        }

        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })


        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            form.tip = constant.getTip(form.field)
            this.updateUI(form, data)
            if (data) {
                form.value = data[form.field] ? data[form.field] : form.value
                this.checkForms(form, forms, true, data)
            }
        }

        this.setState({
            forms: forms
        })

        if (this.isUpdate || this.props.isLaunch) {
            this.setState({
                showGraph: true,
                flowDataList: this.updateFlowDataList
            })
        }
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
                <Grid style={{ display: 'flex' }}>
                    <Grid.Row>
                        <Grid.Column width={this.state.showGraph ? 8 : 16} style={{ overflow: 'auto', height: '90vh' }}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid.Column>
                        {this.state.showGraph ? <Grid.Column width={8} style={{ borderRadius: 5, backgroundColor: 'transparent' }}>
                            <Suspense fallback={<div></div>}>
                                <MexFlow flowDataList={this.state.flowDataList} flowObject={appFlow} />
                            </Suspense>
                        </Grid.Column> : null}
                    </Grid.Row>
                </Grid>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div >
        )
    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode(appInstSteps.stepsCreateAppInst)
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(ClusterInstReg));