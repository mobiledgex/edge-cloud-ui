import React from 'react';
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
            forms: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.OrganizationList = []
        this.cloudletList = []
    }

    validateRules = (form)=>
    {
        let valid = true;
        if (form.visible) {
            let rules = form.rules;
            if (rules) {
                if (rules.required) {
                    if (form.value === undefined || form.value.length === 0) {
                        form.error = `${form.label} is mandatory`
                        valid = false;
                    }
                    else {
                        form.error = undefined
                    }
                }
            }
        }
        return valid
    }

    validateRemoteCIDR=(form, value)=>
    {
        if (value.length > 0) {
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|1[0-9]|2[0-9]|3[0-2]?)$/.test(value)) {
                form.error = 'Remote CIDR format is invalid (must be between 0.0.0.0/0 to 255.255.255.255/32)'
                return false;
            }
        }
        form.error = undefined;
        return true;
        
    }

    validatePortRange=(form, value)=>
    {
        if (value.length > 0) {
            value = parseInt(value)
            if(value < 1 || value > 65535)
            {
                form.error = 'Invalid Port Range (must be between 1-65535)' 
                return false; 
            }
        }
        form.error = undefined;
        return true;
    }

    validateOutboundRules = (form, data)=>
    {
        let valid = true;
        if (!data.FullIsolation && form.field === 'OutboundSecurityRules') {
            let outboundSecurityRules = data[form.uuid];
            for (let j = 0; j < form.forms.length; j++) {
                let childForm = form.forms[j]
                valid = this.validateRules(childForm)
                if (valid && outboundSecurityRules) {
                    if (outboundSecurityRules[childForm.field] != undefined) {
                        if (childForm.field === 'RemoteCIDR') {
                            valid = this.validateRemoteCIDR(childForm, outboundSecurityRules[childForm.field])
                        }
                        else if (childForm.field === 'PortRangeMin' || childForm.field === 'PortRangeMax') {
                            valid = this.validatePortRange(childForm, outboundSecurityRules[childForm.field])
                        }
                    }
                }
                if (!valid) {
                    break;
                }
            }
        }
        return valid;
    } 

    

    isDataValid = (data) =>
    {
        let valid = true;
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            valid = this.validateRules(form)
            valid = valid ? this.validateOutboundRules(form, data) : valid

            if(!valid)
            {
                break;
            }
        }

        this.setState({
            forms:forms
        })
        return valid;
    }

    protocolValueChange(currentForm, parentForm)
    {
            let forms = this.state.forms
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if(form.uuid === parentForm.uuid)
                {
                    for (let j = 0; j < form.forms.length; j++) {
                        let outBoundRulesForm = form.forms[j]
                        if(currentForm.value === 'icmp' && (outBoundRulesForm.field === 'PortRangeMin' || outBoundRulesForm.field === 'PortRangeMax'))
                        {
                            outBoundRulesForm.visible = false;
                        }
                        else
                        {
                            outBoundRulesForm.visible = true; 
                        }
                    }
                    break;
                }
            }

            this.setState({
                forms: forms
            })
    }

    onValueChange = (currentForm, parentForm) => {

        if (currentForm.field === 'FullIsolation') {
            let forms = this.state.forms;
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.label === 'Outbound Security Rules' || form.field === 'OutboundSecurityRules') {
                    form.visible = !currentForm.value;
                }
            }
            this.setState({
                forms: forms
            })
        }

        if(currentForm.field === 'Protocol')
        {
            this.protocolValueChange(currentForm, parentForm)
        }
    }

    addRulesForm = () => {
        let outboundRules = JSON.parse(JSON.stringify(this.outboundRules));
        this.setState(prevState => ({ forms: [...prevState.forms, { uuid: serviceMC.generateUniqueId(), field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: outboundRules, visible: true, serverField: 'outbound_security_rules', showDelete:true }] }))
    }

    removeRulesForm = (index) => {
        let forms = this.state.forms;
        forms.splice(index, 1);
        this.setState({
            forms: forms
        })
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

    getProtocolData = ()=>
    {
        let protocol = ['tcp','udp','icmp']
        return protocol.map(data => {
            return { key: data, value: data, text: data.toUpperCase() }
        })
    }

    step1 = [
        { label: 'Create Privacy Policy', type: 'Header' },
        { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true, serverField:'region' },
        { field: 'OrganizationName', label: 'Organization', type: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible: true, serverField: 'privacypolicy#OS#key#OS#developer' },
        { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', type: 'Input', placeholder: 'Enter Privacy Policy Name', rules: { required: true }, visible: true, serverField: 'privacypolicy#OS#key#OS#name' },
        { field: 'FullIsolation', label: 'Full Isolation', type: 'Checkbox', visible: true },
        { label: 'Outbound Security Rules', type: 'Header', forms: { type: 'Button', icon: 'Add', onClick: this.addRulesForm }, visible: true},
    ]

    outboundRules = [
        { field: 'Protocol', label: 'Protocol', type: 'Select', rules: { required: true, type: 'number' },visible: true, options:this.getProtocolData(),serverField:'protocol'},
        { field: 'PortRangeMin', label: 'Port Range Min', type: 'Input', rules: { required: true, type: 'number' }, visible: true,serverField:'port_range_min' },
        { field: 'PortRangeMax', label: 'Port Range Max', type: 'Input', rules: { required: true, type: 'number' }, visible: true,serverField:'port_range_max' },
        { field: 'RemoteCIDR', label: 'Remote CIDR', type: 'Input', rules: { required: true },visible: true,serverField:'remote_cidr' },
    ]

    getNewJsonObject = (data)=>
    {
        return JSON.parse(JSON.stringify(data))
    }

    

    privacyPolicyResponse = (mcRequest) => {
        if (mcRequest.response) {
            if (mcRequest.response.status === 200) {
                let msg = 'Created'
                switch (this.props.action) {
                    case 'Update':
                        msg = 'Updated'
                        break;
                    default:
                        msg = 'Created'
                }
                let policyName =  mcRequest.request.data.privacypolicy.key.name;
                this.props.handleAlertInfo('success', `Privacy Policy ${policyName} ${msg} Successfully`)
                setTimeout(() => { this.gotoUrl('site4', 'pg=8') }, 2000)
            }
        }
    }
    
    // convertServerFieldtoJson=(form, data)=>
    // {
    //     if (form.serverField && form.value) {
    //         let serverField = this.getNewJsonObject(form.serverField);
    //         if (serverField.includes('#OS#')) {
    //             let objects = serverField.split('#OS#');
    //             let currentObject = data;
    //             for (let j = 0; j < objects.length; j++) {
    //                 let object = objects[j];
    //                 if (j < objects.length - 1) {
    //                     if (currentObject[object] === undefined) {
    //                         currentObject[object] = {};
    //                     }
    //                     currentObject = currentObject[object];
    //                 }
    //                 else {
    //                     currentObject[object] = form.value;
    //                 }
    //             }
    //         }
    //         else {
    //             data[form.serverField] = form.value;
    //         }
    //     }
    // }


    /***
     * Map values from form to field
     * ***/
    formattedData = ()=>
    {
        let data = {};
        let forms = this.state.forms;
        for(let i=0;i<forms.length;i++)
        {
            let form = forms[i];
            if(form.field)
            {
                if(form.forms)
                {
                    data[form.uuid] = {};
                    let subForms = form.forms
                    for (let j = 0; j < subForms.length; j++) {
                        let subForm = subForms[j];
                        data[form.uuid][subForm.field] = subForm.value;
                    }

                }
                else
                {
                    data[form.field] = form.value;
                }
            }
        }
        return data
    }

    onCreate = () => {
        let data = this.formattedData()
        if (data && this.isDataValid(data)) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            let token = store.userToken;

            let method = serviceMC.getEP().CREATE_PRIVACY_POLICY;

            if (this.props.action === 'Update') {
                method = serviceMC.getEP().UPDATE_PRIVACY_POLICY;
            }

            let outbound_security_rules = [];
            if (!data.FullIsolation) {
                for (let i = 0; i < this.state.forms.length; i++) {
                    let form = this.state.forms[i];
                    if (form.uuid) {
                        let uuid = form.uuid;
                        let OutboundSecurityRule = data[uuid]
                        if (OutboundSecurityRule) {
                            outbound_security_rules.push({
                                protocol: OutboundSecurityRule.Protocol,
                                port_range_min: OutboundSecurityRule.Protocol!=='icmp' ? parseInt(OutboundSecurityRule.PortRangeMin) : undefined,
                                port_range_max: OutboundSecurityRule.Protocol!=='icmp' ? parseInt(OutboundSecurityRule.PortRangeMax) : undefined,
                                remote_cidr: OutboundSecurityRule.RemoteCIDR
                            })
                        }

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
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} />
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

   

    disableFields = (form) => {
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

                    if(form.field === 'FullIsolation')
                    {
                        form.value = data.OutboundSecurityRules && data.OutboundSecurityRules.length > 0 ? false : true
                    }
                    else
                    {
                        form.value = data[form.field]
                    }
                    this.disableFields(form)
                }
            }
            else if(form.label)
            {
                if (data) {
                    if (form.label === 'Outbound Security Rules') {
                        form.visible = data.OutboundSecurityRules && data.OutboundSecurityRules.length > 0 ? true : false
                    }
                }
            }
        }

    }

    getFormData = async (data) => {
        this.step1.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Policy`, type: 'Button', onClick: this.onCreate },
            { label: 'Cancel', type: 'Button', onClick: this.onAddCancel })

        let OutboundSecurityRulesForm = []
        if (data) {
            this.OrganizationList = [{ Organization: data.OrganizationName }]

            this.loadData(this.step1, data)
            if (data.OutboundSecurityRules && data.OutboundSecurityRules.length > 0) {
                for (let i = 0; i < data.OutboundSecurityRules.length; i++) {
                    let OutboundSecurityRule = data.OutboundSecurityRules[i]
                    let outboundRules = JSON.parse(JSON.stringify(this.outboundRules));
                    let isICMP = false;
                    for (let j = 0; j < outboundRules.length > 0; j++) {
                        let outboundRule = outboundRules[j];
                        outboundRule.value = OutboundSecurityRule[outboundRule.field]
                        if(outboundRule.field === 'Protocol')
                        {
                            isICMP = outboundRule.value === 'icmp' ? true : false;
                        }
                        if ((outboundRule.field === 'PortRangeMin' || outboundRule.field === 'PortRangeMax') && isICMP) {
                            outboundRule.visible = false;
                        }
                    }
                    let uuid = serviceMC.generateUniqueId();
                    OutboundSecurityRulesForm.push({ uuid: uuid, field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: outboundRules, visible:true, serverField: 'outbound_security_rules'})
                }
            }
        }
        else {
            let outboundRules = JSON.parse(JSON.stringify(this.outboundRules));
            this.OrganizationList = await ServerData.getOrganizationInfo(this)
            this.loadData(this.step1)
            OutboundSecurityRulesForm.push({ uuid: serviceMC.generateUniqueId(), field: 'OutboundSecurityRules', type: 'MultiForm', onClick: this.removeRulesForm, forms: outboundRules, visible: true, serverField: 'outbound_security_rules' })
        }

        if(OutboundSecurityRulesForm.length > 0)
        {
            //Show delete for last rule and exculde delete if only one rule
            let length = OutboundSecurityRulesForm.length;
            if(length > 1)
            {
                OutboundSecurityRulesForm[length-1].showDelete = true; 
            }
            this.step1 = [...this.step1, ...OutboundSecurityRulesForm]
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicyReg));
