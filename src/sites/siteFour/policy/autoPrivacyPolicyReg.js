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
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.OrganizationList = []
        this.cloudletList = []
    }

    onValueChange = (currentForm, data) => {

        if (currentForm.field === 'FullIsolation') {
            let forms = this.state.forms;
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.label === 'Outbound Security Rules' || form.field === 'OutboundSecurityRules') {
                    form.visible = !data.FullIsolation;
                }
            }
            this.setState({
                forms: forms
            })
        }

        this.formData = data;
    }

    addRulesForm = () => {
        let outboundRules = JSON.parse(JSON.stringify(this.outboundRules));
        this.setState(prevState => ({ forms: [...prevState.forms, { uuid: serviceMC.generateUniqueId(), field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: outboundRules, visible: true }] }))
    }

    step1 = [
        { label: 'Create Privacy Policy', type: 'Header' },
        { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
        { field: 'OrganizationName', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible: true },
        { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', type: 'Input', placeholder: 'Enter Privacy Policy Name', rules: { required: true }, visible: true },
        { field: 'FullIsolation', label: 'Full Isolation', type: 'Checkbox', visible: true },
        { label: 'Outbound Security Rules', type: 'Header', forms: { type: 'Button', icon: 'Add', onClick: this.addRulesForm }, visible: true },
    ]

    outboundRules = [
        { field: 'Protocol', label: 'Protocol', type: 'Input', visible: true },
        { field: 'PortRangeMin', label: 'Port Range Min', type: 'Input', rules: { type: 'number' }, visible: true },
        { field: 'PortRangeMax', label: 'Port Range Max', type: 'Input', rules: { type: 'number' }, visible: true },
        { field: 'RemoteCIDR', label: 'Remote CIDR', type: 'Input', visible: true },
    ]



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

    getCloudletData = (dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let clouldlet = data.CloudletName;
                return { value: JSON.stringify(data), label: clouldlet }
            })
    }

    onChange = (data) => {
        this.setState(prevState => {
            let info = Object.assign({}, prevState.info);
            info.region = data;
            return { info };
        })
    }

    removeSelectedCloudlets = () => {
        if (this.props.data) {
            let selectedCloudlets = this.props.data.Cloudlets
            if (selectedCloudlets && selectedCloudlets.length > 0) {
                for (let i = 0; i < this.cloudletList.length > 0; i++) {
                    let cloudlet = this.cloudletList[i];
                    for (let j = 0; j < selectedCloudlets.length > 0; j++) {
                        let selectedCloudlet = selectedCloudlets[j]
                        if (selectedCloudlet.key.name === cloudlet.CloudletName) {
                            this.cloudletList.splice(i, 1)
                            break;
                        }
                    }
                }
            }
        }
    }

    removeUnSelectedCloudlets = () => {
        let newCloudletList = []
        if (this.props.data) {
            let selectedCloudlets = this.props.data.Cloudlets
            if (selectedCloudlets && selectedCloudlets.length > 0) {
                for (let i = 0; i < this.cloudletList.length > 0; i++) {
                    let cloudlet = this.cloudletList[i];
                    for (let j = 0; j < selectedCloudlets.length > 0; j++) {
                        let selectedCloudlet = selectedCloudlets[j]
                        if (selectedCloudlet.key.name === cloudlet.CloudletName) {
                            newCloudletList.push(cloudlet)
                            break;
                        }
                    }
                }
            }
        }
        this.cloudletList = newCloudletList;
    }

    privacyPolicyResponse = (mcRequest) => {
        if (mcRequest.response) {
            if (mcRequest.response.status === 200) {
                let msg = 'Created'
                switch (this.props.action) {
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

        if (this.props.action === 'Update') {
            method = serviceMC.getEP().UPDATE_PRIVACY_POLICY;
        }
        else if (this.props.action === 'Delete') {
            method = serviceMC.getEP().DELETE_PRIVACY_POLICY;
        }
        
        let outbound_security_rules = [];
        if (!data.FullIsolation) {
            for (let i = 0; i < this.state.forms.length; i++) {
                let form = this.state.forms[i];
                if (form.uuid) {
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
        }

        let requestData = {
            region: data.Region,
            privacypolicy: {
                key: {
                    name: data.PrivacyPolicyName,
                    developer: data.OrganizationName
                },
                outbound_security_rules: outbound_security_rules
            }
        }
        serviceMC.sendRequest(this, { token: token, method: method, data: requestData }, this.privacyPolicyResponse)
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <MexForms formData={this.formData} forms={this.state.forms} onValueChange={this.onValueChange} />
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

    onAddCancel = () => {
        this.gotoUrl('site4', 'pg=8')
    }

    removeRulesForm = (index) => {
        let updateForm = this.state.forms;
        updateForm.splice(index, 1);
        this.setState({
            forms: updateForm
        })
    }

    diableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === 'OrganizationName' || field === 'Region' || field === 'PrivacyPolicyName') {
            rules.disabled = true;
        }
    }

    loadData(forms, data) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.type === 'Select') {
                    switch (form.field) {
                        case 'OrganizationName':
                            form.options = this.getOrganizationData(this.OrganizationList)
                            break;
                        case 'Region':
                            form.options = this.getRegionData();
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                if (data) {
                    form.value = data[form.field]
                    this.diableFields(form)
                }
            }
        }

    }

    getFormData = async (data) => {
        if (data) {
            this.OrganizationList = [{ Organization: data.OrganizationName }]
            this.formData.Region = data.Region;
            this.formData.Organization = data.OrganizationName;
            this.formData.PrivacyPolicyName = data.PrivacyPolicyName;

            this.loadData(this.step1, data)

            if (data.OutboundSecurityRules && data.OutboundSecurityRules.length > 0) {
                for (let i = 0; i < data.OutboundSecurityRules.length; i++) {
                    let OutboundSecurityRule = data.OutboundSecurityRules[i]
                    let outboundRules = JSON.parse(JSON.stringify(this.outboundRules));
                    for (let j = 0; j < outboundRules.length > 0; j++) {
                        let outboundRule = outboundRules[j];
                        outboundRule.value = OutboundSecurityRule[outboundRule.field]
                    }
                    let uuid = serviceMC.generateUniqueId();
                    this.formData[uuid] = { Protocol: OutboundSecurityRule.Protocol, PortRangeMin: OutboundSecurityRule.PortRangeMin, PortRangeMax: OutboundSecurityRule.PortRangeMax, RemoteCIDR: OutboundSecurityRule.RemoteCIDR }
                    this.step1.push({ uuid: uuid, field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: outboundRules, visible:true })
                }
            }
        }
        else {
            this.OrganizationList = await ServerData.getOrganizationInfo(this)
            this.loadData(this.step1)
        }


        this.step1.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Policy`, type: 'Button', onClick: this.onCreate },
            { label: 'Cancel', type: 'Button', onClick: this.onAddCancel })

        this.setState({
            forms: this.step1
        })

    }

    componentDidMount() {
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
