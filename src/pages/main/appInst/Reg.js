import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, SWITCH, ICON_BUTTON, TEXT_AREA, MAIN_HEADER, HEADER, SELECT_RADIO_TREE_GROUP, MULTI_FORM, INPUT, findIndexs } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { localFields } from '../../../services/fields';
import { redux_org } from '../../../helper/reduxData'
//model
import { getOrganizationList } from '../../../services/modules/organization';
import { cloudletWithInfo, fetchCloudletField, showCloudlets } from '../../../services/modules/cloudlet';
import { sendRequests } from '../../../services/worker/serverWorker'
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import { getClusterInstList, showClusterInsts } from '../../../services/modules/clusterInst';
import { fetchCloudletFlavors } from '../../../services/modules/flavor/flavor';
import { getAppList } from '../../../services/modules/app';
import { createAppInst, updateAppInst } from '../../../services/modules/appInst';

import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/MexMessageMultiStream'
import { HELP_APP_INST_REG } from "../../../tutorial";

import * as appFlow from '../../../hoc/mexFlow/appFlow'
import { Grid } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { endpoint, service, updateFieldData } from '../../../services';
import { componentLoader } from '../../../hoc/loader/componentLoader';
import cloneDeep from 'lodash/cloneDeep';
import { uniqueId } from '../../../helper/constant/shared';

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

    getCloudletInfo = async (form, forms) => {
        let region = undefined;
        let organizationName = undefined;
        for (let i = 0; i < forms.length; i++) {
            let tempForm = forms[i]
            if (tempForm.field === localFields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === localFields.organizationName) {
                organizationName = tempForm.value
            }
        }
        if (region && organizationName) {
            let requestList = []
            let requestData = { region: region, org: organizationName, type: perpetual.DEVELOPER }
            requestList.push(showCloudlets(this, requestData))
            requestList.push(showCloudletInfoData(this, requestData))
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
            if (form.field === localFields.region) {
                region = form.value
            }
            else if (form.field === localFields.cloudletName) {
                cloudletList = form.value
            }
            else if (form.field === localFields.operatorName) {
                operatorName = form.value
            }
        }
        this.flavorList = {}
        if (region && operatorName && cloudletList) {
            await Promise.all(cloudletList.map(async (cloudletName) => {
                let key = `${region}>${operatorName}>${cloudletName}`
                if (this.flavorOrgList[key] === undefined) {
                    let flavorList = await fetchCloudletFlavors(this, { region: region, cloudletName, operatorName, partnerOperator: fetchCloudletField(this.cloudletList, { operatorName, cloudletName }, localFields.partnerOperator) })
                    if (flavorList && flavorList.length > 0) {
                        this.flavorOrgList[key] = flavorList
                    }
                }
                if (this.flavorOrgList[key]) {
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
            if (form.field === localFields.cloudletName) {
                this.updateUI(form)
                if (!isInit) {
                    this.updateState({ forms })
                }
            }
            else if (form.field === localFields.flavorName) {
                if (!isInit) {
                    this.flavorList = {}
                    this.updateUI(form)
                }
            }
        }
    }

    autoClusterValueChange = (currentForm, forms, isInit) => {
        let isAuto = Boolean(currentForm.value)
        let appName = ''
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.appName) {
                appName = form.value
            }
            else if (form.field === localFields.clusterName) {
                if (!isInit) {
                    form.visible = !isAuto
                    form.error = isAuto ? undefined : form.error
                }
            }
            else if (form.field === localFields.autoClusterNameGroup) {
                form.visible = isAuto
                for (let childForm of form.forms) {
                    if (childForm.field === localFields.autoClusterName) {
                        childForm.value = undefined
                        childForm.value = isAuto && appName ? appName.toLowerCase().replace(/[ _]/g, "") : undefined
                        break;
                    }
                }
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }


    appNameValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.version) {
                this.updateUI(form)
                this.versionValueChange(form, forms, isInit)
            }
        }
        if (!isInit) {
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
            if (form.field === localFields.appName) {
                appName = form.value
                break;
            }
        }
        for (let i = 0; i < this.appList.length; i++) {
            let app = this.appList[i]
            if (app[localFields.appName] === appName && app[localFields.version] === currentForm.value) {
                nForms = forms.filter((form) => {
                    if (form.field === localFields.autoClusterInstance) {
                        form.visible = app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = false
                        this.autoClusterValueChange(form, forms, isInit)
                        return form
                    }
                    else if (form.field === localFields.clusterName) {
                        form.visible = app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? false : true
                        form.value = undefined
                        return form
                    }
                    else if (form.field === localFields.configs) {
                        form.visible = app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM || app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES
                        this.configOptions = app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? [perpetual.CONFIG_ENV_VAR] : [perpetual.CONFIG_HELM_CUST]
                        return form
                    }
                    else if (form.field === localFields.configmulti) {
                        if (app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM || app[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES) {
                            return form
                        }
                    }
                    else if (form.field === localFields.operatorName) {
                        if (!app[localFields.trusted]) {
                            this.cloudletList = this.cloudletList.filter(cloudlet => {
                                return cloudlet[localFields.trustPolicyName] === undefined
                            })
                            this.updateUI(form)
                        }
                        return form
                    }
                    else {
                        return form
                    }
                })
                flowDataList.push(appFlow.ipAccessFlowApp(app))
                flowDataList.push(appFlow.deploymentTypeFlow(app, perpetual.PAGE_APPS))
                if (app[localFields.accessPorts]) {
                    flowDataList.push(appFlow.portFlow(app[localFields.accessPorts].includes('tls') ? 1 : 0))
                }
                break;
            }
            else {
                nForms = forms.filter((form) => {
                    if (form.field === localFields.autoClusterInstance) {
                        form.visible = false
                        form.value = false
                        this.autoClusterValueChange(form, forms, true)
                        return form
                    }
                    else if (form.field === localFields.clusterName || form.field === localFields.configs) {
                        form.visible = false
                        form.value = undefined
                        return form
                    }
                    else if (form.field === localFields.configmulti) {
                        //remove all configs
                    }
                    else {
                        return form
                    }
                })
            }
        }
        if (!isInit) {
            this.updateState({ forms: nForms })
        }
    }


    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        if (region) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === localFields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                    if (!isInit) {
                        this.getCloudletInfo(form, forms)
                    }
                }
                else if (form.field === localFields.clusterName) {
                    if (!isInit) {
                        this.getClusterInstInfo(region, form, forms)
                    }
                }
                else if (form.field === localFields.appName) {
                    if (!isInit) {
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
            if (form.field === localFields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (!isInit) {
                    this.getCloudletInfo(form, forms)
                }
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

    cloudletValueChange = (currentForm, forms, isInit) => {
        let operator = undefined
        for(const form of forms)
        {
            if (form.field === localFields.operatorName) {
                operator = form.value
                break;
            } 
        }
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.dedicatedIp) {
                let values = Array.isArray(currentForm.value) ? currentForm.value : [currentForm.value]
                let valid = values && values.some(cloudletName=>{
                    return fetchCloudletField(this.cloudletList, { operatorName: operator, cloudletName }, localFields.platformType) === perpetual.PLATFORM_TYPE_K8S_BARE_METAL
                })
                form.visible = valid
            }
            if (form.field === localFields.clusterName) {
                this.updateUI(form)
            }
        }
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.flavorName) {
                if (!isInit) {
                    this.getFlavorInfo(form, forms)
                }
                break;
            }
        }
        if (!isInit) {
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
        { field: localFields.config, label: 'Config', formType: TEXT_AREA, rules: { required: true, type: 'number', rows: 2 }, width: 9, visible: true, update: { edit: true } },
        { field: localFields.kind, label: 'Kind', formType: SELECT, placeholder: 'Select Kind', rules: { required: true }, width: 5, visible: true, options: this.configOptions, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeConfigForm }
    ])

    getConfigForm = (form) => (
        { uuid: uniqueId(), field: localFields.configmulti, formType: MULTI_FORM, forms: form, width: 3, visible: true }
    )

    addConfigs = () => {
        if (this._isMounted) {
            this.setState(prevState => ({ forms: [...prevState.forms, this.getConfigForm(this.configForm())] }))
        }
    }

    autoClusterNameForm = () => ([
        { field: perpetual.AUTOCLUSTER, formType: INPUT, rules: { disabled: true}, width: 7, visible: true, value:perpetual.AUTOCLUSTER },
        { icon: 'add', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white'}, width: 2},
        { field: localFields.autoClusterName, formType: INPUT, rules: { required: true }, visible: true, width: 7 },
    ])

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} App Instances`, formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true }, tip:'Select region where you want to deploy.' },
            { field: localFields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this) ? false : true, disabled: !redux_org.isAdmin(this) ? true : false }, value: redux_org.nonAdminOrg(this), visible: true, tip: 'The name of the organization you are currently managing.', update: { key: true } },
            { field: localFields.appName, label: 'App', formType: SELECT, placeholder: 'Select App', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }, { index: 2, field: localFields.organizationName }], update: { key: true }, tip:'The name of the application to deploy.' },
            { field: localFields.version, label: 'App Version', formType: SELECT, placeholder: 'Select App Version', rules: { required: true }, visible: true, dependentData: [{ index: 3, field: localFields.appName }], update: { key: true }, tip:'The version of the application to deploy.' },
            { field: localFields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }], update: { key: true }, tip:'Which operator do you want to deploy this applicaton? Please select one.' },
            { field: localFields.partnerOperator, label: 'Partner Operator', formType: INPUT, visible: false, update: { key: true }},
            { field: localFields.cloudletName, label: 'Cloudlet', formType: MULTI_SELECT, placeholder: 'Select Cloudlets', rules: { required: true }, visible: true, dependentData: [{ index: 5, field: localFields.operatorName }], update: { key: true }, tip:'Which cloudlet(s) do you want to deploy this application ?' },
            { field: localFields.flavorName, label: 'Flavor', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE_GROUP, placeholder: 'Select Flavor', rules: { required: false, copy: true }, visible: true, tip: 'FlavorKey uniquely identifies a Flavor' },
            { field: localFields.dedicatedIp, label: 'Dedicated IP', formType: SWITCH, visible: false, value: false, update: { id: ['39'] }, tip: 'Dedicated IP assigns an IP for this AppInst but requires platform support (platform type -  k8s Bare Metal)' },
            { field: localFields.autoClusterInstance, label: 'Auto Cluster Instance', formType: SWITCH, visible: false, value: false, update: { edit: true }, tip:'If you have yet to create a cluster, you can select this to auto create cluster instance.' },
            { uuid: uniqueId(), field: localFields.autoClusterNameGroup, label: 'Auto Cluster Name', formType: INPUT, rules: { required: true }, visible: false, forms: this.autoClusterNameForm(), tip: 'Auto cluster name, the default value is string `autocluster` appended with app name, must not have spaces or underscore' },
            { field: localFields.clusterName, label: 'Cluster', formType: SELECT, placeholder: 'Select Clusters', rules: { required: true }, visible: false, dependentData: [{ index: 1, field: localFields.region }, { index: 2, field: localFields.organizationName }, { index: 5, field: localFields.operatorName }, { index: 7, field: localFields.cloudletName }], update: { key: true }, tip: 'Name of cluster instance to deploy this application.' },
            { field: localFields.configs, label: 'Configs', formType: HEADER, forms: [{ formType: ICON_BUTTON, icon: 'add', visible: true, onClick: this.addConfigs, style: { color: 'white' } }], visible: false, update: { id: ['27', '27.1', '27.2'] } },
        ]
    }

    checkForms = (form, forms, isInit = false, data) => {
        let flowDataList = []
        if (form.field === localFields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.autoClusterInstance) {
            this.autoClusterValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.appName) {
            this.appNameValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.version) {
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
            let labels = [{ label: 'Cloudlet', field: localFields.cloudletName }]
            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    fetchCompabilityVersion = (data, tempCloudlet) => {
        let version = perpetual.CLOUDLET_COMPAT_VERSION_2_4
        for (let i = 0; i < this.cloudletList.length; i++) {
            let cloudlet = this.cloudletList[i]
            if (tempCloudlet === cloudlet[localFields.cloudletName] && data[localFields.operatorName] === cloudlet[localFields.operatorName] && data[localFields.region] === cloudlet[localFields.region]) {
                version = cloudlet[localFields.compatibilityVersion]
                break;
            }
        }
        return version
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms;
            let configs = []
            let autoClusterName = perpetual.AUTOCLUSTER
            for (const form of forms) {
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if(form.field === localFields.autoClusterNameGroup && multiFormData[localFields.autoClusterName])
                        {
                            autoClusterName = autoClusterName + multiFormData[localFields.autoClusterName]
                        }
                        else if (form.field === localFields.configmulti) {
                            configs.push(multiFormData)
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if (configs.length > 0) {
                data[localFields.configs] = configs
            }

            let cloudlets = data[localFields.cloudletName];
            let flavors = data[localFields.flavorName];
            if (data[localFields.clusterName] || data[localFields.autoClusterInstance]) {
                data[localFields.clusterName] = data[localFields.autoClusterInstance] ? autoClusterName : data[localFields.clusterName]
            }
            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateData[localFields.clusterdeveloper] = this.clusterInstList[0][localFields.clusterdeveloper]
                    updateAppInst(this, updateData, this.onCreateResponse)
                }
            }
            else if (cloudlets && cloudlets.length > 0) {
                if (cloudlets && cloudlets.length > 0) {
                    for (let i = 0; i < cloudlets.length; i++) {
                        let newData = cloneDeep(data)
                        let cloudlet = cloudlets[i];
                        const fetchedFields = fetchCloudletField(this.cloudletList, { operatorName: data[localFields.operatorName], cloudletName: cloudlet }, [localFields.platformType, localFields.partnerOperator])
                        newData[localFields.dedicatedIp] =  fetchedFields[0] === perpetual.PLATFORM_TYPE_K8S_BARE_METAL ? data[localFields.dedicatedIp] : undefined
                        newData[localFields.cloudletName] = cloudlet;
                        newData[localFields.partnerOperator] = fetchedFields[1] 
                        newData[localFields.compatibilityVersion] = this.fetchCompabilityVersion(data, cloudlet)
                        if (flavors) {
                            newData[localFields.flavorName] = flavors[`${data[localFields.region]}>${data[localFields.operatorName]}>${cloudlet}`]
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
                        case localFields.region:
                            form.options = this.props.regions;
                            break;
                        case localFields.organizationName:
                            form.options = this.organizationList
                            break;
                        case localFields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case localFields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case localFields.flavorName:
                            form.options = this.flavorList
                            break;
                        case localFields.clusterName:
                            form.options = this.clusterInstList
                            break;
                        case localFields.appName:
                            form.options = this.appList
                            break;
                        case localFields.version:
                            form.options = this.appList
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                else if (form.formType === SWITCH) {
                    switch (form.field) {
                        case localFields.autoClusterInstance:
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
            organization[localFields.organizationName] = data[localFields.organizationName];
            this.organizationList = [organization]
            if (this.props.isLaunch) {
                let requestData = { region: data[localFields.region], org: data[localFields.organizationName], type: perpetual.DEVELOPER }
                requestList.push(showCloudlets(this, requestData))
                requestList.push(showCloudletInfoData(this, requestData))
                requestList.push(showClusterInsts(this, requestData))
                let disabledFields = [localFields.region, localFields.organizationName, localFields.appName, localFields.version]

                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i];
                    if (disabledFields.includes(form.field)) {
                        form.rules.disabled = true;
                    }
                }
            }
            else {
                let cloudlet = {}
                cloudlet[localFields.region] = data[localFields.region]
                cloudlet[localFields.cloudletName] = data[localFields.cloudletName]
                cloudlet[localFields.operatorName] = data[localFields.operatorName]
                cloudlet[localFields.compatibilityVersion] = data[localFields.compatibilityVersion]
                this.cloudletList.push(cloudlet)

                let clusterInst = {}
                clusterInst[localFields.region] = data[localFields.region]
                clusterInst[localFields.organizationName] = data[localFields.organizationName]
                clusterInst[localFields.clusterName] = data[localFields.clusterName]
                clusterInst[localFields.cloudletName] = data[localFields.cloudletName]
                clusterInst[localFields.operatorName] = data[localFields.operatorName]
                clusterInst[localFields.clusterdeveloper] = data[localFields.clusterdeveloper]
                this.clusterInstList.push(clusterInst)

                let flavor = {}
                flavor[localFields.region] = data[localFields.region]
                flavor[localFields.flavorName] = data[localFields.flavorName]
                this.flavorList = [flavor]

                let multiFormCount = 0
                let index = findIndexs(forms, localFields.configs)
                if (data[localFields.configs]) {
                    let configs = data[localFields.configs]
                    for (let config of configs) {
                        let configForms = this.configForm()
                        for (let configForm of configForms) {
                            if (configForm.field === localFields.kind) {
                                configForm.value = config[localFields.kind]
                            }
                            else if (configForm.field === localFields.config) {
                                configForm.value = config[localFields.config]
                            }
                        }
                        forms.splice(index + multiFormCount, 0, this.getConfigForm(configForms))
                        multiFormCount++
                    }
                }
            }

            let app = {}
            app[localFields.appName] = data[localFields.appName]
            app[localFields.region] = data[localFields.region]
            app[localFields.organizationName] = data[localFields.organizationName]
            app[localFields.version] = data[localFields.version]
            app[localFields.deployment] = data[localFields.deployment]
            app[localFields.accessType] = data[localFields.accessType]
            app[localFields.trusted] = data[localFields.trusted]
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
            this.updateUI(form, data)
            if (data) {
                if (!this.isUpdate && form.field === localFields.flavorName) {
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
                    <Grid item xs={this.state.showGraph ? 8 : 12}>
                        <div className="round_panel">
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                    {this.state.showGraph ?
                        <Grid item xs={4} >
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstReg));