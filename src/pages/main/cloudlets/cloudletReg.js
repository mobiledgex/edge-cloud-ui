import React, { Suspense } from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, TEXT_AREA, ICON_BUTTON, formattedData, MAIN_HEADER, HEADER } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/tab/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields, updateFieldData } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/modules/organization';
import { createCloudlet, updateCloudlet, getCloudletManifest, cloudletResourceQuota } from '../../../services/modules/cloudlet';
//Map
import ListMexMap from '../../../container/map/ListMexMap'
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { HELP_CLOUDLET_REG } from "../../../tutorial";
import * as cloudletFLow from '../../../hoc/mexFlow/cloudletFlow'
import { getTrustPolicyList, showTrustPolicies } from '../../../services/modules/trustPolicy';

import { Grid } from '@material-ui/core';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { service } from '../../../services';
import { componentLoader } from '../../../hoc/loader/componentLoader';

const MexFlow = React.lazy(() => componentLoader(import('../../../hoc/mexFlow/MexFlow')));
const CloudletManifest = React.lazy(() => componentLoader(import('./cloudletManifestForm')));

class CloudletReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
            cloudletManifest: undefined,
            showCloudletManifest: false,
            showManifest: false,
            activeIndex: 0,
            flowDataList: [],
            flowInstance: undefined,
            region: undefined
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.infraApiAccessList = [perpetual.INFRA_API_ACCESS_DIRECT, perpetual.INFRA_API_ACCESS_RESTRICTED]
        //To avoid refeching data from server
        this.requestedRegionList = [];
        this.operatorList = [];
        this.cloudletData = undefined;
        this.canCloseStepper = true;
        this.restricted = false;
        this.updateFlowDataList = [];
        this.expandAdvanceMenu = false;
        this.trustPolicyList = [];
        this.resourceQuotaList = [];
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    platformTypeValueChange = async (currentForm, forms, isInit) => {
        await this.getCloudletResourceQuota(this.state.region, currentForm.value)
        for (let form of forms) {
            if (form.forms) {
                for (let childForm of form.forms) {
                    if (childForm.field === fields.resourceName) {
                        if (!this.isUpdate) {
                            this.updateUI(childForm)
                            this.updateState({ forms })
                        }
                    }
                }
            }
            else if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                form.visible = currentForm.value === perpetual.PLATFORM_TYPE_OPEN_STACK
            }
            else if (form.field === fields.vmPool) {
                form.visible = currentForm.value === perpetual.PLATFORM_TYPE_VMPOOL
                form.rules.required = currentForm.value === perpetual.PLATFORM_TYPE_VMPOOL
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    infraAPIAccessChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.infraFlavorName || form.field === fields.infraExternalNetworkName) {
                form.rules.required = currentForm.value === perpetual.INFRA_API_ACCESS_RESTRICTED
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    locationChange = (currentForm, forms, isInit) => {
        if (isInit === undefined || isInit === false) {
            let parentForm = currentForm.parent.form
            let childForms = parentForm.forms
            let latitude = undefined
            let longitude = undefined
            for (let i = 0; i < childForms.length; i++) {
                let form = childForms[i]
                if (form.field === fields.latitude) {
                    latitude = form.value
                }
                else if (form.field === fields.longitude) {
                    longitude = form.value
                }
            }
            if (latitude && longitude) {
                let cloudlet = {}
                cloudlet.cloudletLocation = { latitude: latitude, longitude: longitude }
                this.updateState({ mapData: [cloudlet] })
            }
            else {
                this.updateState({ mapData: [] })
            }
        }
    }

    getTrustPolicy = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.trustPolicyList = [...this.trustPolicyList, ...await getTrustPolicyList(this, { region: region })]
        }
        this.updateUI(form)
        this.updateState({ forms })
    }

    getCloudletResourceQuota = async (region, platformType) => {
        if (region && platformType) {
            let mc = await service.authSyncRequest(this, cloudletResourceQuota(this, { region, platformType }))
            if (mc && mc.response && mc.response.status === 200) {
                if (mc.response.data.properties) {
                    this.resourceQuotaList = mc.response.data.properties
                    this.resourceQuotaList = this.resourceQuotaList.map(quota => {
                        return quota.name
                    })
                }
            }
        }
    }

    regionValueChange = async (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.updateState({ region })
        if (region) {
            for (let form of forms) {
                if (form.field === fields.trustPolicyName) {
                    if (isInit === undefined || isInit === false) {
                        this.getTrustPolicy(region, form, forms)
                    }
                }
                else if (form.field === fields.platformType) {
                    await this.getCloudletResourceQuota(region, form.value)
                }
            }
            this.requestedRegionList.push(region);
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.trustPolicyName) {
                this.updateUI(form)
                this.updateState({ forms })
            }
        }
    }

    kafkaChange = (currentForm, forms, isInit) => {
        let inputValid = false
        for (let form of forms) {
            if (inputValid) {
                continue;
            }
            else if (form.field === fields.kafkaCluster || form.field === fields.kafkaUser || form.field === fields.kafkaPassword) {
                inputValid = Boolean(form.value)
            }
        }
        for (let form of forms) {
            if (form.field === fields.kafkaCluster || form.field === fields.kafkaUser || form.field === fields.kafkaPassword) {
                form.rules.required = inputValid
            }
        }
        this.updateState({ forms })
    }

    checkForms = (form, forms, isInit, data) => {
        let flowDataList = []
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === fields.platformType) {
            this.platformTypeValueChange(form, forms, isInit)
        }
        else if (form.field === fields.latitude || form.field === fields.longitude) {
            this.locationChange(form, forms, isInit)
        }
        else if (form.field === fields.infraApiAccess) {
            this.infraAPIAccessChange(form, forms, isInit)
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(cloudletFLow.privateFlow(finalData))
        }
        else if (form.field === fields.kafkaCluster || form.field === fields.kafkaUser || form.field === fields.kafkaPassword) {
            this.kafkaChange(form, forms, isInit)
        }

        if (flowDataList.length > 0) {
            if (isInit) {
                this.updateFlowDataList = [...this.updateFlowDataList, ...flowDataList]
            }
            else {
                this.updateState({ flowDataList: flowDataList, activeIndex: 1 })
            }
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

    onCreateResponse = async (mc) => {
        if (mc) {
            this.props.handleLoadingSpinner(false)
            if (mc.close && this.state.stepsArray.length === 0) {
                this.props.handleAlertInfo('success', 'Cloudlet updated successfully')
                this.props.onClose(true)
            }
            else {
                let responseData = undefined;
                let request = mc.request;
                if (mc.response && mc.response.data) {
                    responseData = mc.response.data;
                }
                let orgData = request.orgData;
                let isRestricted = orgData[fields.infraApiAccess] === perpetual.INFRA_API_ACCESS_RESTRICTED

                let labels = [{ label: 'Cloudlet', field: fields.cloudletName }]
                if (!this.isUpdate && isRestricted) {
                    this.restricted = true
                    if (responseData && responseData.data && responseData.data.message === 'Cloudlet configured successfully. Please run `GetCloudletManifest` to bringup Platform VM(s) for cloudlet services') {
                        responseData.data.message = 'Cloudlet configured successfully, please wait requesting cloudlet manifest to bring up Platform VM(s) for cloudlet service'
                        this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
                        let cloudletManifest = await getCloudletManifest(this, orgData, false)
                        this.cloudletData = orgData
                        if (cloudletManifest && cloudletManifest.response && cloudletManifest.response.data) {
                            this.updateState({ cloudletManifest: cloudletManifest.response.data, showCloudletManifest: true, stepsArray: [] })
                        }
                    }
                    else {
                        let isRequestFailed = responseData ? responseData.code !== 200 : false
                        if (responseData || isRequestFailed) {
                            this.canCloseStepper = isRequestFailed
                            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
                        }
                    }
                }
                else {
                    if (responseData) { this.canCloseStepper = responseData.code === 200 }
                    this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
                }
            }
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            let envVars = undefined
            let resourceQuotas = []
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.cloudletLocation) {
                            multiFormData.latitude = Number(multiFormData.latitude)
                            multiFormData.longitude = Number(multiFormData.longitude)
                            data[fields.cloudletLocation] = multiFormData
                        }
                        else if (multiFormData[fields.key] && multiFormData[fields.value]) {
                            envVars = envVars ? envVars : {}
                            envVars[multiFormData[fields.key]] = multiFormData[fields.value]
                        }
                        else if (multiFormData[fields.resourceName] && multiFormData[fields.alertThreshold] && multiFormData[fields.resourceValue]) {
                            resourceQuotas.push({ name: multiFormData[fields.resourceName], value: parseInt(multiFormData[fields.resourceValue]), alert_threshold: parseInt(multiFormData[fields.alertThreshold]) })
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if (envVars) {
                data[fields.envVars] = envVars
            }

            if (resourceQuotas.length > 0) {
                data[fields.resourceQuotas] = resourceQuotas
            }

            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateCloudlet(this, updateData, this.onCreateResponse)
                }
            }
            else {
                this.props.handleLoadingSpinner(true)
                createCloudlet(this, data, this.onCreateResponse)
            }
        }
    }

    onMapClick = (location) => {
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletLocation && !form.rules.disabled) {
                let cloudlet = {}
                cloudlet.cloudletLocation = { latitude: location.lat, longitude: location.long }
                this.updateState({ mapData: [cloudlet] })
                let childForms = form.forms;
                for (let j = 0; j < childForms.length; j++) {
                    let childForm = childForms[j]
                    if (childForm.field === fields.latitude) {
                        childForm.value = location.lat
                    }
                    else if (childForm.field === fields.longitude) {
                        childForm.value = location.long
                    }
                }
                break;
            }
        }
        this.reloadForms()
    }

    /**
     * Tab block
     */

    saveFlowInstance = (flowInstance) => {
        this.updateState({ flowInstance })
    }

    getGraph = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <Suspense fallback={<div></div>}>
                <MexFlow flowDataList={this.state.flowDataList} saveFlowInstance={this.saveFlowInstance} flowInstance={this.state.flowInstance} flowObject={cloudletFLow} />
            </Suspense>
        </div>
    )

    getMap = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <ListMexMap dataList={this.state.mapData} id={perpetual.PAGE_CLOUDLETS} onMapClick={this.onMapClick} region={this.state.region} register={true} />
        </div>
    )

    getPanes = () => ([
        { label: 'Cloudlet Location', tab: this.getMap(), onClick: () => { this.updateState({ activeIndex: 0 }) } },
        { label: 'Graph', tab: this.getGraph(), onClick: () => { this.updateState({ activeIndex: 1 }) } }
    ])
    /**
     * Tab block
     */

    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    stepperClose = () => {
        if (this.restricted) {
            if (this.canCloseStepper) {
                this.updateState({
                    stepsArray: []
                })
            }
        }
        else {
            this.updateState({
                stepsArray: []
            })
            if (this.canCloseStepper) {
                this.props.onClose(true)
            }
        }
    }

    cloudletManifestForm = () => {
        let fileName = `${this.cloudletData[fields.cloudletName]}-${this.cloudletData[fields.operatorName]}-pf`
        let cloudletManifest = this.state.cloudletManifest;
        if (cloudletManifest && cloudletManifest['manifest']) {
            return (
                <CloudletManifest cloudletManifest={cloudletManifest} fileName={fileName} onClose={this.props.onClose} />
            )
        }
    }

    render() {
        return (
            <div>
                {this.state.showCloudletManifest ?
                    this.state.cloudletManifest ? this.cloudletManifestForm() : null :
                    <Grid container>
                        <Grid item xs={6}>
                            <div className="round_panel">
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </div>
                        </Grid>
                        <Grid item xs={6} style={{ borderRadius: 5, backgroundColor: 'transparent' }}>
                            <MexTab form={{ panes: this.getPanes() }} activeIndex={this.state.activeIndex} />
                        </Grid>
                    </Grid>
                }
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.ipSupport:
                            form.options = [perpetual.IP_SUPPORT_DYNAMIC];
                            break;
                        case fields.platformType:
                            form.options = [perpetual.PLATFORM_TYPE_OPEN_STACK, perpetual.PLATFORM_TYPE_VMPOOL, perpetual.PLATFORM_TYPE_VSPHERE, perpetual.PLATFORM_TYPE_VCD];
                            break;
                        case fields.maintenanceState:
                            form.options = [perpetual.MAINTENANCE_STATE_NORMAL_OPERATION, perpetual.MAINTENANCE_STATE_MAINTENANCE_START, perpetual.MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER];
                            break;
                        case fields.infraApiAccess:
                            form.options = this.infraApiAccessList;
                            form.value = perpetual.INFRA_API_ACCESS_DIRECT;
                            break;
                        case fields.trustPolicyName:
                            form.options = this.trustPolicyList
                            break;
                        case fields.resourceName:
                            form.options = this.resourceQuotaList
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
            let requestList = []

            let operator = {}
            operator[fields.operatorName] = data[fields.operatorName];
            this.operatorList = [operator]
            this.updateState({ mapData: [data] })

            requestList.push(showTrustPolicies(this, { region: data[fields.region] }))
            requestList.push(cloudletResourceQuota(this, { region: data[fields.region], platformType: data[fields.platformType] }))
            let mcRequestList = await service.multiAuthSyncRequest(this, requestList)

            if (mcRequestList && mcRequestList.length > 0) {
                for (let i = 0; i < mcRequestList.length; i++) {
                    let mc = mcRequestList[i];
                    if (mc && mc.response && mc.response.data) {
                        let responseData = mc.response.data
                        let request = mc.request;
                        if (request.method === endpoint.SHOW_TRUST_POLICY) {
                            this.trustPolicyList = responseData
                        }
                        else if (request.method === endpoint.GET_CLOUDLET_RESOURCE_QUOTA_PROPS) {
                            if (responseData.properties) {
                                this.resourceQuotaList = responseData.properties
                                this.resourceQuotaList = this.resourceQuotaList.map(quota => {
                                    return quota.name
                                })
                            }
                        }
                    }
                }
            }
            data[fields.maintenanceState] = undefined

            let multiFormCount = 0
            if (data[fields.envVars]) {
                let envVarsArray = data[fields.envVars]
                Object.keys(envVarsArray).map(item => {
                    let envForms = this.envForm()
                    let key = item
                    let value = envVarsArray[item]
                    for (let j = 0; j < envForms.length; j++) {
                        let envForm = envForms[j]
                        if (envForm.field === fields.key) {
                            envForm.value = key
                        }
                        else if (envForm.field === fields.value) {
                            envForm.value = value
                        }
                    }
                    forms.splice(15 + multiFormCount, 0, this.getEnvForm(envForms))
                    multiFormCount += 1
                })
            }

            if (data[fields.resourceQuotas]) {
                let resourceQuotaArray = data[fields.resourceQuotas]
                resourceQuotaArray.map(item => {
                    let resourceQuotaForms = this.resourceQuotaForm()
                    for (let resourceQuotaForm of resourceQuotaForms) {
                        if (resourceQuotaForm.field === fields.resourceName) {
                            resourceQuotaForm.value = item['name']

                        }
                        else if (resourceQuotaForm.field === fields.resourceValue) {
                            resourceQuotaForm.value = item['value']

                        }
                        else if (resourceQuotaForm.field === fields.alertThreshold) {
                            resourceQuotaForm.value = item['alert_threshold'] ? item['alert_threshold'] : data[fields.defaultResourceAlertThreshold]
                        }
                    }
                    forms.splice(16 + multiFormCount, 0, this.getResoureQuotaForm(resourceQuotaForms))
                    multiFormCount += 1
                })
            }
        }
    }

    locationForm = () => ([
        { field: fields.latitude, label: 'Latitude', formType: INPUT, placeholder: '-90 ~ 90', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update: { edit: true } },
        { field: fields.longitude, label: 'Longitude', formType: INPUT, placeholder: '-180 ~ 180', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update: { edit: true } }
    ])

    cloudletManifest = () => {
        return [
            { field: fields.manifest, serverField: 'manifest', label: 'Manifest', dataType: perpetual.TYPE_YAML },
        ]
    }

    /*Multi Form*/
    envForm = () => ([
        { field: fields.key, label: 'Key', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        { field: fields.value, label: 'Value', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        this.isUpdate ? {} :
            { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 4, onClick: this.removeMultiForm }
    ])

    resourceQuotaForm = () => ([
        { field: fields.resourceName, label: 'Name', formType: SELECT, placeholder: 'Select Name', rules: { required: true }, width: 5, visible: true, options: this.resourceQuotaList, update: { edit: true } },
        { field: fields.alertThreshold, label: 'Alert Threshold', formType: INPUT, rules: { required: true }, width: 4, visible: true, update: { edit: true }, value: this.isUpdate ? this.props.data[fields.defaultResourceAlertThreshold] : undefined },
        { field: fields.resourceValue, label: 'Value', formType: INPUT, rules: { required: true }, width: 4, visible: true, update: { edit: true } },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removeMultiForm }

    ])

    getEnvForm = (form) => {
        return ({ uuid: uuid(), field: fields.annotations, formType: 'MultiForm', forms: form ? form : this.envForm(), width: 3, visible: true })
    }

    getResoureQuotaForm = (form) => {
        return ({ uuid: uuid(), field: fields.annotations, formType: 'MultiForm', forms: form ? form : this.resourceQuotaForm(), width: 3, visible: true })
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

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Cloudlet`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to deploy.', update: { key: true } },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: INPUT, placeholder: 'Enter cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.', update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the cloudlet site', update: { key: true } },
            { uuid: uuid(), field: fields.cloudletLocation, label: 'Cloudlet Location', formType: INPUT, rules: { required: true }, visible: true, forms: this.locationForm(), tip: 'GPS Location', update: { id: ['5', '5.1', '5.2'] } },
            { field: fields.ipSupport, label: 'IP Support', formType: SELECT, placeholder: 'Select IP Support', rules: { required: true }, visible: true, tip: 'Static IP support indicates a set of static public IPs are available for use, and managed by the Controller. Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.' },
            { field: fields.numDynamicIPs, label: 'Number of Dynamic IPs', formType: INPUT, placeholder: 'Enter Number of Dynamic IPs', rules: { required: true, type: 'number' }, visible: true, update: { id: ['8'] }, tip: 'Number of dynamic IPs available for dynamic IP support.' },
            { field: fields.physicalName, label: 'Physical Name', formType: INPUT, placeholder: 'Enter Physical Name', rules: { required: true }, visible: true, tip: 'Physical infrastructure cloudlet name.' },
            { field: fields.platformType, label: 'Platform Type', formType: SELECT, placeholder: 'Select Platform Type', rules: { required: true }, visible: true, tip: 'Supported list of cloudlet types.' },
            { field: fields.vmPool, label: 'VM Pool', formType: INPUT, placeholder: 'Enter Pool Name', rules: { required: false }, visible: false, tip: 'VM Pool' },
            { field: fields.openRCData, label: 'OpenRC Data', formType: TEXT_AREA, placeholder: 'Enter OpenRC Data', rules: { required: false }, visible: false, tip: 'key-value pair of access variables delimitted by newline.\nSample Input:\nOS_AUTH_URL=...\nOS_PROJECT_ID=...\nOS_PROJECT_NAME=...' },
            { field: fields.caCertdata, label: 'CACert Data', formType: TEXT_AREA, placeholder: 'Enter CACert Data', rules: { required: false }, visible: false, tip: 'CAcert data for HTTPS based verfication of auth URL' },
            { field: fields.infraApiAccess, label: 'Infra API Access', formType: SELECT, placeholder: 'Select Infra API Access', rules: { required: true }, visible: true, tip: 'Infra Access Type is the type of access available to Infra API Endpoint\n* Direct: Infra API endpoint is accessible from public network\n* Restricted: Infra API endpoint is not accessible from public network' },
            { field: fields.infraFlavorName, label: 'Infra Flavor Name', formType: 'Input', placeholder: 'Enter Infra Flavor Name', rules: { required: false }, visible: true, tip: 'Infra specific flavor name' },
            { field: fields.infraExternalNetworkName, label: 'Infra External Network Name', formType: 'Input', placeholder: 'Enter Infra External Network Name', rules: { required: false }, visible: true, tip: 'Infra specific external network name' },
            { field: fields.envVars, label: 'Environment Variable', formType: HEADER, forms: this.isUpdate ? [] : [{ formType: ICON_BUTTON, label: 'Add Env Vars', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getEnvForm }], visible: true, tip: 'Single Key-Value pair of env var to be passed to CRM' },
            { field: fields.resourceQuotas, label: 'Resource Quota', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Resource Quota', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getResoureQuotaForm }], visible: true, update: { id: ['39', '39.1', '39.2', '39.3'] }, tip: '* Alert Threshold: Generate alert when more than threshold percentage of resource is used\n * Name: Resource name on which to set quota\n * Value: Quota value of the resource' },
            { label: 'Advanced Settings', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Advance Options', icon: 'expand_less', visible: true, onClick: this.advanceMenu }], visible: true },
            { field: fields.trustPolicyName, label: 'Trust Policy', formType: SELECT, placeholder: 'Select Trust Policy', visible: true, update: { id: ['37'] }, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.operatorName }], advance: false },
            { field: fields.containerVersion, label: 'Container Version', formType: INPUT, placeholder: 'Enter Container Version', rules: { required: false }, visible: true, tip: 'Cloudlet container version', advance: false },
            { field: fields.vmImageVersion, label: 'VM Image Version', formType: INPUT, placeholder: 'Enter VM Image Version', rules: { required: false }, visible: true, tip: 'MobiledgeX baseimage version where CRM services reside', advance: false },
            { field: fields.maintenanceState, label: 'Maintenance State', formType: SELECT, placeholder: 'Select Maintenance State', rules: { required: false }, visible: this.isUpdate, update: { id: ['30'] }, tip: 'Maintenance allows for planned downtimes of Cloudlets. These states involve message exchanges between the Controller, the AutoProv service, and the CRM. Certain states are only set by certain actors', advance: false },
            { field: fields.kafkaCluster, label: 'Kafka Cluster', formType: INPUT, placeholder: 'Enter Kafka Cluster Endpoint', rules: { required: false, onBlur: true }, visible: true, update: { id: ['42'] }, tip: 'Operator provided kafka cluster endpoint to push events to', advance: false },
            { field: fields.kafkaUser, label: 'Kafka User', formType: INPUT, placeholder: 'Enter Kafka Username', rules: { required: false, onBlur: true }, visible: true, update: { id: ['43'] }, tip: 'Username for kafka SASL/PLAIN authentification, stored securely in secret storage and never visible externally', advance: false },
            { field: fields.kafkaPassword, label: 'Kafka Password', formType: INPUT, placeholder: 'Enter Kafka Password', rules: { required: false, onBlur: true }, visible: true, update: { id: ['44'] }, tip: 'Password for kafka SASL/PLAIN authentification, stored securely in secret storage and never visible externally', advance: false },

        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.field === fields.envVars && data[fields.envVars] === undefined) {
                    form.visible = false;
                }
                else if (form.forms && form.formType !== HEADER && form.formType !== 'MultiForm') {
                    this.updateFormData(form.forms, data)
                }
                else if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                    form.visible = false
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true, data)
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        if (data) {
            if (this.props.manifestData) {
                this.updateState({ showCloudletManifest: true })
                this.cloudletData = data
                this.updateState({ cloudletManifest: this.props.manifestData })
            }
            else {
                await this.loadDefaultData(forms, data)
            }
        }
        else {
            let organizationList = await getOrganizationList(this, { type: perpetual.OPERATOR })
            this.operatorList = organizationList.map(org => {
                return org[fields.organizationName]
            })
        }
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


        this.updateFormData(forms, data)

        this.updateState({
            forms
        })

        if (this.isUpdate) {
            this.updateState({
                showGraph: true,
                flowDataList: this.updateFlowDataList
            })
        }

    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_CLOUDLET_REG)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletReg));