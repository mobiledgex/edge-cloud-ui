import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import MexForms from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import uuid from 'uuid';
import {fields, getOrganization} from '../../../../services/model/format';
//model
import {getOrganizationList} from '../../../../services/model/organization';
import {updatePrivacyPolicy, createPrivacyPolicy} from '../../../../services/model/privacyPolicy';
import * as serverData from '../../../../services/model/serverData';

class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
    }

    validateRemoteCIDR=(form)=>
    {
        if (form.value && form.value.length > 0) {
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|1[0-9]|2[0-9]|3[0-2]?)$/.test(form.value)) {
                form.error = 'Remote CIDR format is invalid (must be between 0.0.0.0/0 to 255.255.255.255/32)'
                return false;
            }
        }
        form.error = undefined;
        return true;
        
    }

    validatePortRange=(form)=>
    {
        if (form.value && form.value.length > 0) {
            let value = parseInt(form.value)
            if(value < 1 || value > 65535)
            {
                form.error = 'Invalid Port Range (must be between 1-65535)' 
                return false; 
            }
        }
        form.error = undefined;
        return true;
    }

    protocolValueChange(currentForm)
    {
        let parentForm = currentForm.parent.form
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.uuid === parentForm.uuid) {
                for (let j = 0; j < form.forms.length; j++) {
                    let outBoundRulesForm = form.forms[j]
                    if (currentForm.value === 'icmp' && (outBoundRulesForm.field === fields.portRangeMin || outBoundRulesForm.field === fields.portRangeMax))
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

    onValueChange = (currentForm) => {
        if (currentForm.field === fields.fullIsolation) {
            let forms = this.state.forms;
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.label === 'Outbound Security Rules' || form.field === fields.outboundSecurityRules) {
                    form.visible = !currentForm.value;
                }
            }
            this.setState({
                forms: forms
            })
        }

        if(currentForm.field === fields.protocol)
        {
            this.protocolValueChange(currentForm)
        }
    }

    getOutboundRulesCount = ()=>
    {
        let count = 0;
        let forms = this.state.forms;
        for(let i=0; i<forms.length;i++)
        {
            if(forms[i].field === fields.outboundSecurityRules)
            {
                count++;
            }
        }
        return count;
    }

    removeRulesForm = (e, form) => {
        if (this.getOutboundRulesCount() > 1) {
            if (form.parent) {
                let updateForms = Object.assign([], this.state.forms)
                updateForms.splice(form.parent.id, 1);
                this.setState({
                    forms: updateForms
                })
            }
        }
        else
        {
            this.props.handleAlertInfo('error', 'Enable Full Isolation to disable all rules')
        }
    }

    getOutBoundRules = () => ([
        { field: fields.protocol, label: 'Protocol', formType: 'Select', rules: { required: true, type: 'number', allCaps: true }, width: 3, visible: true, options: ['tcp', 'udp', 'icmp'], serverField: 'protocol' },
        { field: fields.portRangeMin, label: 'Port Range Min', formType: 'Input', rules: { required: true, type: 'number' }, width: 3, visible: true, serverField: 'port_range_min', dataValidateFunc: this.validatePortRange },
        { field: fields.portRangeMax, label: 'Port Range Max', formType: 'Input', rules: { required: true, type: 'number' }, width: 3, visible: true, serverField: 'port_range_max', dataValidateFunc: this.validatePortRange },
        { field: fields.remoteCIDR, label: 'Remote CIDR', formType: 'Input', rules: { required: true }, width: 3, visible: true, serverField: 'remote_cidr', dataValidateFunc: this.validateRemoteCIDR },
        { icon: 'delete', formType: 'IconButton', visible: true, style: { color: 'white', top: 15 }, width: 1, onClick: this.removeRulesForm }
    ])

    getOutboundSecurityForm = (outBoundRules)=>(
        { uuid: uuid(), field: fields.outboundSecurityRules, formType: 'MultiForm', forms: outBoundRules, width:3, visible: true }
    )

    getForms = () => ([
        { label: 'Create Privacy Policy', formType: 'Header', visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true, serverField: 'region' },
        { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true },
        { field: fields.privacyPolicyName, label: 'Privacy Policy Name', formType: 'Input', placeholder: 'Enter Privacy Policy Name', rules: { required: true }, visible: true },
        { field: fields.fullIsolation, label: 'Full Isolation', formType: 'Checkbox', visible: true, value: false },
        { label: 'Outbound Security Rules', formType: 'Header', forms: [{ formType: 'IconButton', icon: 'add', style:{ color: "white", display: 'inline' }, onClick: this.addRulesForm }], visible: true },
    ])

    addRulesForm = (e, form) => {
        this.setState(prevState => ({ forms: [...prevState.forms, this.getOutboundSecurityForm(this.getOutBoundRules())] }))
    }
    
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

    onCreate = async (data) => {
        //let data = this.formattedData()
        if (data) {
            let outboundSecurityRules = [];
            if (!data[fields.fullIsolation]) {
                for (let i = 0; i < this.state.forms.length; i++) {
                    let form = this.state.forms[i];
                    if (form.uuid) {
                        let uuid = form.uuid;
                        let outboundSecurityRule = data[uuid]
                        if (outboundSecurityRule) {
                            outboundSecurityRules.push({
                                protocol: outboundSecurityRule[fields.protocol],
                                port_range_min: outboundSecurityRule[fields.protocol] !== 'icmp' ? parseInt(outboundSecurityRule[fields.portRangeMin]) : undefined,
                                port_range_max: outboundSecurityRule[fields.protocol] !== 'icmp' ? parseInt(outboundSecurityRule[fields.portRangeMax]) : undefined,
                                remote_cidr: outboundSecurityRule[fields.remoteCIDR]
                            })
                        }

                    }
                }
            }
            if(outboundSecurityRules.length > 0)
            {
                data[fields.outboundSecurityRules] = outboundSecurityRules;
            }
            let mcRequest = await serverData.sendRequest(this, this.props.action === 'Update' ? updatePrivacyPolicy(data) : createPrivacyPolicy(data))
            if (mcRequest && mcRequest.response) {
                let response = mcRequest.response
                if (response.status === 200) {
                    let msg = 'Created'
                    switch (this.props.action) {
                        case 'Update':
                            msg = 'updated'
                            break;
                        default:
                            msg = 'created'
                    }
                    let policyName = mcRequest.request.data.privacypolicy.key.name;
                    this.props.handleAlertInfo('success', `Privacy Policy ${policyName} ${msg} successfully`)
                    this.props.onClose(true)
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
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Item>
                </div>
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

   

    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region || field === fields.privacyPolicyName) {
            rules.disabled = true;
        }
    }

    loadData(forms, data) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.formType === 'Select') {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.regions
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                if (data) {

                    if(form.field === fields.fullIsolation)
                    {
                        form.value = data[fields.outboundSecurityRules] && data[fields.outboundSecurityRules].length > 0 ? false : true
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
                        form.visible = data[fields.outboundSecurityRules] && data[fields.outboundSecurityRules].length > 0 ? true : false
                    }
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.getForms();
        forms.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Policy`, formType: 'Button', onClick: this.onCreate, validate : true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName]
            this.organizationList = [organization]

            this.loadData(forms, data)
            if (data[fields.outboundSecurityRules] && data[fields.outboundSecurityRules].length > 0) {
                for (let i = 0; i < data[fields.outboundSecurityRules].length; i++) {
                    let OutboundSecurityRule = data[fields.outboundSecurityRules][i]
                    let outboundRules = this.getOutBoundRules();
                    let isICMP = false;
                    for (let j = 0; j < outboundRules.length; j++) {
                        let outboundRule = outboundRules[j];
                        outboundRule.value = OutboundSecurityRule[outboundRule.field]
                        if(outboundRule.field === fields.protocol)
                        {
                            isICMP = outboundRule.value === 'icmp' ? true : false;
                        }
                        if ((outboundRule.field === fields.portRangeMin || outboundRule.field === fields.portRangeMax) && isICMP) {
                            outboundRule.visible = false;
                        }
                    }
                    forms.push(this.getOutboundSecurityForm(outboundRules))
                }
            }
        }
        else {
            this.organizationList = await getOrganizationList(this)
            this.loadData(forms)
            forms.push(this.getOutboundSecurityForm(this.getOutBoundRules()))
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
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicyReg));
