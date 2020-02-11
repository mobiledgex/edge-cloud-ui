import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import MexForms from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import * as ServerData from '../../../services/ServerData';

const rules = [
    { field: 'Protocol', label: 'Protocol', type: 'Input' },
    { field: 'PortRangeMin', label: 'Port Range Min', type: 'Input',rules:{ type: 'number'} },
    { field: 'PortRangeMax', label: 'Port Range Max', type: 'Input',rules:{ type: 'number'} },
    { field: 'RemoteCIDR', label: 'Remote CIDR', type: 'Input' }
]
class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            info: { region: 'US' }
        }
        this.formData = {};
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length>0 ? props.regionInfo.region : savedRegion
        this.OrganizationList = []
        this.cloudletList = []
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

    onChange = (data) => {
        this.setState(prevState => {
            let info = Object.assign({}, prevState.info);
            info.region = data;
            return { info };
        })
    }

    removeSelectedCloudlets=()=>
    {
        if(this.props.data)
        {
            let  selectedCloudlets = this.props.data.Cloudlets
            if(selectedCloudlets && selectedCloudlets.length>0)
            {
                for(let i=0;i<this.cloudletList.length>0;i++)
                {
                    let cloudlet = this.cloudletList[i];
                    for (let j = 0; j < selectedCloudlets.length > 0; j++) {
                        let selectedCloudlet = selectedCloudlets[j]
                        if(selectedCloudlet.key.name === cloudlet.CloudletName)
                        {
                            this.cloudletList.splice(i, 1)
                            break;
                        }
                    }
                }
            }
        }
    }

    removeUnSelectedCloudlets=()=>
    {
        let newCloudletList = []
        if(this.props.data)
        {
            let  selectedCloudlets = this.props.data.Cloudlets
            if(selectedCloudlets && selectedCloudlets.length>0)
            {
                for(let i=0;i<this.cloudletList.length>0;i++)
                {
                    let cloudlet = this.cloudletList[i];
                    for (let j = 0; j < selectedCloudlets.length > 0; j++) {
                        let selectedCloudlet = selectedCloudlets[j]
                        if(selectedCloudlet.key.name === cloudlet.CloudletName)
                        {
                            newCloudletList.push(cloudlet)
                            break;
                        }
                    }
                }
            }
        }
        this.cloudletList = newCloudletList;
    }

    privacyPolicyResponse = (mcRequest)=>
    {
        if(mcRequest.response)
        {
            if(mcRequest.response.status === 200)
            {
                let msg = 'Created'
                switch(this.props.action)
                {
                    case 'Delete':
                        msg = 'Deleted'
                        break;
                    case 'Update':
                        msg = 'Updated'
                    default:
                        msg = 'Created'
                }
                this.props.handleAlertInfo('success', `Cloudlets ${msg} Successfully`)
                setTimeout(() => { this.gotoUrl('site4', 'pg=8') }, 2000)
            }
        }
    }


    onCreate = (data) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let token = store.userToken;

        let method = serviceMC.getEP().CREATE_PRIVACY_POLICY;

        if(this.props.action === 'Update')
        {
            method = serviceMC.getEP().UPDATE_PRIVACY_POLICY;
        }
        else if(this.props.action === 'Delete')
        {
            method = serviceMC.getEP().DELETE_PRIVACY_POLICY;
        }

        let outbound_security_rules = [];
        for(let i=0;i<this.state.forms.length;i++)
        {
            let form = this.state.forms[i];
            if(form.uuid)
            {
                let uuid = form.uuid;
                    let OutboundSecurityRule = data[uuid]
                    outbound_security_rules.push({
                        protocol: OutboundSecurityRule.Protocol,
                        port_range_min: parseInt(OutboundSecurityRule.PortRangeMin),
                        port_range_max: parseInt(OutboundSecurityRule.PortRangeMax),
                        remote_cidr: OutboundSecurityRule.RemoteCIDR
                    })
                
            }
        }
    
        let requestData = {
            region : data.Region,
            privacypolicy : {
                key:{
                    name:data.PrivacyPolicyName,
                    developer:data.Organization
                },
                outbound_security_rules:outbound_security_rules
            }
        }
        serviceMC.sendRequest(this, { token: token, method: method, data: requestData }, this.privacyPolicyResponse)
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <MexForms formData = {this.formData} forms={this.state.forms} />
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

    addRulesForm=()=>
    {
        this.setState(prevState=>({forms:[...prevState.forms, {uuid:serviceMC.generateUniqueId(), field:'OutboundSecurityRules', type:'MultiForm', onClick:this.removeRulesForm, forms:rules}]}))
    }

    removeRulesForm = (index) => {
        let updateForm = this.state.forms;
        updateForm.splice(index, 1);
        this.setState({
            forms: updateForm
        })
    }

    

    getFormData = async(data)=>
    {
        let step1 = [];

        if(data)
        {
            this.OrganizationList = [{Organization:data.OrganizationName}]
            this.formData.Region = data.Region;
            this.formData.Organization = data.OrganizationName;
            this.formData.PrivacyPolicyName = data.PrivacyPolicyName;
            step1 = [
                { label: 'Create Privacy Policy', type: 'Header' },
                { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { disabled: true }, options: this.getRegionData(), value:data.Region },
                { field: 'Organization', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { disabled: true }, options: this.getOrganizationData(this.OrganizationList), value:data.OrganizationName },
                { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', type: 'Input', placeholder: 'Enter Privacy Policy Name', rules: { disabled: true }, value:data.PrivacyPolicyName },
                { label: 'Outbound Security Rules', type: 'Header', forms:{type:'Button', icon:'Add', onClick:this.addRulesForm}},
            ]

            if (data.OutboundSecurityRules && data.OutboundSecurityRules.length > 0) {
                for (let i = 0; i < data.OutboundSecurityRules.length; i++) {
                    let OutboundSecurityRule = data.OutboundSecurityRules[i]
                    let rules = [
                        { field: 'Protocol', label: 'Protocol', type: 'Input', value: OutboundSecurityRule.Protocol },
                        { field: 'PortRangeMin', label: 'Port Range Min', type: 'Input',rules:{ type: 'number'}, value: OutboundSecurityRule.PortRangeMin },
                        { field: 'PortRangeMax', label: 'Port Range Max', type: 'Input',rules:{ type: 'number'}, value: OutboundSecurityRule.PortRangeMax },
                        { field: 'RemoteCIDR', label: 'Remote CIDR', type: 'Input', value: OutboundSecurityRule.RemoteCIDR }
                    ]
                    let uuid = serviceMC.generateUniqueId();
                    this.formData[uuid] = {Protocol:OutboundSecurityRule.Protocol,PortRangeMin:OutboundSecurityRule.PortRangeMin,PortRangeMax:OutboundSecurityRule.PortRangeMax,RemoteCIDR:OutboundSecurityRule.RemoteCIDR}
                    step1.push({ uuid: uuid, field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: rules })
                }
            }
        }
        else {
            this.OrganizationList = await ServerData.getOrganizationInfo(this) 
            step1 = [
                { label: 'Create Privacy Policy', type: 'Header' },
                { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { required: true }, options: this.getRegionData() },
                { field: 'Organization', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { required: true }, options: this.getOrganizationData(this.OrganizationList) },
                { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', type: 'Input', placeholder: 'Enter Privacy Policy Name', rules: { required: true } },
                { label: 'Outbound Security Rules', type: 'Header', forms:{type:'Button', icon:'Add', onClick:this.addRulesForm}},
            ]
        }

        
        step1.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Policy`, type: 'Button', onClick: this.onCreate },
            { label: 'Cancel', type: 'Button', onClick: this.onAddCancel })
        this.setState({
            forms: step1
        })

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
