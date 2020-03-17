import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
//Mex
import MexForms from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
//model
import * as serverData from '../../../services/model/serverData';
import { formKeys, createClusterInst } from '../../../services/model/clusterInstance';
import { showOrganizations } from '../../../services/model/organization';
import { showCloudlets } from '../../../services/model/cloudlet';
import { showFlavors } from '../../../services/model/flavor';
import { showPrivacyPolicies } from '../../../services/model/privacyPolicy';
//Map
import Map from '../../../libs/simpleMaps/with-react-motion/index_clusters_new';
import MexMultiStepper, {updateStepper} from '../../../hoc/stepper/mexMessageMultiStream'

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray:[],
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.organizationList = []
        this.cloudletList = []
        this.flavorList = []
        this.privacyPolicyList = []
    }

    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            let data = dataList[0];
            if (data && data.isDefault) {
                form.value = data[form.field];
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

    deploymentValueChange = (currentForm, forms) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field === fields.numberOfMasters || form.field === fields.numberOfNodes) {
                form.visible = currentForm.value === constant.DEPLOYMENT_TYPE_DOCKER ? false : true
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
                form.value = undefined
                form.visible = currentForm.value === constant.IP_ACCESS_DEDICATED ? true : false
            }
        }

        this.setState({
            forms: forms
        })
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

    updateUIOptions = (currentForm, forms, data) => {
        let updateForm = false;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (currentForm.field === fields.region) {
                if (form.field === fields.operatorName) {
                    form.options = this.getSelectData(currentForm, this.cloudletList, form.field)
                    form.value = data ? data[form.field] : null
                    this.updateUIOptions(form, forms, data)
                }
                else if (form.field === fields.flavorName) {
                    form.options = this.getSelectData(currentForm, this.flavorList, form.field)
                    form.value = data ? data[form.field] : null
                }
                else if (form.field === fields.privacyPolicyName) {
                    form.options = this.getSelectData(currentForm, this.privacyPolicyList, form.field)
                    form.value = data ? data[form.field] : null
                }
                updateForm = true
            }
            else if (currentForm.field === fields.operatorName) {
                if (form.field === fields.cloudletName) {
                    this.setState({ mapData: [] })
                    form.options = this.getSelectData(currentForm, this.cloudletList, form.field)
                    form.value = data ? data[form.field] : null
                    this.cloudletValueChange(form, forms)
                }
                updateForm = true
            }
            else if (currentForm.field === fields.deployment) {
                if (form.field === fields.ipAccess) {
                    let IPAccessList = currentForm.value === constant.DEPLOYMENT_TYPE_KUBERNETES ? [constant.IP_ACCESS_DEDICATED, constant.IP_ACCESS_SHARED] : [constant.IP_ACCESS_DEDICATED];
                    form.options = this.getOptions(IPAccessList)
                    form.value = data ? data[form.field] : null
                }
                updateForm = true
            }
        }

        if (updateForm) {
            this.setState({
                forms: forms
            })
        }
    }

    getCloudletInfo = async (form, forms) => {
        this.cloudletList = [...this.cloudletList, ...await serverData.showDataFromServer(this, showCloudlets({ region: form.value }))]
        this.updateUIOptions(form, forms);
    }

    getFlavorInfo = async (form, forms, data) => {
        this.flavorList = [...this.flavorList, ...await serverData.showDataFromServer(this, showFlavors({ region: form.value }))]
        this.updateUIOptions(form, forms, data);
    }

    getPrivacyPolicy = async (form, forms, data) => {
        this.privacyPolicyList = [...this.privacyPolicyList, ...await serverData.showDataFromServer(this, showPrivacyPolicies({ region: form.value }))]
        this.updateUIOptions(form, forms, data);
    }

    getOptionsFromServer = (currentFrom, forms) => {
        let updateOptionUI = true
        if (currentFrom.field === fields.region && this.requestedRegionList) {
            if (!this.requestedRegionList.includes(currentFrom.value)) {
                this.requestedRegionList.push(currentFrom.value)
                this.getCloudletInfo(currentFrom, forms)
                this.getFlavorInfo(currentFrom, forms)
                this.getPrivacyPolicy(currentFrom, forms)
                updateOptionUI = false
            }
        }
        return updateOptionUI
    }
    /**Required */
    onValueChange = (form) => {
        let forms = this.state.forms;
        if (this.getOptionsFromServer(form, forms)) {
            this.updateUIOptions(form, forms);
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



    /***
     * Map values from form to field
     * ***/
    formattedData = () => {
        let data = {};
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.forms) {
                    data[form.uuid] = {};
                    let subForms = form.forms
                    for (let j = 0; j < subForms.length; j++) {
                        let subForm = subForms[j];
                        data[form.uuid][subForm.field] = subForm.value;
                    }

                }
                else {
                    data[form.field] = form.value;
                }
            }
        }
        return data
    }

    onCreateResponse = (mcRequest) => {
        if (mcRequest) {
            let data = undefined;
            let request = mcRequest.request;
            let cloudletName = request.data.clusterinst.key.cloudlet_key.name;
            if(mcRequest.response && mcRequest.response.data)
            {
                data  = mcRequest.response.data;
            }
            this.setState({stepsArray:updateStepper(this.state.stepsArray, cloudletName, data)})
        }
    }

    onCreate = async () => {
        let data = this.formattedData()
        if (data) {
            let cloudlets = data[fields.cloudletName];
            if (cloudlets && cloudlets.length > 0) {
                for (let i = 0; i < cloudlets.length; i++) {
                    let cloudlet = cloudlets[i];
                    data[fields.cloudletName] = cloudlet;
                    serverData.sendWSRequest(createClusterInst(data), this.onCreateResponse)
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
            stepsArray:[]
        })
        this.props.onClose(true)
    }


    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ height: '100%', overflow: 'auto' }}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <MexTab form={{ panes: this.getPanes() }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose}/>
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }



    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region || field === fields.clusterName || field === fields.operatorName || field === fields.cloudletName || field === fields.flavorName) {
            rules.disabled = true;
        }
    }

    updateExistingData = (forms, form, data) => {
        if (data) {
            form.value = data[form.field] ? data[form.field] : form.value
            switch (form.field) {
                case fields.region:
                    let cloudlet = {}
                    cloudlet[fields.region] =  data[fields.region]
                    cloudlet[fields.cloudletName] = data[fields.cloudletName]
                    cloudlet[fields.operatorName] = data[fields.operatorName]
                    cloudlet[fields.cloudletLocation] =data[fields.cloudletLocation]
                    this.cloudletList = [cloudlet]
                    this.getFlavorInfo(form, forms, data)
                    this.getPrivacyPolicy(form, forms, data)
                    this.updateUIOptions(form, forms, data)
                    break;
                case fields.deployment:
                    this.updateUIOptions(form, forms, data)
                    this.deploymentValueChange(form, forms)
                    break;
                case fields.cloudletName:
                    form.type = constant.SELECT
                    this.cloudletValueChange(form,forms)
                    break;
                case fields.ipAccess:
                    form.value = constant.IPAccessLabel(data[form.field])
                    this.IPAccessValueChange(form, forms)
                    break;
                case fields.reservable:
                    form.value = data[form.field] === constant.YES ? true : false
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
                if (form.formType === constant.SELECT) {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.getOptions(this.organizationList, form)
                            break;
                        case fields.region:
                            form.options = this.getOptions(this.regions);
                            break;
                        case fields.deployment:
                            form.options = this.getOptions([constant.DEPLOYMENT_TYPE_DOCKER, constant.DEPLOYMENT_TYPE_KUBERNETES]);
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                this.updateExistingData(forms, form, data)
            }
        }

    }

    getFormData = async (data) => {
        let forms = Object.assign([], formKeys);
        
        forms.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Cluster Inst`, formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            this.loadData(forms, data)
        }
        else {
            this.organizationList = await serverData.showDataFromServer(this, showOrganizations())
            this.loadData(forms)
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));