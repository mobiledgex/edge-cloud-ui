import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, SWITCH, formattedData, MAIN_HEADER, INPUT, SELECT_RADIO_TREE_GROUP } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/tab/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { localFields } from '../../../services/fields';
import { redux_org } from '../../../helper/reduxData'
//model
import { createClusterInst, updateClusterInst } from '../../../services/modules/clusterInst';
import { getOrganizationList } from '../../../services/modules/organization';
import { showCloudlets, cloudletWithInfo, fetchCloudletField } from '../../../services/modules/cloudlet';
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import { fetchCloudletFlavors } from '../../../services/modules/flavor';
import { getAutoScalePolicyList, showAutoScalePolicies } from '../../../services/modules/autoScalePolicy';
import { showNetwork } from '../../../services/modules/network'
//Map
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/MexMessageMultiStream'
import { HELP_CLUSTER_INST_REG } from "../../../tutorial";

import * as clusterFlow from '../../../hoc/mexFlow/appFlow'
import { sendRequests } from '../../../services/worker/serverWorker'
import { Grid } from '@material-ui/core';
import { endpoint, perpetual } from '../../../helper/constant';
import { service, updateFieldData } from '../../../services';
import { componentLoader } from '../../../hoc/loader/componentLoader';
import cloneDeep from 'lodash/cloneDeep';
import { showAuthSyncRequest } from '../../../services/service';
import ListMexMap from '../../../hoc/datagrid/map/ListMexMap';

const MexFlow = React.lazy(() => componentLoader(import('../../../hoc/mexFlow/MexFlow')));

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
            activeIndex: 0,
            flowDataList: [],
            flowInstance: undefined,
            region: '',
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.organizationList = []
        this.cloudletList = []
        this.flavorOrgList = {}
        this.flavorList = {}
        this.autoScalePolicyList = []
        this.ipAccessList = [perpetual.IP_ACCESS_DEDICATED, perpetual.IP_ACCESS_SHARED]
        this.updateFlowDataList = []
        this.networkOrgList = {}
        this.networkList = {}
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getCloudletInfo = (form, forms) => {
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
                this.cloudletList = cloudletWithInfo(mcList, perpetual.PAGE_CLUSTER_INSTANCES)
                this.props.handleLoadingSpinner(false)
                this.updateUI(form)
                this.updateState({ forms })
            });
        }
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
    getNetworkData = async (form, forms) => {
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

        this.networkList = {}
        if (region && operatorName && cloudletList) {
            await Promise.all(cloudletList.map(async (cloudletName) => {
                let key = `${region}>${operatorName}>${cloudletName}`
                if (this.networkOrgList[key] === undefined) {
                    const partnerOperator = fetchCloudletField(this.cloudletList, { operatorName, cloudletName }, localFields.partnerOperator)
                    let networkList = await showAuthSyncRequest(this, showNetwork(this, { region, cloudletName, operatorName, partnerOperator }))
                    if (networkList.length > 0) {
                        networkList = networkList.map((data) => {
                            return data.networkName
                        })
                    }
                    if (networkList && networkList.length > 0) {
                        this.networkOrgList[key] = networkList
                    }
                }
                if (this.networkOrgList[key]) {
                    this.networkList[key] = this.networkOrgList[key]
                }
            }))
            this.updateUI(form)
            this.updateState({ forms })
        }
    }


    getAutoScalePolicy = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.autoScalePolicyList = [...this.autoScalePolicyList, ...await getAutoScalePolicyList(this, { region: region })]
        }
        this.updateUI(form)
        this.updateState({ forms })
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.updateState({ region })
        if (region) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === localFields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                    if (!isInit) {
                        this.getCloudletInfo(form, forms)
                    }
                }
                else if (form.field === localFields.autoScalePolicyName) {
                    if (!isInit) {
                        this.getAutoScalePolicy(region, form, forms)
                    }
                }
            }
            this.requestedRegionList.push(region);
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
            else if (form.field === localFields.autoScalePolicyName) {
                this.updateUI(form)
                this.updateState({ forms })
            }
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.cloudletName) {
                this.updateUI(form)
                if (!isInit) {
                    this.updateState({ forms, mapData: [] })
                }
            }
            else if (form.field === localFields.flavorName) {
                if (!isInit) {
                    this.flavorList = {}
                    this.updateUI(form)
                }
            }
            else if (form.field === localFields.network) {
                if (!isInit) {
                    this.networkList = {}
                    this.updateUI(form)
                }
            }
        }
    }

    deploymentValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === localFields.numberOfMasters) {
                form.value = currentForm.value === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? 1 : undefined
                form.visible = currentForm.value === perpetual.DEPLOYMENT_TYPE_DOCKER ? false : true
            }
            else if (form.field === localFields.numberOfNodes || form.field === localFields.sharedVolumeSize) {
                form.value = currentForm.value === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? form.value : undefined
                form.visible = currentForm.value === perpetual.DEPLOYMENT_TYPE_DOCKER ? false : true
            }
            else if (form.field === localFields.autoScalePolicyName) {
                form.visible = currentForm.value !== perpetual.DEPLOYMENT_TYPE_DOCKER
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
    }

    cloudletValueChange = (form, forms, isInit) => {
        let mapData = [];
        let couldlets = this.cloudletList;
        for (let i = 0; i < couldlets.length; i++) {
            let cloudlet = couldlets[i];
            if (form.value && form.value.includes(cloudlet[localFields.cloudletName])) {
                mapData.push(cloudlet)
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
            if (form.field === localFields.network) {
                if (!isInit) {
                    this.getNetworkData(form, forms)
                }
            }
        }
        this.updateState({
            mapData
        })
    }

    reservableChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === localFields.ipAccess) {
                form.value = currentForm.value ? perpetual.IP_ACCESS_DEDICATED : form.value
                form.rules.disabled = currentForm.value
            }
        }
        if (!isInit) {
            this.updateState({ forms })
        }
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
        else if (form.field === localFields.deployment) {
            this.deploymentValueChange(form, forms, isInit)
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(clusterFlow.deploymentTypeFlow(finalData))
            flowDataList.push(clusterFlow.ipAccessFlow({}))
        }
        else if (form.field === localFields.ipAccess) {
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(clusterFlow.ipAccessFlow(finalData))
        }
        else if (form.field === localFields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.reservable) {
            this.reservableChange(form, forms, isInit)
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

    onCreateResponse = (mcRequest) => {
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            let request = mcRequest.request;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let labels = [{ label: 'Cloudlet', field: localFields.cloudletName }]
            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            let cloudlets = data[localFields.cloudletName];
            let flavors = data[localFields.flavorName]
            let network = data[localFields.network]
            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.localFields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateClusterInst(this, updateData, this.onCreateResponse)
                }
            }
            else {
                if (cloudlets && cloudlets.length > 0) {
                    for (let i = 0; i < cloudlets.length; i++) {
                        let newData = cloneDeep(data)
                        let cloudlet = cloudlets[i];
                        newData[localFields.cloudletName] = cloudlet;
                        newData[localFields.partnerOperator] = fetchCloudletField(this.cloudletList, { operatorName: data[localFields.operatorName], cloudletName: cloudlet }, localFields.partnerOperator)
                        newData[localFields.flavorName] = flavors[`${data[localFields.region]}>${data[localFields.operatorName]}>${cloudlet}`]
                        newData[localFields.network] = network ? [network[`${data[localFields.region]}>${data[localFields.operatorName]}>${cloudlet}`]] : undefined
                        this.props.handleLoadingSpinner(true)
                        createClusterInst(this, Object.assign({}, newData), this.onCreateResponse)
                    }

                }
            }
        }
    }

    /**
     * Tab block
     */
    getMap = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <ListMexMap dataList={this.state.mapData} id={perpetual.PAGE_CLUSTER_INSTANCES} region={this.state.region} register={true} />
        </div>
    )

    saveFlowInstance = (data) => {
        this.updateState({ flowInstance: data })
    }

    getGraph = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <Suspense fallback={<div></div>}>
                <MexFlow flowDataList={this.state.flowDataList} saveFlowInstance={this.saveFlowInstance} flowInstance={this.state.flowInstance} flowObject={clusterFlow} />
            </Suspense>
        </div>
    )

    getPanes = () => ([
        { label: 'Cloudlet Locations', tab: this.getMap(), onClick: () => { this.updateState({ activeIndex: 0 }) } },
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
        this.updateState({
            stepsArray: []
        })
        this.props.onClose(true)
    }


    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={8}>
                        <div className="round_panel">
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                    <Grid item xs={4} style={{ backgroundColor: '#2A2C34', padding: 5 }}>
                        <MexTab form={{ panes: this.getPanes() }} activeIndex={this.state.activeIndex} />
                    </Grid>
                </Grid>
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT || form.formType === SELECT_RADIO_TREE_GROUP) {
                    switch (form.field) {
                        case localFields.organizationName:
                            form.options = this.organizationList
                            break;
                        case localFields.region:
                            form.options = this.props.regions;
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
                        case localFields.deployment:
                            form.options = [perpetual.DEPLOYMENT_TYPE_DOCKER, perpetual.DEPLOYMENT_TYPE_KUBERNETES]
                            break;
                        case localFields.autoScalePolicyName:
                            form.options = this.autoScalePolicyList
                            break;
                        case localFields.ipAccess:
                            form.options = this.ipAccessList;
                            break;
                        case localFields.network:
                            form.options = this.networkList;
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (data) => {
        if (data) {
            let organization = {}
            organization[localFields.organizationName] = data[localFields.organizationName];
            this.organizationList = [organization]

            let cloudlet = {}
            cloudlet[localFields.region] = data[localFields.region]
            cloudlet[localFields.cloudletName] = data[localFields.cloudletName]
            cloudlet[localFields.operatorName] = data[localFields.operatorName]
            cloudlet[localFields.cloudletLocation] = data[localFields.cloudletLocation]
            this.cloudletList = [cloudlet]
            this.updateState({ mapData: [cloudlet] })

            let flavor = {}
            flavor[localFields.region] = data[localFields.region]
            flavor[localFields.flavorName] = data[localFields.flavorName]
            this.flavorList = [flavor]
            let network = {}
            network[localFields.region] = data[localFields.region]
            network[localFields.network] = data[localFields.flavorName]
            this.networkList = [network]

            let requestList = []
            if (data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES) {
                requestList.push(showAutoScalePolicies(this, { region: data[localFields.region] }))
            }

            let mcList = await service.multiAuthSyncRequest(this, requestList)
            if (mcList && mcList.length > 0) {
                for (let i = 0; i < mcList.length; i++) {
                    let mcRequest = mcList[i];
                    let request = mcRequest.request;
                    if (request.method === endpoint.SHOW_AUTO_SCALE_POLICY) {
                        this.autoScalePolicyList = mcRequest.response.data
                    }
                }
            }
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Cluster Instances`, formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: localFields.clusterName, label: 'Cluster Name', formType: INPUT, placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, update: { key: true } },
            { field: localFields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), update: { key: true } },
            { field: localFields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }], update: { key: true } },
            { field: localFields.partnerOperator, label: 'Partner Operator', formType: INPUT, visible: false, update: { key: true }},
            { field: localFields.cloudletName, label: 'Cloudlet', formType: this.isUpdate ? SELECT : MULTI_SELECT, placeholder: 'Select Cloudlet', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }, { index: 4, field: localFields.operatorName }], update: { key: true } },
            { field: localFields.deployment, label: 'Deployment Type', formType: SELECT, placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: false, tip: 'Deployment type (kubernetes or docker)' },
            { field: localFields.ipAccess, label: 'IP Access', formType: SELECT, placeholder: 'Select IP Access', visible: true, update: false, tip: 'IpAccess indicates the type of RootLB that Developer requires for their App' },
            { field: localFields.autoScalePolicyName, label: 'Auto Scale Policy', formType: SELECT, placeholder: 'Select Auto Scale Policy', visible: true, update: { id: ['18'] } },
            { field: localFields.network, label: 'Network', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE_GROUP, placeholder: 'Select Network', visible: true },
            { field: localFields.flavorName, label: 'Flavor', formType: this.isUpdate ? SELECT : SELECT_RADIO_TREE_GROUP, placeholder: 'Select Flavor', rules: { required: true, copy: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }], tip: 'FlavorKey uniquely identifies a Flavor' },
            { field: localFields.numberOfMasters, label: 'Number of Masters', formType: INPUT, placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1, tip: 'Number of k8s masters (In case of docker deployment, this field is not required)' },
            { field: localFields.numberOfNodes, label: 'Number of Workers', formType: INPUT, placeholder: 'Enter Number of Workers', rules: { type: 'number' }, visible: false, update: { id: ['14'] }, tip: 'Number of k8s nodes (In case of docker deployment, this field is not required)' },
            { field: localFields.sharedVolumeSize, label: 'Shared Volume Size', formType: INPUT, placeholder: 'Enter Shared Volume Size', unit: 'GB', rules: { type: 'number' }, visible: false, update: false, tip: 'Size of an optional shared volume to be mounted on the master' },
            { field: localFields.reservable, label: 'Reservable', formType: SWITCH, visible: true, roles: [perpetual.ADMIN_MANAGER], value: false, update: false, tip: 'For reservable MobiledgeX ClusterInsts, the current developer tenant' },
        ]
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            this.organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
        }

        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.field === localFields.network) {
                    form.visible = data[localFields.network] !== undefined
                }
                form.value = data[form.field]
                this.checkForms(form, forms, true, data)
            }
        }

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
        this.props.handleViewMode(HELP_CLUSTER_INST_REG)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));