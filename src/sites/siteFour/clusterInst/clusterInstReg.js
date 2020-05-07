import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
//Mex
import MexForms, { SELECT, MULTI_SELECT } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization } from '../../../services/model/format';
//model
import { createClusterInst, updateClusterInst } from '../../../services/model/clusterInstance';
import { getOrganizationList } from '../../../services/model/organization';
import { getOrgCloudletList } from '../../../services/model/cloudlet';
import { getFlavorList } from '../../../services/model/flavor';
import { getPrivacyPolicyList } from '../../../services/model/privacyPolicy';
//Map
import Map from '../../../libs/simpleMaps/with-react-motion/index_clusters';
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { object } from 'prop-types';

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
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
        this.ipAccessList = [constant.IP_ACCESS_DEDICATED, constant.IP_ACCESS_SHARED]
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
        if(region && organizationName)
        {
            this.cloudletList = await getOrgCloudletList(this, { region: region, org:organizationName })
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
        this.requestedRegionList.push(region)
    }

    organizationValueChange = (currentForm, forms, isInit) =>{
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
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_DOCKER ? false : true
            }
            else if (form.field === fields.numberOfNodes) {
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_DOCKER ? false : true
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

    checkForms = (form, forms, isInit) => {
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
        }
        else if (form.field === fields.ipAccess) {
            this.ipAccessValueChange(form, forms, isInit)
        }
        else if (form.field === fields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
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
            let labels = [{label : 'Cloudlet', field : fields.cloudletName}]
            this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
        }
    }

    onCreate = async (data) => {
        if (data) {
            let cloudlets = data[fields.cloudletName];
            if (this.props.isUpdate) {
                this.props.handleLoadingSpinner(true)
                updateClusterInst(this, data, this.onCreateResponse)
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
                <Map locData={this.state.mapData} id={'ClusterInst'} reg='cloudletAndClusterMap' zoomControl={{ center: [0, 0], zoom: 1.5 }}></Map>
            </div>
        )

    getPanes = () => ([
        { label: 'Cloudlets', tab: this.getMap() }
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
                <div className="grid_table" style={{ height: constant.getHeight(), overflow: 'auto' }}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <MexTab form={{ panes: this.getPanes() }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
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
        }
    }

    formKeys = () => {
        return [
            { label: 'Create Cluster Instances', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.clusterName, label: 'Cluster Name', formType: 'Input', placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, },
            { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: true, disabled: getOrganization() ? true : false }, visible: true, value: getOrganization() },
            { field: fields.operatorName, label: 'Operator', formType: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.cloudletName, label: 'Cloudlet', formType: 'MultiSelect', placeholder: 'Select Cloudlet', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 4, field: fields.operatorName }] },
            { field: fields.deployment, label: 'Deployment Type', formType: 'Select', placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: true },
            { field: fields.ipAccess, label: 'IP Access', formType: 'Select', placeholder: 'Select IP Access', visible: true, update: true },
            { field: fields.privacyPolicyName, label: 'Privacy Policy', formType: 'Select', placeholder: 'Select Privacy Policy Name', visible: false, update: true, dependentData: [{ index: 1, field: fields.region }, { index: 3, field: fields.organizationName }] },
            { field: fields.flavorName, label: 'Flavor', formType: 'Select', placeholder: 'Select Flavor', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.numberOfMasters, label: 'Number of Masters', formType: 'Input', placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1, update: true },
            { field: fields.numberOfNodes, label: 'Number of Workers', formType: 'Input', placeholder: 'Enter Number of Workers', rules: { type: 'number' }, visible: false, update: true },
            { field: fields.reservable, label: 'Reservable', formType: 'Checkbox', visible: true, roles: ['AdminManager'], value: false, update: true },
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
                this.checkForms(form, forms, true)
            }
        }

        this.setState({
            forms: forms
        })

    }

    componentDidMount() {
        this.getFormData(this.props.data)
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));