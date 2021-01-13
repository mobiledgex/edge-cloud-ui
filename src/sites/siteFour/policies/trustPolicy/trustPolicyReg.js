import React from 'react';
import { withRouter } from 'react-router-dom';
import MexForms, { MAIN_HEADER, HEADER } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import uuid from 'uuid';
import { fields, getOrganization, updateFieldData } from '../../../../services/model/format';
//model
import { getOrganizationList } from '../../../../services/model/organization';
import { updateTrustPolicy, createTrustPolicy } from '../../../../services/model/trustPolicy';
import * as serverData from '../../../../services/model/serverData';
import { HELP_TRUST_POLICY_REG } from "../../../../tutorial";
import MexMultiStepper, { updateStepper } from '../../../../hoc/stepper/mexMessageMultiStream'
import { Grid } from '@material-ui/core';

class TrustPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            stepsArray: [],
        }
        this._isMounted = false
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.organizationList = []
        this.cloudletList = []
        this.isUpdate = this.props.action === 'Update'
    }

    validateRemoteCIDR = (form) => {
        if (form.value && form.value.length > 0) {
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|1[0-9]|2[0-9]|3[0-2]?)$/.test(form.value)) {
                form.error = 'Remote CIDR format is invalid (must be between 0.0.0.0/0 to 255.255.255.255/32)'
                return false;
            }
        }
        form.error = undefined;
        return true;

    }

    validatePortRange = (form) => {
        if (form.value && form.value.length > 0) {
            let value = parseInt(form.value)
            if (value < 1 || value > 65535) {
                form.error = 'Invalid Port Range (must be between 1-65535)'
                return false;
            }
        }
        form.error = undefined;
        return true;
    }

    protocolValueChange(currentForm) {
        let parentForm = currentForm.parent.form
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.uuid === parentForm.uuid) {
                for (let j = 0; j < form.forms.length; j++) {
                    let outBoundRulesForm = form.forms[j]
                    if (currentForm.value === 'icmp' && (outBoundRulesForm.field === fields.portRangeMin || outBoundRulesForm.field === fields.portRangeMax)) {
                        outBoundRulesForm.visible = false;
                    }
                    else {
                        outBoundRulesForm.visible = true;
                    }
                }
                break;
            }
        }
        if (this._isMounted) {
            this.setState({
                forms: forms
            })
        }
    }

    onValueChange = (currentForm) => {
        if (currentForm.field === fields.fullIsolation) {
            let forms = this.state.forms;
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.field === fields.outboundSecurityRules || form.field === fields.outboundSecurityRuleMulti) {
                    form.visible = !currentForm.value;
                }
            }
            if (this._isMounted) {
                this.setState({
                    forms: forms
                })
            }
        }

        if (currentForm.field === fields.protocol) {
            this.protocolValueChange(currentForm)
        }
    }

    getOutboundRulesCount = () => {
        let count = 0;
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            if (forms[i].field === fields.outboundSecurityRuleMulti) {
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
                if (this._isMounted) {
                    this.setState({
                        forms: updateForms
                    })
                }
            }
        }
        else {
            this.props.handleAlertInfo('error', 'Enable Full Isolation to disable all rules')
        }
    }

    getOutBoundRules = () => ([
        { field: fields.protocol, label: 'Protocol', formType: 'Select', rules: { required: true, type: 'number', allCaps: true }, width: 3, visible: true, options: ['tcp', 'udp', 'icmp'], serverField: 'protocol', update: { edit: true } },
        { field: fields.portRangeMin, label: 'Port Range Min', formType: 'Input', rules: { required: true, type: 'number' }, width: 3, visible: true, serverField: 'port_range_min', dataValidateFunc: this.validatePortRange, update: { edit: true } },
        { field: fields.portRangeMax, label: 'Port Range Max', formType: 'Input', rules: { required: true, type: 'number' }, width: 3, visible: true, serverField: 'port_range_max', dataValidateFunc: this.validatePortRange, update: { edit: true } },
        { field: fields.remoteCIDR, label: 'Remote CIDR', formType: 'Input', rules: { required: true }, width: 3, visible: true, serverField: 'remote_cidr', dataValidateFunc: this.validateRemoteCIDR, update: { edit: true } },
        { icon: 'delete', formType: 'IconButton', visible: true, style: { color: 'white', top: 15 }, width: 1, onClick: this.removeRulesForm }
    ])

    getOutboundSecurityForm = (outBoundRules) => (
        { uuid: uuid(), field: fields.outboundSecurityRuleMulti, formType: 'MultiForm', forms: outBoundRules, width: 3, visible: true }
    )

    getForms = () => ([
        { label: `${this.isUpdate ? 'Update' : 'Create'} Trust Policy`, formType: MAIN_HEADER, visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true, serverField: 'region', update: { key: true } },
        { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true, update: { key: true } },
        { field: fields.trustPolicyName, label: 'Trust Policy Name', formType: 'Input', placeholder: 'Enter Trust Policy Name', rules: { required: true }, visible: true, update: { key: true } },
        { field: fields.fullIsolation, label: 'Full Isolation', formType: 'Checkbox', visible: true, value: false },
        { field: fields.outboundSecurityRules, label: 'Outbound Security Rules', formType: HEADER, forms: [{ formType: 'IconButton', icon: 'add', style: { color: "white", display: 'inline' }, onClick: this.addRulesForm }], visible: true, update: { id: ['3', '3.1', '3.2', '3.3', '3.4'] } },
    ])

    addRulesForm = (e, form) => {
        if (this._isMounted) {
            this.setState(prevState => ({ forms: [...prevState.forms, this.getOutboundSecurityForm(this.getOutBoundRules())] }))
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

    onUpdateResponse = (mcRequest) => {
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            let request = mcRequest.request;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let labels = [{ label: 'Trust Policy', field: fields.trustPolicyName }]
            if (this._isMounted) {
                this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
            }
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            let outboundSecurityRules = [];
            if (!data[fields.fullIsolation]) {
                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i];
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
            if (outboundSecurityRules.length > 0) {
                data[fields.outboundSecurityRules] = outboundSecurityRules;
            }
            if (this.isUpdate) {
                let updateData = updateFieldData(this, forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    updateTrustPolicy(this, updateData, this.onUpdateResponse)
                }
            }
            else {
                let mcRequest = await serverData.sendRequest(this, createTrustPolicy(data))
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    let policyName = mcRequest.request.data.trustpolicy.key.name;
                    this.props.handleAlertInfo('success', `Trust Policy ${policyName} created successfully`)
                    this.props.onClose(true)
                }
            }
        }
    }

    /*Required*/
    reloadForms = () => {
        if (this._isMounted) {
            this.setState({
                forms: this.state.forms
            })
        }
    }

    stepperClose = () => {
        if (this._isMounted) {
            this.setState({
                stepsArray: []
            })
        }
        this.props.onClose(true)
    }


    render() {
        return (
            <div className="round_panel">
                <Grid container>
                        <Grid item xs={12}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid>
                </Grid>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }



    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region || field === fields.trustPolicyName) {
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

                    if (form.field === fields.fullIsolation) {
                        form.value = data[fields.outboundSecurityRules] && data[fields.outboundSecurityRules].length > 0 ? false : true
                    }
                    else {
                        if (form.field === fields.organizationName) {
                            form.value = data[fields.operatorName]
                        }
                        else {
                            form.value = data[form.field]
                        }
                    }
                    this.disableFields(form)
                }
            }
            else if (form.label) {
                if (data) {
                    if (form.field === fields.outboundSecurityRules) {
                        form.visible = data[fields.outboundSecurityRules] && data[fields.outboundSecurityRules].length > 0 ? true : false
                    }
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.getForms();
        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'} Policy`, formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.operatorName]
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
                        if (outboundRule.field === fields.protocol) {
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
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_TRUST_POLICY_REG)
    }

    componentWillUnmount() {
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

export default withRouter(connect(null, mapDispatchProps)(TrustPolicyReg));