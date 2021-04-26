import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, SWITCH, formattedData, MAIN_HEADER, INPUT } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/tab/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { DEVELOPER, fields, getOrganization, updateFieldData } from '../../../services/model/format';
//model
import * as serverData from '../../../services/model/serverData'
import { createClusterInst, updateClusterInst } from '../../../services/model/clusterInstance';
import { getOrganizationList } from '../../../services/model/organization';
import { showCloudlets, cloudletWithInfo } from '../../../services/model/cloudlet';
import { showCloudletInfoData } from '../../../services/model/cloudletInfo';
import { getFlavorList } from '../../../services/model/flavor';
import { getAutoScalePolicyList, showAutoScalePolicies } from '../../../services/model/autoScalePolicy';
//Map
import ListMexMap from "../../../container/map/ListMexMap"
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { HELP_CLUSTER_INST_REG } from "../../../tutorial";

import * as clusterFlow from '../../../hoc/mexFlow/appFlow'
import { SHOW_AUTO_SCALE_POLICY } from '../../../services/model/endPointTypes';
import { sendRequests } from '../../../services/model/serverWorker'
import { Grid } from '@material-ui/core';

const MexFlow = React.lazy(() => import('../../../hoc/mexFlow/MexFlow'));

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
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.organizationList = []
        this.cloudletList = []
        this.flavorList = []
        this.autoScalePolicyList = []
        this.ipAccessList = [constant.IP_ACCESS_DEDICATED, constant.IP_ACCESS_SHARED]
        this.updateFlowDataList = []
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
            if (tempForm.field === fields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === fields.organizationName) {
                organizationName = tempForm.value
            }
        }
        if (region && organizationName) {
            let requestList = []
            let requestData = { region: region, org: organizationName, type: DEVELOPER.toLowerCase() }
            requestList.push(showCloudlets(requestData))
            requestList.push(showCloudletInfoData(requestData))
            this.props.handleLoadingSpinner(true)
            sendRequests(this, requestList).addEventListener('message', event => {
                let mcList = event.data
                this.cloudletList = cloudletWithInfo(mcList)
                this.props.handleLoadingSpinner(false)
                this.updateUI(form)
                this.updateState({ forms })
            });
        }
    }

    getFlavorInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.flavorList = [...this.flavorList, ...await getFlavorList(this, { region: region })]
        }
        this.updateUI(form)
        this.updateState({ forms })
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
                if (form.field === fields.operatorName) {
                    this.operatorValueChange(form, forms, isInit)
                    if (isInit === undefined || isInit === false) {
                        this.getCloudletInfo(form, forms)
                    }
                }
                else if (form.field === fields.flavorName) {
                    if (isInit === undefined || isInit === false) {
                        this.getFlavorInfo(region, form, forms)
                    }
                }
                else if (form.field === fields.autoScalePolicyName) {
                    if (isInit === undefined || isInit === false) {
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
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.autoScalePolicyName) {
                this.updateUI(form)
                this.updateState({ forms })
            }
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (isInit === undefined || isInit === false) {
                    this.updateState({ forms, mapData: [] })
                }
                break;
            }
        }
    }

    deploymentValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.numberOfMasters) {
                form.value = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? 1 : undefined
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_DOCKER ? false : true
            }
            else if (form.field === fields.numberOfNodes || form.field === fields.sharedVolumeSize) {
                form.value = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? form.value : undefined
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_DOCKER ? false : true
            }
            else if (form.field === fields.autoScalePolicyName) {
                form.visible = currentForm.value !== constant.DEPLOYMENT_TYPE_DOCKER
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
    }

    cloudletValueChange = (form, forms) => {
        let mapData = [];
        let couldlets = this.cloudletList;
        for (let i = 0; i < couldlets.length; i++) {
            let cloudlet = couldlets[i];
            if (form.value && form.value.includes(cloudlet[fields.cloudletName])) {
                mapData.push(cloudlet)
            }
        }
        this.updateState({
            mapData
        })
    }

    reservableChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.ipAccess) {
                form.value = currentForm.value ? constant.IP_ACCESS_DEDICATED : form.value
                form.rules.disabled = currentForm.value
            }
        }
        if (isInit === undefined || isInit === false) {
            this.updateState({ forms })
        }
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
        else if (form.field === fields.deployment) {
            this.deploymentValueChange(form, forms, isInit)
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(clusterFlow.deploymentTypeFlow(finalData))
            flowDataList.push(clusterFlow.ipAccessFlow({}))
        }
        else if (form.field === fields.ipAccess) {
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(clusterFlow.ipAccessFlow(finalData))
        }
        else if (form.field === fields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === fields.reservable) {
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
            let labels = [{ label: 'Cloudlet', field: fields.cloudletName }]
            this.updateState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            let cloudlets = data[fields.cloudletName];
            if (this.props.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateClusterInst(this, updateData, this.onCreateResponse)
                }

            }
            else {
                if (cloudlets && cloudlets.length > 0) {
                    for (let i = 0; i < cloudlets.length; i++) {
                        let cloudlet = cloudlets[i];
                        data[fields.cloudletName] = cloudlet;
                        this.props.handleLoadingSpinner(true)
                        createClusterInst(this, Object.assign({}, data), this.onCreateResponse)
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
            <ListMexMap dataList={this.state.mapData} id={constant.PAGE_CLUSTER_INSTANCES} region={this.state.region} register={true}/>
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
                    <Grid item xs={6}>
                        <div className="round_panel">
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{ borderRadius: 5, backgroundColor: 'transparent' }}>
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.regions;
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
                        case fields.deployment:
                            form.options = [constant.DEPLOYMENT_TYPE_DOCKER, constant.DEPLOYMENT_TYPE_KUBERNETES]
                            break;
                        case fields.autoScalePolicyName:
                            form.options = this.autoScalePolicyList
                            break;
                        case fields.ipAccess:
                            form.options = this.ipAccessList;
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
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]

            let cloudlet = {}
            cloudlet[fields.region] = data[fields.region]
            cloudlet[fields.cloudletName] = data[fields.cloudletName]
            cloudlet[fields.operatorName] = data[fields.operatorName]
            cloudlet[fields.cloudletLocation] = data[fields.cloudletLocation]
            this.cloudletList = [cloudlet]

            this.updateState({ mapData: [cloudlet] })

            let flavor = {}
            flavor[fields.region] = data[fields.region]
            flavor[fields.flavorName] = data[fields.flavorName]
            this.flavorList = [flavor]

            let requestTypeList = []
            if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES) {
                requestTypeList.push(showAutoScalePolicies({ region: data[fields.region] }))
            }

            let mcRequestList = await serverData.showSyncMultiData(this, requestTypeList)
            if (mcRequestList && mcRequestList.length > 0) {
                for (let i = 0; i < mcRequestList.length; i++) {
                    let mcRequest = mcRequestList[i];
                    let request = mcRequest.request;
                    if (request.method === SHOW_AUTO_SCALE_POLICY) {
                        this.autoScalePolicyList = mcRequest.response.data
                    }
                }
            }
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Cluster Instances`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.clusterName, label: 'Cluster Name', formType: INPUT, placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Developer', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, visible: true, value: getOrganization(), update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], update: { key: true } },
            { field: fields.cloudletName, label: 'Cloudlet', formType: this.isUpdate ? SELECT : MULTI_SELECT, placeholder: 'Select Cloudlet', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 4, field: fields.operatorName }], update: { key: true } },
            { field: fields.deployment, label: 'Deployment Type', formType: SELECT, placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: false, tip: 'Deployment type (kubernetes or docker)' },
            { field: fields.ipAccess, label: 'IP Access', formType: SELECT, placeholder: 'Select IP Access', visible: true, update: false, tip: 'IpAccess indicates the type of RootLB that Developer requires for their App' },
            { field: fields.autoScalePolicyName, label: 'Auto Scale Policy', formType: SELECT, placeholder: 'Select Auto Scale Policy', visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.organizationName }], update: { id: ['18'] } },
            { field: fields.flavorName, label: 'Flavor', formType: SELECT, placeholder: 'Select Flavor', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'FlavorKey uniquely identifies a Flavor' },
            { field: fields.numberOfMasters, label: 'Number of Masters', formType: INPUT, placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1, tip: 'Number of k8s masters (In case of docker deployment, this field is not required)' },
            { field: fields.numberOfNodes, label: 'Number of Workers', formType: INPUT, placeholder: 'Enter Number of Workers', rules: { type: 'number' }, visible: false, update: { id: ['14'] }, tip: 'Number of k8s nodes (In case of docker deployment, this field is not required)' },
            { field: fields.sharedVolumeSize, label: 'Shared Volume Size', formType: INPUT, placeholder: 'Enter Shared Volume Size', unit: 'GB', rules: { type: 'number' }, visible: false, update: false, tip: 'Size of an optional shared volume to be mounted on the master' },
            { field: fields.reservable, label: 'Reservable', formType: SWITCH, visible: true, roles: ['AdminManager'], value: false, update: false, tip: 'For reservable MobiledgeX ClusterInsts, the current developer tenant' },
        ]
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            this.organizationList = await getOrganizationList(this, {type:constant.DEVELOPER})
        }

        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
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

    componentWillUnmount(){
        this._isMounted = false
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