import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import uuid from 'uuid';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, TEXT_AREA, ICON_BUTTON, formattedData, MAIN_HEADER, HEADER, MULTI_FORM } from '../../../hoc/forms/MexForms';
import ListMexMap from '../../../hoc/datagrid/map/ListMexMap';
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/MexMessageMultiStream'
import * as cloudletFLow from '../../../hoc/mexFlow/cloudletFlow'
import MexTab from '../../../hoc/forms/tab/MexTab';
import { redux_org } from '../../../helper/reduxData'
//model
import { service, updateFieldData, fields } from '../../../services';
import { showOrganizations } from '../../../services/modules/organization';
import { createCloudlet, updateCloudlet, getCloudletManifest, cloudletResourceQuota, cloudletProps } from '../../../services/modules/cloudlet';
import { showTrustPolicies } from '../../../services/modules/trustPolicy';
import { HELP_CLOUDLET_REG } from "../../../tutorial";

import { Grid } from '@material-ui/core';
import { endpoint, perpetual } from '../../../helper/constant';
import { componentLoader } from '../../../hoc/loader/componentLoader';
import { showGPUDrivers } from '../../../services/modules/gpudriver';
import { showAuthSyncRequest } from '../../../services/service';
import { _sort } from '../../../helper/constant/operators';

const MexFlow = React.lazy(() => componentLoader(import('../../../hoc/mexFlow/MexFlow')));
const CloudletManifest = React.lazy(() => componentLoader(import('./CloudletManifest')));

const fetchFormValue = (forms, field) => {
    let value = undefined
    for (const form of forms) {
        if (form.field === field) {
            value = form.value
            break;
        }
    }
    return value
}

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
        this.cloudletPropsList = [];
        this.gpuDriverList = [];
        this.kafkaRequired = true;
        this.allianceList = []
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    fetchRegionDependentData = async (region, platformType) => {
        let requestList = []
        if (region) {
            if (!this.requestedRegionList.includes(region)) {
                requestList.push(showTrustPolicies(this, { region }))
                requestList.push(showGPUDrivers(this, { region }))
            }
            if (platformType) {
                requestList.push(cloudletResourceQuota(this, { region, platformType }))
                requestList.push(cloudletProps(this, { region, platformType }))
            }

            if (requestList.length > 0) {
                let mcList = await service.multiAuthSyncRequest(this, requestList)
                if (mcList && mcList.length > 0) {
                    mcList.forEach(mc => {
                        if (service.responseValid(mc)) {
                            let method = mc.request.method
                            let data = mc.response.data
                            if (data) {
                                if (data.length > 0) {
                                    if (method === endpoint.SHOW_TRUST_POLICY) {
                                        this.trustPolicyList = [...this.trustPolicyList, ...data]
                                    }
                                    else if (method === endpoint.SHOW_GPU_DRIVER) {
                                        this.gpuDriverList = [...this.gpuDriverList, ...data]
                                    }
                                    else if (method === endpoint.GET_CLOUDLET_PROPS) {
                                        this.cloudletPropsList = data
                                    }
                                }
                                else if (method === endpoint.GET_CLOUDLET_RESOURCE_QUOTA_PROPS) {
                                    if (data.properties) {
                                        this.resourceQuotaList = data.properties
                                        this.resourceQuotaList = this.resourceQuotaList.map(quota => {
                                            return quota.name
                                        })
                                    }
                                }
                            }
                        }
                    })
                }
            }
        }
    }

    loadEnvMandatoryForms = (forms) => {
        let count = 0
        this.cloudletPropsList.forEach((item, i) => {
            if (item.mandatory) {
                let envForms = this.envForm()
                let key = item.key
                let value = item.value
                for (let envForm of envForms) {
                    if (envForm.field === fields.key) {
                        envForm.value = key
                        envForm.rules.disabled = true
                    }
                    else if (envForm.field === fields.value) {
                        envForm.value = value
                    }
                    else {
                        envForm.visible = false
                    }
                }
                forms.splice(16 + count, 0, this.getEnvForm(envForms))
                count++
            }
        })
        this.setState({ forms })
    }

    platformTypeValueChange = async (currentForm, forms, isInit) => {
        const valid = !isInit
        if (currentForm.value !== undefined && valid) {
            await this.fetchRegionDependentData(this.state.region, currentForm.value)
        }
        let nforms = forms.filter(form => {
            let valid = true
            if (form.field === fields.envVar || form.field === fields.resourceQuota) {
                valid = false
            }
            else if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                form.visible = currentForm.value === perpetual.PLATFORM_TYPE_OPEN_STACK
            }
            else if (form.field === fields.vmPool) {
                form.visible = currentForm.value === perpetual.PLATFORM_TYPE_VMPOOL
                form.rules.required = currentForm.value === perpetual.PLATFORM_TYPE_VMPOOL
            }
            return valid
        })
        if (valid) {
            if (currentForm.value !== undefined && this.state.region) {
                this.loadEnvMandatoryForms(nforms)
            }
            else {
                this.updateState({ forms: nforms })
            }
        }
    }

    infraAPIAccessChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.infraFlavorName || form.field === fields.infraExternalNetworkName) {
                form.rules.required = currentForm.value === perpetual.INFRA_API_ACCESS_RESTRICTED
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    locationChange = (currentForm, forms, isInit) => {
        if (!isInit) {
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
                cloudlet.cloudletLocation = { latitude, longitude }
                this.updateState({ mapData: [cloudlet] })
            }
            else {
                this.updateState({ mapData: [] })
            }
        }
    }

    regionValueChange = async (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.updateState({ region })
        if (region && !isInit) {
            const platformType = fetchFormValue(forms, fields.platformType)
            await this.fetchRegionDependentData(region, platformType)
            let nforms = forms.filter(form => {
                let valid = true
                if (form.field === fields.trustPolicyName || form.field === fields.gpuConfig) {
                    this.updateUI(form)
                }
                else if (form.field === fields.envVar || form.field === fields.resourceQuota) {
                    valid = false
                }
                return valid
            })
            if (platformType && region) {
                this.loadEnvMandatoryForms(nforms)
            }
            else {
                this.updateState({ forms: nforms })
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
            else if (form.field === fields.allianceOrganization) {
                this.allianceList = currentForm.value ? this.operatorList.filter(org => org !== currentForm.value) : []
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
                form.rules.required = inputValid && this.kafkaRequired
            }
        }
        this.updateState({ forms })
    }

    onCloudletPropsKeyChange = (currentForm, forms, isInit) => {
        let keyData = undefined
        for (const item of this.cloudletPropsList) {
            if (item[currentForm.field] === currentForm.value) {
                keyData = item
                break;
            }
        }

        if (keyData) {
            let parentForm = currentForm.parent.form
            for (let form of forms) {
                if (form.uuid === parentForm.uuid) {
                    for (let childForm of form.forms) {
                        if (childForm.field === fields.value) {
                            childForm.value = keyData.value
                            break;
                        }
                    }
                    break;
                }
            }
            this.updateState({ forms })
        }
    }

    checkForms = (form, forms, isInit = false, data) => {
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
        else if (form.field === fields.key) {
            this.onCloudletPropsKeyChange(form, forms, isInit)
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
                if (form.field === fields.gpuConfig) {
                    for (const option of form.options) {
                        if (option[fields.gpuConfig] === data[fields.gpuConfig] && data[fields.operatorName] === option[fields.organizationName] || option[fields.organizationName] === perpetual.MOBILEDGEX) {
                            data[fields.gpuDriverName] = option[fields.gpuDriverName]
                            data[fields.gpuORG] = option[fields.organizationName]
                            break;
                        }
                    }
                }
                else if (form.uuid) {
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
                if (updateData[fields.gpuConfig]) {
                    updateData[fields.gpuDriverName] = data[fields.gpuDriverName]
                    updateData[fields.gpuORG] = data[fields.gpuORG]
                }
                if ((updateData[fields.kafkaUser] || updateData[fields.kafkaPassword]) && !updateData[fields.kafkaCluster]) {
                    updateData[fields.kafkaCluster] = data[fields.kafkaCluster]
                    updateData.fields.push('42')
                }
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

    getMap = () => {
        console.log(this.state.mapData)
        return (<div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <ListMexMap dataList={this.state.mapData} id={perpetual.PAGE_CLOUDLETS} onMapClick={this.onMapClick} region={this.state.region} register={true} />
        </div>)
    }


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
        const { forms, showCloudletManifest, cloudletManifest, stepsArray, activeIndex } = this.state
        return (
            <div>
                {showCloudletManifest ?
                    cloudletManifest ? this.cloudletManifestForm() : null :
                    <Grid container>
                        <Grid item xs={7}>
                            <div className="round_panel">
                                <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </div>
                        </Grid>
                        <Grid item xs={5} style={{ backgroundColor: '#2A2C34', padding: 5 }}>
                            <MexTab form={{ panes: this.getPanes() }} activeIndex={activeIndex} />
                        </Grid>
                    </Grid>
                }
                <MexMultiStepper multiStepsArray={stepsArray} onClose={this.stepperClose} />
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
                            form.options = this.props.regions;
                            break;
                        case fields.ipSupport:
                            form.options = [perpetual.IP_SUPPORT_DYNAMIC];
                            break;
                        case fields.platformType:
                            form.options = [perpetual.PLATFORM_TYPE_OPEN_STACK, perpetual.PLATFORM_TYPE_VMPOOL, perpetual.PLATFORM_TYPE_VSPHERE, perpetual.PLATFORM_TYPE_VCD, perpetual.PLATFORM_TYPE_K8S_BARE_METAL];
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
                        case fields.gpuConfig:
                            form.options = this.gpuDriverList
                            break;
                        case fields.resourceName:
                            form.options = this.resourceQuotaList
                            break;
                        case fields.key:
                            form.options = this.cloudletPropsList
                            break;
                        case fields.allianceOrganization:
                            form.options = this.allianceList
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
            requestList.push(showGPUDrivers(this, { region: data[fields.region] }, true))
            requestList.push(cloudletResourceQuota(this, { region: data[fields.region], platformType: data[fields.platformType] }))
            requestList.push(showOrganizations(this, { type: perpetual.OPERATOR }))
            let mcList = await service.multiAuthSyncRequest(this, requestList)

            if (mcList && mcList.length > 0) {
                for (let i = 0; i < mcList.length; i++) {
                    let mc = mcList[i];
                    if (mc && mc.response && mc.response.data) {
                        let responseData = mc.response.data
                        let request = mc.request;
                        if(request.method === endpoint.SHOW_ORG)
                        {
                            this.operatorList = _sort(responseData.map(data=>(data[fields.organizationName])))
                        }
                        else if (request.method === endpoint.SHOW_TRUST_POLICY) {
                            this.trustPolicyList = responseData
                        }
                        if (request.method === endpoint.SHOW_GPU_DRIVER) {
                            this.gpuDriverList = responseData
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
                    forms.splice(17 + multiFormCount, 0, this.getEnvForm(envForms))
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
                    forms.splice(17 + multiFormCount, 0, this.getResoureQuotaForm(resourceQuotaForms))
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
        { field: fields.key, label: 'Key', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Key', rules: { required: true }, width: 7, visible: true, options: this.cloudletPropsList },
        { field: fields.value, label: 'Value', formType: INPUT, rules: { required: true }, width: 7, visible: true },
        this.isUpdate ? {} :
            { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    resourceQuotaForm = () => ([
        { field: fields.resourceName, label: 'Name', formType: SELECT, placeholder: 'Select Name', rules: { required: true }, width: 5, visible: true, options: this.resourceQuotaList, update: { edit: true } },
        { field: fields.alertThreshold, label: 'Alert Threshold', formType: INPUT, unit: '%', rules: { required: true }, width: 4, visible: true, update: { edit: true }, value: this.isUpdate ? this.props.data[fields.defaultResourceAlertThreshold] : undefined },
        { field: fields.resourceValue, label: 'Value', formType: INPUT, rules: { required: true }, width: 5, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getEnvForm = (form) => {
        return ({ uuid: uuid(), field: fields.envVar, formType: MULTI_FORM, forms: form ? form : this.envForm(), width: 3, visible: true })
    }

    getResoureQuotaForm = (form) => {
        return ({ uuid: uuid(), field: fields.resourceQuota, formType: MULTI_FORM, forms: form ? form : this.resourceQuotaForm(), width: 3, visible: true })
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
            { field: fields.infraApiAccess, label: 'Infra API Access', formType: SELECT, placeholder: 'Select Infra API Access', rules: { required: true }, visible: true, tip: 'Infra Access Type is the type of access available to Infra API Endpoint\nDirect:</b> Infra API endpoint is accessible from public network\nRestricted:</b> Infra API endpoint is not accessible from public network' },
            { field: fields.infraFlavorName, label: 'Infra Flavor Name', formType: 'Input', placeholder: 'Enter Infra Flavor Name', rules: { required: false }, visible: true, tip: 'Infra specific flavor name' },
            { field: fields.infraExternalNetworkName, label: 'Infra External Network Name', formType: 'Input', placeholder: 'Enter Infra External Network Name', rules: { required: false }, visible: true, tip: 'Infra specific external network name' },
            { field: fields.allianceOrganization, label: 'Alliance Organization', formType: MULTI_SELECT, placeholder: 'Select Alliance Operator', visible: true, tip: 'Alliance Organization of the cloudlet site', update: { id: ['47'] } },
            { field: fields.envVars, label: 'Environment Variable', formType: HEADER, forms: this.isUpdate ? [] : [{ formType: ICON_BUTTON, label: 'Add Env Vars', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getEnvForm }], visible: true, tip: 'Single Key-Value pair of env var to be passed to CRM' },
            { field: fields.resourceQuotas, label: 'Resource Quota', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Add Resource Quota', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getResoureQuotaForm }], visible: true, update: { id: ['39', '39.1', '39.2', '39.3'] }, tip: 'Alert Threshold:</b> Generate alert when more than threshold percentage of resource is used\nName:</b> Resource name on which to set quota\nValue:</b> Quota value of the resource' },
            { label: 'Advanced Settings', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'Advance Options', icon: 'expand_less', visible: true, onClick: this.advanceMenu }], visible: true },
            { field: fields.trustPolicyName, label: 'Trust Policy', formType: SELECT, placeholder: 'Select Trust Policy', visible: true, update: { id: ['37'] }, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.operatorName }], advance: false },
            { field: fields.gpuConfig, label: 'GPU Driver', formType: SELECT, placeholder: 'Select GPU Driver', visible: true, update: { id: ['45', '45.1', '45.1.1', '45.1.2'] }, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.operatorName, value: 'MobiledgeX' }], advance: false },
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
                else if (form.forms && form.formType !== HEADER && form.formType !== MULTI_FORM) {
                    this.updateFormData(form.forms, data)
                }
                else if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                    form.visible = false
                }
                else if (form.field === fields.kafkaCluster) {
                    this.kafkaRequired = data[fields.kafkaCluster] === undefined
                    form.value = data[fields.kafkaCluster]
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
            let organizationList = await showAuthSyncRequest(self, showOrganizations(self, { type: perpetual.OPERATOR }))
            this.operatorList = _sort(organizationList.map(org => (org[fields.organizationName])))
            if(redux_org.isOperator(this))
            {
                this.allianceList = this.operatorList.filter(org=>(org !== redux_org.nonAdminOrg(this)))
            }
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletReg));