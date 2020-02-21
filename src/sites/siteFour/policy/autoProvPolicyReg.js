import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item, Step } from 'semantic-ui-react';
import MexForms from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import * as serverData from '../../../services/ServerData';



const stepData = [
    {
        step: "Step 1",
        description: "Create Policy"
    },
    {
        step: "Step 2",
        description: "Add Cloudlets"
    }
]

class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.OrganizationList = []
        this.cloudletList = []
    }

    onValueChange = (currentForm, data) => {
    }

    getRegionData = () => {
        if (this.regions && this.regions.length > 0)
            return this.regions.map(region => {
                return { key: region, value: region, text: region }
            })
    }

    getOrganizationData = (dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let organization = data.Organization;
                return { key: organization, value: organization, text: organization }
            })
    }

    getCloudletData = (dataList) =>{
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let clouldlet = data.CloudletName;
                return { value: JSON.stringify(data), label: clouldlet}
            })
    }

    filterCloudlets=()=>
    {
        let newCloudletList = []
        if(this.props.data)
        {
            let  selectedCloudlets = this.props.data.Cloudlets
            if(selectedCloudlets && selectedCloudlets.length>0)
            {
                for(let i=0;i<selectedCloudlets.length;i++)
                {
                    let selectedCloudlet = selectedCloudlets[i];
                    for (let j = 0; j < this.cloudletList.length; j++) {
                        let cloudlet = this.cloudletList[j]
                        if(selectedCloudlet.CloudletName === cloudlet.CloudletName)
                        {
                            if(this.props.action === 'Add')
                            {
                                this.cloudletList.splice(j, 1)
                            }
                            else if(this.props.action === 'Delete')
                            {
                                newCloudletList.push(cloudlet)   
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.cloudletList = newCloudletList.length > 0 ? newCloudletList : this.cloudletList
    }


    selectCloudlet = async (region, organization, autoPolicyName) => {
        this.cloudletList = await serverData.getCloudletInfo(this, {region:region})
        
        let action = 'Add'
        if (this.props.action === 'Add') {
        }
        else if (this.props.action === 'Delete') {
            action = 'Delete'
        }
        this.filterCloudlets();
        let step2 = [
            { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { disabled: true }, visible:true, options: this.getRegionData(), value: region },
            { field: 'Organization', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { disabled: true }, visible:true, options: this.getOrganizationData(this.OrganizationList), value: organization },
            { field: 'AutoPolicyName', label: 'Auto Policy Name', type: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible:true, value: autoPolicyName  },
            { field: 'Cloudlets', label: 'Clouldets', type: 'DualList', rules: { required: true }, visible:true, options: this.getCloudletData(this.cloudletList) },
            { label: `${action} Cloudlets`, type: 'Button', onClick: this.onAddCloudlets },
            { label: 'Cancel', type: 'Button', onClick: this.onAddCancel }
        ]

        this.setState({
            step:1,
            forms: step2
        })
    }

    addCloudletResponse = (mcRequestList)=>
    {
        let valid = true;
        if(mcRequestList && mcRequestList.length>0)
        {
            for(let i=0;i<mcRequestList.length;i++)
            {
                let mcRequest = mcRequestList[i];
                if(mcRequest.response.status !== 200)
                {
                    valid = false;
                }
            }
        }

        if(valid)
        {
            let msg = this.props.action === 'Delete' ? 'removed' : 'added'
            this.props.handleAlertInfo('success', `Cloudlets ${msg} successfully`)
            setTimeout(()=>{this.gotoUrl('site4', 'pg=8')},2000)
        }
    }

    onCreateAutoProvPolicyResponse = (mcRequest)=>
    {
        if(mcRequest && mcRequest.response)
        {
            let response = mcRequest.response;
            if(response.status === 200)
            {
                let data = mcRequest.request.data;
                let region = data.Region
                let organization = data.AutoProvPolicy.key.developer;
                let autoPolicyName = data.AutoProvPolicy.key.name;
                this.props.handleAlertInfo('success', `Auto Provisioning Policy ${autoPolicyName} created successfully`)
                this.selectCloudlet(region, organization, autoPolicyName)
            }
        }
    }

    formattedData = ()=>
    {
        let data = {};
        let forms = this.state.forms;
        for(let i=0;i<forms.length;i++)
        {
            let form = forms[i];
            if(form.field)
            {
                data[form.field] = form.value;   
            }
        }
        return data
    }

    onCreateAutoProvPolicy = () => {
        let data = this.formattedData()
        let AutoProvPolicy = {
            deploy_client_count: parseInt(data.DeployClientCount),
            deploy_interval_count: parseInt(data.DeployIntervalCount), 
            key:{ developer: data.Organization, name: data.AutoPolicyName }
        }

        let requestData = {
            Region : data.Region,
            AutoProvPolicy:AutoProvPolicy
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let token  = store.userToken;
        if(token)
        {
            let method = serviceMC.getEP().CREATE_AUTO_PROV_POLICY;
            serviceMC.sendRequest(this, {token:token, method:method, data:requestData}, this.onCreateAutoProvPolicyResponse)
        }
    }

    onAddCloudlets = ()=>{
        let data = this.formattedData()
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let token = store.userToken;

        let method = serviceMC.getEP().ADD_AUTO_PROV_POLICY_CLOUDLET;

        if(this.props.action === 'Delete')
        {
            method = serviceMC.getEP().REMOVE_AUTO_PROV_POLICY_CLOUDLET;
        }

        let requestDataList = []
        let cloudletList = data.Cloudlets
        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = JSON.parse(cloudletList[i])
                let requestData = {
                    Region: data.Region,
                    AutoProvPolicyCloudlet: {
                        key: { developer: data.Organization, name: data.AutoPolicyName },
                        cloudlet_key: { name: cloudlet.CloudletName, operator_key: { name: cloudlet.Operator } }
                    }
                }
                requestDataList.push({ token: token, method: method, data: requestData })
            }
        }
        serviceMC.sendMultiRequest(this, requestDataList, this.addCloudletResponse)
    }

    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action ? null :
                            <div>
                                <div className='content_title' style={{ padding: '0px 0px 10px 0' }}>Create Auto Provisioning Policy</div>

                                <Step.Group stackable='tablet' style={{ width: '100%' }}>
                                    {
                                        stepData.map((item, i) => (
                                            <Step active={this.state.step === i} key={i} >
                                                <Step.Content>
                                                    <Step.Title>{item.step}</Step.Title>
                                                    <Step.Description>{item.description}</Step.Description>
                                                </Step.Content>
                                            </Step>
                                        ))
                                    }
                                </Step.Group></div>}
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Item>
                </div>
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

    onAddCancel = ()=>
    {
        this.gotoUrl('site4', 'pg=8')
    }

    

    getFormData = async(data)=>
    {
        if(data)
        {
            this.OrganizationList = [{Organization:data.OrganizationName}]
            this.selectCloudlet(data.Region, data.OrganizationName, data.AutoPolicyName)
        }
        else {
            this.OrganizationList = await serverData.getOrganizationInfo(this)
            let step1 = [
                { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { required: true }, visible:true, options: this.getRegionData() },
                { field: 'Organization', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible:true, options: this.getOrganizationData(this.OrganizationList) },
                { field: 'AutoPolicyName', label: 'Auto Policy Name', type: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { required: true }, visible:true },
                { field: 'DeployClientCount', label: 'Deploy Client Count', type: 'Input', rules: { type: 'number' }, visible:true },
                { field: 'DeployIntervalCount', label: 'Deploy Interval Count (s)', type: 'Input', rules: { type: 'number' }, visible:true },
                { label: 'Create Policy', type: 'Button', onClick: this.onCreateAutoProvPolicy, validate:true },
                { label: 'Cancel', type: 'Button', onClick: this.onAddCancel }
            ]

            this.setState({
                forms: step1
            })
        }

    }

    componentDidMount() {
        this.getFormData(this.props.data)
    }

    componentWillUnmount()
    {
        if(this.props.childPage)
        {
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
