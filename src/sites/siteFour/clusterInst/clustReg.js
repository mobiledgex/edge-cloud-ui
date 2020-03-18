import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item, Grid } from 'semantic-ui-react';
import MexForms from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import ClustersMap from '../../../libs/simpleMaps/with-react-motion/index_clusters';
import {fields} from '../../../services/model/format'

//model

import * as serverData from '../../../services/model/serverData';
import {showOrganizations} from '../../../services/model/organization';
import {showCloudlets} from '../../../services/model/cloudlet';
import {showFlavors} from '../../../services/model/flavor';
import {showPrivacyPolicies} from '../../../services/model/privacyPolicy';

const DEPLOYMENT_TYPE_DOCKER = 'docker';
const DEPLOYMENT_TYPE_KUBERNETES = 'kubernetes';
const IP_ACCESS_DEDICATED = 'Dedicated';
const IP_ACCESS_SHARED = 'Shared';


class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapData: [],
            forms: [],
            dialogMessage: [],
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
        this.flavorList = []
        this.privacyPolicyList = []
        this.requestedRegionList = [];
        this.wsRequestCount = 0;
        this.wsRequestResponse = [];
    }

    getIpAccess = (key) => {
        switch (key) {
            case IP_ACCESS_DEDICATED:
                return 1
            case IP_ACCESS_SHARED:
                return 3
            case 1:
                return IP_ACCESS_DEDICATED
            case 3:
                return IP_ACCESS_SHARED
            default:
                return
        }
    }

    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            if (dataList[0].isDefault) {
                form.value = dataList[0][form.field];
                let rules = form.rules ? form.rules : {}
                rules.disabled = true;
                form.rules = rules;
            }
            return dataList.map(data => {
                let info = form ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
    }

    getSelectData = (currentForm, dataList, dataType) => {
        if (dataList && dataList.length > 0) {
            let filteredList = []
            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                if (data[currentForm.field] === currentForm.value) {
                    filteredList.push(data[dataType])
                }
            }
            filteredList = [...new Set(filteredList)];
            return this.getOptions(filteredList);
        }
    }

    updateOptions = (currentForm, forms, data) => {
        let isFormChanged = false;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (currentForm.field === fields.region) {
                if (form.field === fields.operatorName) {
                    form.options = this.getSelectData(currentForm, this.cloudletList, form.field)
                    form.value = data ? data[form.field] : null
                    this.updateOptions(form, forms, data)
                }
                else if (form.field === fields.flavorName) {
                    form.options = this.getSelectData(currentForm, this.flavorList, form.field)
                    form.value = data ? data[form.field] : null
                }
                else if (form.field === fields.privacyPolicyName) {
                    form.options = this.getSelectData(currentForm, this.privacyPolicyList, form.field)
                    form.value = data ? data[form.field] : null
                }
                isFormChanged = true
            }
            else if (currentForm.field === fields.operatorName) {
                if (form.field === fields.cloudletName) {
                    this.setState({ mapData: [] })
                    form.options = this.getSelectData(currentForm, this.cloudletList, form.field)
                    form.value = data ? data[form.field] : null
                    this.cloudletValueChange(form, forms)   
                }
                isFormChanged = true
            }
            else if (currentForm.field === fields.deployment) {
                if (form.field === fields.ipAccess) {
                    let IPAccessList = currentForm.value === DEPLOYMENT_TYPE_KUBERNETES ? [IP_ACCESS_DEDICATED, IP_ACCESS_SHARED] : [IP_ACCESS_DEDICATED];
                    form.options = this.getOptions(IPAccessList)
                    form.value = data ? data[form.field] : null
                }
                isFormChanged = true
            }
        }
        if (isFormChanged) {
            this.setState({
                forms: forms
            })
        }
    }

    getCloudletInfo = async (form, forms) => {
        this.cloudletList = [...this.cloudletList, ...await serverData.sendRequest(this, showCloudlets({ region: form.value }))]
        this.updateOptions(form, forms);
    }

    getFlavorInfo = async (form, forms, data) => {
        this.flavorList = [...this.flavorList, ...await serverData.sendRequest(this, showFlavors({ region: form.value }))]
        this.updateOptions(form, forms, data);
    }

    getPrivacyPolicy = async (form, forms, data) => {
        this.privacyPolicyList = [...this.privacyPolicyList, ...await serverData.sendRequest(this, showPrivacyPolicies({ region: form.value }))]
        this.updateOptions(form, forms, data);
    }

    getDependentDataFromServer = async (form, forms) => {
        if (form.field === fields.region && this.requestedRegionList) {
            if (!this.requestedRegionList.includes(form.value)) {
                this.requestedRegionList.push(form.value)
                this.getCloudletInfo(form, forms)
                this.getFlavorInfo(form, forms)
                this.getPrivacyPolicy(form, forms)
                return false;
            }
        }
        return true;
    }

    deploymentValueChange = (currentForm, forms) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.numberOfMasters || form.field === fields.numberOfNodes) {
                form.visible = currentForm.value === DEPLOYMENT_TYPE_DOCKER ? false : true
            }
        }

        this.setState({
            forms: forms
        })
    }

    IPAccessValueChange = (currentForm, forms) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.privacyPolicyName) {
                form.visible = currentForm.value === IP_ACCESS_DEDICATED ? true : false
            }
        }

        this.setState({
            forms: forms
        })
    }

    cloudletValueChange = (currentForm, forms) => {
        let mapData = [];
        let couldlets = this.cloudletList;
        for (let i = 0; i < couldlets.length; i++) {
            let cloudlet = couldlets[i];
            if (currentForm.value && currentForm.value.includes(cloudlet[fields.cloudletName])) {
                mapData.push({ CloudletLocation: cloudlet.CloudletLocation })
            }
        }
        this.setState({
            mapData: mapData
        })
    }

    onValueChange = (form) => {
        //To handle async request
        let forms = this.state.forms;
        let canUpdateOptions = this.getDependentDataFromServer(form, forms)
        if (canUpdateOptions) {
            this.updateOptions(form, forms);
        }

        if (form.field === fields.deployment) {
            this.deploymentValueChange(form, forms)
        }
        else if (form.field === fields.ipAccess) {
            this.IPAccessValueChange(form, forms)
        }
        else if (form.field === fields.cloudletName) {
            this.cloudletValueChange(form, forms)
        }
    }




    getForms = () => ([
        { label: 'Create Cluster Instance', type: 'Header' },
        { field: fields.region, label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
        { field: fields.clusterName, label: 'Cluster Name', type: 'Input', placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, },
        { field: fields.organizationName, label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible: true },
        { field: fields.operatorName, label: 'Operator', type: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true },
        { field: fields.cloudletName, label: 'Cloudlet', type: 'MultiSelect', placeholder: 'Select Cloudlet', rules: { required: true }, visible: true },
        { field: fields.deployment, label: 'Deployment Type', type: 'Select', placeholder: 'Select Deployment Type', rules: { required: true }, visible: true },
        { field: fields.ipAccess, label: 'IP Access', type: 'Select', placeholder: 'Select IP Access', visible: true },
        { field: fields.privacyPolicyName, label: 'Privacy Policy', type: 'Select', placeholder: 'Select Privacy Policy Name', visible: false },
        { field: fields.flavorName, label: 'Flavor', type: 'Select', placeholder: 'Select Flavor', rules: { required: true }, visible: true },
        { field: fields.numberOfMasters, label: 'Number of Masters', type: 'Input', placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1 },
        { field: fields.numberOfNodes, label: 'Number of Nodes', type: 'Input', placeholder: 'Enter Number of Nodes', rules: { type: 'number' }, visible: false, },
        { field: fields.reservable, label: 'Reservable', type: 'Checkbox', visible: true, roles: ['AdminManager'], value: false },
        { field: fields.reservedBy, label: 'Reserved By', type: 'Input', placeholder: 'Enter Reserved By', visible: true, roles: ['AdminManager'] },
    ])

    getMap = () =>
        (
            <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
                <ClustersMap parentProps={{ locData: this.state.mapData, reg: 'cloudletAndClusterMap', zoomIn: () => console.log('zoomin'), zoomOut: () => console.log('zoomout'), resetMap: () => console.log('resetmap') }} icon={'cloudlet'} zoomControl={{ center: [0, 0], zoom: 1.5 }}></ClustersMap>
            </div>
        )

    getPanes = () => ([
        { label: 'Cloudlets', tab: this.getMap() }
    ])

    /***
     * Map values from form to field
     * ***/
    formattedData = () => {
        let forms = this.state.forms;
        let data = {};
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field && form.visible) {
                data[form.field] = form.value;
            }
        }
        return data
    }

    closeDialog = () => {
        this.setState({
            dialogMessage: []
        })
        this.props.handleLoadingSpinner(false);
    }

    onCreateResponse = (mcRequest) => {
        this.wsRequestCount = this.wsRequestCount - 1;
        let messageArray = [];
        if (mcRequest) {
            this.wsRequestResponse.push(mcRequest);
            if (this.wsRequestCount === 0) {
                this.props.handleLoadingSpinner(false);
                let valid = true;
                this.wsRequestResponse.map(mcRequest => {
                    let method = mcRequest.request.method;
                    let data = mcRequest.response.data
                    messageArray.push(method + ':' + data.data.message)
                    if (data.code !== 200) {
                        valid = false;
                    }
                })
                if (valid) {
                    this.setState({ errorClose: true })
                }
                else {
                    this.setState({
                        dialogMessage: messageArray
                    })
                }
            }
        }
    }

    onUpdate = async ()=>{
        let data = this.formattedData();
        let requestData = {
            region: data[fields.region],
            clusterinst: {
                key: {
                    cluster_key: { name: data[fields.clusterName] },
                    cloudlet_key: { operator_key: { name: data[fields.operatorName] }, name: data[fields.cloudletName] },
                    developer: data[fields.organizationName]
                },
                deployment: data[fields.deployment],
                flavor: { name: data[fields.flavorName] },
                ip_access: parseInt(this.getIpAccess(data[fields.ipAccess])),
                reservable: data[fields.reservable],
                reserved_by: data[fields.reservedBy],
                num_masters: parseInt(data[fields.numberOfMasters]),
                num_nodes: parseInt(data[fields.numberOfNodes]),
            }
        }
        //serverData.updateClusterInst(this, requestData, this.onCreateResponse)
    }

    onCreate = async () => {
        if (this.props.action === 'Update') {
            this.onUpdate()
        }
        else {
        this.wsRequestResponse = [];
            let data = this.formattedData();
            if (data) {

                let cloudlets = data[fields.cloudletName];
                if (cloudlets && cloudlets.length > 0) {
                    this.wsRequestCount = cloudlets.length;
                    this.props.handleLoadingSpinner(true);
                    for (let i = 0; i < this.wsRequestCount; i++) {
                        let cloudlet = cloudlets[i];
                        let requestData = {
                            region: data[fields.region],
                            clusterinst: {
                                key: {
                                    cluster_key: { name: data[fields.clusterName] },
                                    cloudlet_key: { operator_key: { name: data[fields.operatorName] }, name: cloudlet },
                                    developer: data[fields.organizationName]
                                },
                                deployment: data[fields.deployment],
                                flavor: { name: data[fields.flavorName] },
                                ip_access: parseInt(this.getIpAccess(data[fields.ipAccess])),
                                reservable: data[fields.reservable],
                                reserved_by: data[fields.reservedBy],
                                num_masters: parseInt(data[fields.numberOfMasters]),
                                num_nodes: parseInt(data[fields.numberOfNodes]),
                            }
                        }
                        //serverData.createClusterInst(requestData, this.onCreateResponse)
                    }
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


    render() {
        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <div className="round_panel" style={{ width: '100%', height: '100%' }}>
                                <div className="grid_table" style={{ overflow: 'auto' }}>
                                    <Item className='content create-org' style={{ margin: 10 }}>
                                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                                    </Item>
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <MexTab form={{ panes: this.getPanes() }} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }

    gotoUrl(site, subPath) {
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: site, subPath: subPath })
        this.setState({ page: subPath })
    }

    onAddCancel = () => {
        this.gotoUrl('site4', 'pg=4')
    }

    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region || field === fields.clusterName || field === fields.operatorName || field === fields.cloudletName) {
            rules.disabled = true;
        }
    }

    updateExistingData = (forms, form, data) => {
        if (data) {
            form.value = data[form.field] ? data[form.field] : form.value
            switch (form.field) {
                case fields.region:
                    this.cloudletList = [{ Region: data[fields.region], CloudletName: data[fields.cloudletName], Operator: data[fields.operatorName], CloudletLocation:data[fields.cloudletLocation] }]
                    this.getFlavorInfo(form, forms, data)
                    this.getPrivacyPolicy(form, forms, data)
                    this.updateOptions(form, forms, data)
                    break;
                case fields.deployment:
                    this.updateOptions(form, forms, data)
                    this.deploymentValueChange(form, forms)
                    break;
                case fields.cloudletName:
                    form.type = 'Select'
                    this.cloudletValueChange(form,forms)
                    break;
                case fields.ipAccess:
                    form.value = this.getIpAccess(data[form.field])
                    this.IPAccessValueChange(form, forms)
                    break;
                case fields.reservable:
                    form.value = data[form.field] === 'YES' ? true : false
                    break;
                default:
                    form = form;
            }
            this.disableFields(form)
        }
    }

    loadData(forms, data) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.type === 'Select') {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.getOptions(this.organizationList, form)
                            break;
                        case fields.region:
                            form.options = this.getOptions(this.regions);
                            break;
                        case fields.deployment:
                            form.options = this.getOptions([DEPLOYMENT_TYPE_DOCKER, DEPLOYMENT_TYPE_KUBERNETES]);
                            break;
                        default:
                            form.options = form.options;
                    }
                }
                this.updateExistingData(forms, form, data)
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.getForms();
        forms.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Cluster Instance`, type: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', type: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            this.loadData(forms, data)
        }
        else {
            this.organizationList = await serverData.sendRequest(this, showOrganizations())
            this.loadData(forms)
        }

        this.setState({
            forms: forms
        })

    }

    componentDidMount() {
        this.setState({
            forms: this.getForms()
        })
        this.getFormData(this.props.data)
    }

    componentWillUnmount() {
        if (this.props.childPage) {
            this.props.childPage(null)
        }
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
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));
