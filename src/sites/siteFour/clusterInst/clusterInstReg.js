import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, formattedData, MAIN_HEADER } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/tab/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization, updateFields } from '../../../services/model/format';
//model
import { createClusterInst, updateClusterInst } from '../../../services/model/clusterInstance';
import { getOrganizationList } from '../../../services/model/organization';
import { getOrgCloudletList } from '../../../services/model/cloudlet';
import { getFlavorList } from '../../../services/model/flavor';
import { getPrivacyPolicyList } from '../../../services/model/privacyPolicy';
import { getAutoScalePolicyList } from '../../../services/model/autoScalePolicy';
//Map
import Map from "../../../hoc/maps/MexMap"
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { clusterInstTutor } from "../../../tutorial";

import * as clusterFlow from '../../../hoc/mexFlow/appFlow'
import { Grid } from 'semantic-ui-react';
const MexFlow = React.lazy(() => import('../../../hoc/mexFlow/MexFlow'));

const clusterInstSteps = clusterInstTutor();

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
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.organizationList = []
        this.cloudletList = []
        this.flavorList = []
        this.privacyPolicyList = []
        this.autoScalePolicyList = []
        this.ipAccessList = [constant.IP_ACCESS_DEDICATED, constant.IP_ACCESS_SHARED]
        this.updateFlowDataList = []
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

    getFlavorInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.flavorList = [...this.flavorList, ...await getFlavorList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getPrivacyPolicy = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.privacyPolicyList = [...this.privacyPolicyList, ...await getPrivacyPolicyList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    getAutoScalePolicy = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.autoScalePolicyList = [...this.autoScalePolicyList, ...await getAutoScalePolicyList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.setState({ region: region })
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
            else if (form.field === fields.privacyPolicyName) {
                if (isInit === undefined || isInit === false) {
                    this.getPrivacyPolicy(region, form, forms)
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

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.privacyPolicyName) {
                this.updateUI(form)
                this.setState({ forms: forms })
            }
            else if (form.field === fields.autoScalePolicyName) {
                this.updateUI(form)
                this.setState({ forms: forms })
            }
        }
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

    deploymentValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.numberOfMasters) {
                form.value = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? 1 : undefined
                form.visible = currentForm.value !== constant.DEPLOYMENT_TYPE_DOCKER
            }
            else if (form.field === fields.numberOfNodes || form.field === fields.sharedVolumeSize) {
                form.visible = currentForm.value !== constant.DEPLOYMENT_TYPE_DOCKER
            }
            else if (form.field === fields.autoScalePolicyName) {
                form.visible = currentForm.value !== constant.DEPLOYMENT_TYPE_DOCKER
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    ipAccessValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.privacyPolicyName) {
                form.value = undefined
                form.visible = currentForm.value === constant.IP_ACCESS_DEDICATED ? true : false
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
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
        this.setState({
            mapData: mapData
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
            this.setState({ forms: forms })
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
            this.ipAccessValueChange(form, forms, isInit)
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
                this.setState({ flowDataList: flowDataList, activeIndex: 1 })
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
            let forms = this.state.forms
            let cloudlets = data[fields.cloudletName];
            if (this.props.isUpdate) {
                let updateFieldList = updateFields(this, forms, data, this.props.data)
                if (updateFieldList.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    data[fields.fields] = updateFieldList
                    updateClusterInst(this, data, this.onCreateResponse)
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
                <Map locData={this.state.mapData} id={'ClusterInst'} reg='cloudletAndClusterMap' region={this.state.region}></Map>
            </div>
        )

    saveFlowInstance = (data) => {
        this.setState({ flowInstance: data })
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
        { label: 'Cloudlet Locations', tab: this.getMap(), onClick: () => { this.setState({ activeIndex: 0 }) } },
        { label: 'Graph', tab: this.getGraph(), onClick: () => { this.setState({ activeIndex: 1 }) } }
    ])
    /**
     * Tab block
     */

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


    render() {
        return (
            <div className="round_panel">
                <Grid style={{ display: 'flex' }}>
                    <Grid.Row>
                        <Grid.Column width={8} style={{ overflow: 'auto', height: '90vh' }}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid.Column>
                        <Grid.Column width={8} style={{ borderRadius: 5, backgroundColor: 'transparent' }}>
                            <MexTab form={{ panes: this.getPanes() }} activeIndex={this.state.activeIndex} />
                        </Grid.Column>
                    </Grid.Row>
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
                        case fields.privacyPolicyName:
                            form.options = this.privacyPolicyList
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

            this.setState({ mapData: [cloudlet] })

            let flavor = {}
            flavor[fields.region] = data[fields.region]
            flavor[fields.flavorName] = data[fields.flavorName]
            this.flavorList = [flavor]
            this.privacyPolicyList = await getPrivacyPolicyList(this, { region: data[fields.region] })
            this.autoScalePolicyList = await getAutoScalePolicyList(this, { region: data[fields.region] })
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Cluster Instances`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.clusterName, label: 'Cluster Name', formType: 'Input', placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, },
            { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, visible: true, value: getOrganization() },
            { field: fields.operatorName, label: 'Operator', formType: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.cloudletName, label: 'Cloudlet', formType: 'MultiSelect', placeholder: 'Select Cloudlet', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 4, field: fields.operatorName }] },
            { field: fields.deployment, label: 'Deployment Type', formType: 'Select', placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: false, tip: 'Deployment type (kubernetes or docker)' },
            { field: fields.ipAccess, label: 'IP Access', formType: 'Select', placeholder: 'Select IP Access', visible: true, update: false, tip: 'IpAccess indicates the type of RootLB that Developer requires for their App' },
            { field: fields.privacyPolicyName, label: 'Privacy Policy', formType: 'Select', placeholder: 'Select Privacy Policy', visible: false, update: false, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.organizationName }], update: true, updateId: ['24'] },
            { field: fields.autoScalePolicyName, label: 'Auto Scale Policy', formType: 'Select', placeholder: 'Select Auto Scale Policy', visible: true, update: false, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.organizationName }], update: true, updateId: ['18'] },
            { field: fields.flavorName, label: 'Flavor', formType: 'Select', placeholder: 'Select Flavor', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'FlavorKey uniquely identifies a Flavor' },
            { field: fields.numberOfMasters, label: 'Number of Masters', formType: 'Input', placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1, update: true, tip: 'Number of k8s masters (In case of docker deployment, this field is not required)' },
            { field: fields.numberOfNodes, label: 'Number of Workers', formType: 'Input', placeholder: 'Enter Number of Workers', rules: { type: 'number' }, visible: false, update: true, updateId: ['14'], tip: 'Number of k8s nodes (In case of docker deployment, this field is not required)' },
            { field: fields.sharedVolumeSize, label: 'Shared Volume Size', formType: 'Input', placeholder: 'Enter Shared Volume Size', unit: 'GB', rules: { type: 'number' }, visible: false, update: false, update: true, updateId: ['23'], tip: 'Size of an optional shared volume to be mounted on the master' },
            { field: fields.reservable, label: 'Reservable', formType: 'Checkbox', visible: true, roles: ['AdminManager'], value: false, update: true, tip: 'For reservable MobiledgeX ClusterInsts, the current developer tenant' },
        ]
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            this.organizationList = await getOrganizationList(this)
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

        this.setState({
            forms: forms
        })

        if (this.isUpdate) {
            this.setState({
                showGraph: true,
                flowDataList: this.updateFlowDataList
            })
        }

    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode(clusterInstSteps.stepsClusterInstReg)
    }
};

const mapStateToProps = (state) => {

    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region
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
