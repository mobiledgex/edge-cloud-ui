import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, SWITCH, ICON_BUTTON, TEXT_AREA, MAIN_HEADER, HEADER, SELECT_RADIO_TREE_GROUP } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { redux_org} from '../../../helper/reduxData'
//model
import { getOrganizationList } from '../../../services/modules/organization';
import { cloudletWithInfo } from '../../../services/modules/cloudlet';
import { sendRequests } from '../../../services/model/serverWorker'
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import { getClusterInstList, showClusterInsts } from '../../../services/modules/clusterInst';
import { fetchCloudletFlavors } from '../../../services/modules/flavor/flavor';
import { showAppCloudlets, getAppList } from '../../../services/modules/app';
import { createAppInst, updateAppInst } from '../../../services/modules/appInst';

import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { HELP_APP_INST_REG } from "../../../tutorial";

import * as appFlow from '../../../hoc/mexFlow/appFlow'
import { Grid } from '@material-ui/core';
import { endpoint, perpetual } from '../../../helper/constant';
import { service, updateFieldData } from '../../../services';
import { componentLoader } from '../../../hoc/loader/componentLoader';
import cloneDeep from 'lodash/cloneDeep';

const MexFlow = React.lazy(() => componentLoader(import('../../../hoc/mexFlow/MexFlow')));

class AppInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            stepsArray: [],
            showGraph: false,
            flowDataList: []
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.requestedRegionList = []
        this.organizationList = []
        this.cloudletList = []
        this.clusterInstList = []
        this.flavorOrgList = {}
        this.flavorList = {}
        this.appList = []
        this.updateFlowDataList = []
        this.configOptions = [perpetual.CONFIG_ENV_VAR, perpetual.CONFIG_HELM_CUST]
        //To avoid refecthing data from server
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getCloudletInfo = async (app, form, forms) => {
        let region = undefined;
        let organizationName = undefined;
        let appName = undefined;
        let version = undefined;
        for (let i = 0; i < forms.length; i++) {
            let tempForm = forms[i]
            if (tempForm.field === fields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === fields.organizationName) {
                organizationName = tempForm.value
            }
            else if (tempForm.field === fields.appName) {
                appName = tempForm.value
            }
            else if (tempForm.field === fields.version) {
                version = tempForm.value
            }
        }
        if (region && organizationName && appName && version) {
            let requestList = []
            requestList.push(showAppCloudlets(this, app))
            requestList.push(showCloudletInfoData(this, { region: region, org: organizationName, type: perpetual.DEVELOPER }))
            this.props.handleLoadingSpinner(true)
            sendRequests(this, requestList).addEventListener('message', event => {
                let mcList = event.data
                this.cloudletList = cloudletWithInfo(mcList)
                this.props.handleLoadingSpinner(false)
                this.updateUI(form)
                this.updateState({ forms })
            })
        }
    }

    getClusterInstInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.clusterInstList = [...this.clusterInstList, ...await getClusterInstList(this, { region: region })]
        }
        this.updateUI(form)
        this.updateState({ forms })
    }

    getAppInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.appList = [...this.appList, ...await getAppList(this, { region: region })]
        }
        this.updateUI(form)
        this.appNameValueChange(form, forms, true)
        this.updateState({ forms })
    }

    getFlavorInfo = async (form, forms) => {
        let region = undefined
        let cloudletList = undefined
        let operatorName = undefined
        for (const form of forms) {
            if (form.field === fields.region) {
                region = form.value
            }
            else if (form.field === fields.cloudletName) {
                cloudletList = form.value
            }
            else if (form.field === fields.operatorName) {
                operatorName = form.value
            }
        }
        this.flavorList = {}
        if (region && operatorName && cloudletList) {
            await Promise.all(cloudletList.map(async (cloudletName) => {
                let key = `${region}>${operatorName}>${cloudletName}`
                if (this.flavorOrgList[key] === undefined) {
                    let flavorList = await fetchCloudletFlavors(this, { region, cloudletName, operatorName })
                    if (flavorList && flavorList.length > 0) {
                        this.flavorOrgList[key] = flavorList
                    }
                }
                if( this.flavorOrgList[key])
                {
                    this.flavorList[key] = this.flavorOrgList[key]
                }
            }))
            this.updateUI(form)
            this.updateState({ forms })
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (isInit === undefined || isInit === false) {
                    this.updateState({ forms })
                }
            }
            else if (form.field === fields.flavorName) {
                if (isInit === undefined || isInit === false) {
                    this.flavorList = {}
                    this.updateUI(form)
                }
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
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
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
            this.updateState({ forms })
        }
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
                        form.visible = app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = false
                        this.autoClusterValueChange(form, forms, isInit)
                        return form
                    }
                    else if (form.field === fields.clusterName) {
                        form.visible = app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = undefined
                        return form
                    }
                    else if (form.field === fields.configs) {
                        form.visible = app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM || app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES
                        this.configOptions = app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? [perpetual.CONFIG_ENV_VAR] : [perpetual.CONFIG_HELM_CUST]
                        return form
                    }
                    else if (form.field === fields.configmulti) {
                        if (app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM || app[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES) {
                            return form
                        }
                    }
                    else if (form.field === fields.operatorName) {
                        if (isInit === undefined || isInit === false) {
                            this.getCloudletInfo(app, form, forms)
                        }
                        return form
                    }
                    else {
                        return form
                    }
                })
                flowDataList.push(appFlow.ipAccessFlowApp(app))
                flowDataList.push(appFlow.deploymentTypeFlow(app, perpetual.PAGE_APPS))
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
                    else if (form.field === fields.clusterName || form.field === fields.configs) {
                        form.visible = false
                        form.value = undefined
                        return form
                    }
                    else if (form.field === fields.configmulti) {
                        //remove all configs
                    }
                    else {
                        return form
                    }
                })
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ nForms })
        }
    }


    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        if (region) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                }
                else if (form.field === fields.clusterName) {
                    if (isInit === undefined || isInit === false) {
                        this.getClusterInstInfo(region, form, forms)
                    }
                }
                else if (form.field === fields.appName) {
                    if (isInit === undefined || isInit === false) {
                        this.getAppInfo(region, form, forms)
                    }
                }
            }
            this.requestedRegionList.push(region)
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
            }
            else if (form.field === fields.appName) {
                this.updateUI(form)
                this.appNameValueChange(form, forms, true)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    cloudletValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.clusterName) {
                this.updateUI(form)
            }
        }
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.flavorName) {
                if (isInit === undefined || isInit === false) {
                    this.getFlavorInfo(form, forms)
                }
                break;
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    /**config blog */

    removeConfigForm = (e, form) => {
        if (form.parent) {
            let forms = cloneDeep(this.state.forms)
            forms.splice(form.parent.id, 1);
            this.updateState({ forms })
        }
    }

    configForm = () => ([
        { field: fields.config, label: 'Config', formType: TEXT_AREA, rules: { required: true, type: 'number', rows: 2 }, width: 9, visible: true, update: { edit: true } },
        { field: fields.kind, label: 'Kind', formType: SELECT, placeholder: 'Select Kind', rules: { required: true }, width: 4, visible: true, options: this.configOptions, update: { edit: true } },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeConfigForm }
    ])

    getConfigForm = (form) => (
        { uuid: uuid(), field: fields.configmulti, formType: 'MultiForm', forms: form, width: 3, visible: true }
    )

    addConfigs = () => {
        if (this._isMounted) {
            this.setState(prevState => ({ forms: [...prevState.forms, this.getConfigForm(this.configForm())] }))
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} App Instances`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this) ? false : true, disabled: !redux_org.isAdmin(this) ? true : false }, value: redux_org.nonAdminOrg(this), visible: true, tip: 'Organization or Company Name that a Developer is part of', update: { key: true } },
            { field: fields.appName, label: 'App', formType: SELECT, placeholder: 'Select App', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }], update: { key: true } },
            { field: fields.version, label: 'App Version', formType: SELECT, placeholder: 'Select App Version', rules: { required: true }, visible: true, dependentData: [{ index: 3, field: fields.appName }], update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], update: { key: true } },
            { field: fields.cloudletName, label: 'Cloudlet', formType: MULTI_SELECT, placeholder: 'Select Cloudlets', rules: { required: true }, visible: true, dependentData: [{ index: 5, field: fields.operatorName }], update: { key: true } },
            { field: fields.flavorName, label: 'Flavor', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE_GROUP, placeholder: 'Select Flavor', rules: { required: false, copy: true }, visible: true, tip: 'FlavorKey uniquely identifies a Flavor' },
            { field: fields.autoClusterInstance, label: 'Auto Cluster Instance', formType: SWITCH, visible: false, value: false, update: { edit: true } },
            { field: fields.clusterName, label: 'Cluster', formType: SELECT, placeholder: 'Select Clusters', rules: { required: true }, visible: false, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }, { index: 5, field: fields.operatorName }, { index: 6, field: fields.cloudletName }], update: { key: true } },
            { field: fields.configs, label: 'Configs', formType: HEADER, forms: [{ formType: ICON_BUTTON, icon: 'add', visible: true, onClick: this.addConfigs, style: { color: 'white' } }], visible: false, update: { id: ['27', '27.1', '27.2'] } },
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
        if (flowDataList.length > 0) {
            if (isInit) {
                this.updateFlowDataList = [...this.updateFlowDataList, ...flowDataList]
            }
            else {
                this.updateState({ showGraph: true, flowDataList: flowDataList })
            }
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = (mc) => {
        this.props.handleLoadingSpinner(false)
        if (mc) {
            let responseData = undefined;
            let request = mc.request;
            if (mc.response && mc.response.data) {
                responseData = mc.response.data;
            }
            let labels = [{ label: 'Cloudlet', field: fields.cloudletName }]
            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    fetchCompabilityVersion = (data, tempCloudlet) => {
        let version = perpetual.CLOUDLET_COMPAT_VERSION_2_4
        for (let i = 0; i < this.cloudletList.length; i++) {
            let cloudlet = this.cloudletList[i]
            if (tempCloudlet === cloudlet[fields.cloudletName] && data[fields.operatorName] === cloudlet[fields.operatorName] && data[fields.region] === cloudlet[fields.region]) {
                version = cloudlet[fields.compatibilityVersion]
                break;
            }
        }
        return version
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
            let flavors = data[fields.flavorName];
            if (data[fields.clusterName] || data[fields.autoClusterInstance]) {
                data[fields.clusterName] = data[fields.autoClusterInstance] ? 'autocluster' + data[fields.appName].toLowerCase().replace(/ /g, "") : data[fields.clusterName]
            }
            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateData[fields.clusterdeveloper] = this.clusterInstList[0][fields.clusterdeveloper]
                    updateAppInst(this, updateData, this.onCreateResponse)
                }
            }
            else if (cloudlets && cloudlets.length > 0) {
                if (cloudlets && cloudlets.length > 0) {
                    for (let i = 0; i < cloudlets.length; i++) {
                        let newData = cloneDeep(data)
                        let cloudlet = cloudlets[i];
                        newData[fields.cloudletName] = cloudlet;
                        newData[fields.compatibilityVersion] = this.fetchCompabilityVersion(data, cloudlet)
                        if (flavors) {
                            newData[fields.flavorName] = flavors[`${data[fields.region]}>${data[fields.operatorName]}>${cloudlet}`]
                        }
                        this.props.handleLoadingSpinner(true)
                        createAppInst(this, newData, this.onCreateResponse)
                    }

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

    stepperClose = () => {
        this.updateState({
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT || form.formType === SELECT_RADIO_TREE_GROUP) {
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
                        case fields.version:
                            form.options = this.appList
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                else if (form.formType === SWITCH) {
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
            let requestList = []
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            if (this.props.isLaunch) {
                let requestData = { region: data[fields.region], org: data[fields.organizationName], type: perpetual.DEVELOPER }
                requestList.push(showAppCloudlets(this, data))
                requestList.push(showCloudletInfoData(this, requestData))
                requestList.push(showClusterInsts(this, requestData))
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
                cloudlet[fields.compatibilityVersion] = data[fields.compatibilityVersion]
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
                this.flavorList = [flavor]

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
                        forms.splice(14 + multiFormCount, 0, this.getConfigForm(configForms))
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
            app[fields.trusted] = data[fields.trusted]
            this.appList = [app];

            if (requestList.length > 0) {
                let mcList = await service.multiAuthSyncRequest(this, requestList)
                this.cloudletList = cloudletWithInfo(mcList)
                if (mcList && mcList.length > 0) {
                    for (let mc of mcList) {
                        let request = mc.request;
                        if (request.method === endpoint.SHOW_CLUSTER_INST) {
                            this.clusterInstList = mc.response.data
                        }
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
            this.organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
        }

        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })


            
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            form.tip = constant.getTip(form.field)
            this.updateUI(form, data)
            if (data) {
                if(!this.isUpdate && form.field === fields.flavorName)
                {
                    continue;
                }
                form.value = data[form.field] ? data[form.field] : form.value
                this.checkForms(form, forms, true, data)
            }
        }
        this.updateState({ forms })

        if (this.isUpdate || this.props.isLaunch) {
            this.updateState({
                showGraph: true,
                flowDataList: this.updateFlowDataList
            })
        }
    }

    stepperClose = () => {
        this.updateState({
            stepsArray: []
        })
        this.props.onClose(true)
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={this.state.showGraph ? 6 : 12}>
                        <div className="round_panel">
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                    {this.state.showGraph ?
                        <Grid item xs={6} >
                            <Suspense fallback={<div></div>}>
                                <MexFlow flowDataList={this.state.flowDataList} flowObject={appFlow} />
                            </Suspense>
                        </Grid> : null}
                </Grid>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div >
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_APP_INST_REG)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstReg));