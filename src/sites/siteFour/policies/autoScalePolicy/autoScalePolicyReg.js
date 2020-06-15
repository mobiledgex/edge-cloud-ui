import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import MexForms from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import {fields, getOrganization} from '../../../../services/model/format';
//model
import {getOrganizationList} from '../../../../services/model/organization';
import {updateAutoScalePolicy, createAutoScalePolicy} from '../../../../services/model/autoScalePolicy';
import * as serverData from '../../../../services/model/serverData';
import {PolicyTutor} from "../../../../tutorial";

const policySteps = PolicyTutor();

class AutoScalePolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
    }

    validateNodes=(currentForm)=>
    {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            if(value <= 0)
            {
                currentForm.error = 'Node must be greater than 0' 
                return false; 
            }
            else if(currentForm.field === fields.maximumNodes)
            {
                let forms = this.state.forms
                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i]
                    if (form.field === fields.minimumNodes) {
                        let minNode = parseInt(form.value)
                        if (value <= minNode) {
                            currentForm.error = 'Maximum nodes must be greater than minimum nodes'
                            return false;
                        }
                        break;
                    }
                }
            }
        }
        currentForm.error = undefined;
        return true;
    }

    validateScaleThreshold=(currentForm)=>
    {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            if(value <= 0 || value > 100)
            {
                currentForm.error = 'Scale threshold must be between 1 and 100' 
                return false; 
            }
            else if(currentForm.field === fields.scaleUpCPUThreshold)
            {
                let forms = this.state.forms
                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i]
                    if (form.field === fields.scaleDownCPUThreshold) {
                        let scaleDown = parseInt(form.value)
                        if (value <= scaleDown) {
                            currentForm.error = 'Scale up threshold must be greater than scale down threshold'
                            return false;
                        }
                        break;
                    }
                }
            }
        }
        currentForm.error = undefined;
        return true;
    }


    checkForms = (form, forms, isInit) => {
       
    }

    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    
    getForms = () => ([
        { label: 'Create Auto Scale Policy', formType: 'Header', visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true, serverField: 'region', tip: 'Select region where you want to create policy' },
        { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true, tip: 'Name of the Organization that this policy belongs to' },
        { field: fields.autoScalePolicyName, label: 'Auto Scale Policy Name', formType: 'Input', placeholder: 'Enter Auto Scale Policy Name', rules: { required: true }, visible: true, tip: 'Policy name' },
        { field: fields.minimumNodes, label: 'Minimum Nodes', formType: 'Input', placeholder: 'Enter Minimum Nodes', rules: { type: 'number', required: true, onBlur: true }, visible: true, update: true, dataValidateFunc: this.validateNodes, tip: 'Minimum number of cluster nodes' },
        { field: fields.maximumNodes, label: 'Maximum Nodes', formType: 'Input', placeholder: 'Enter Maximum Nodes', rules: { type: 'number', required: true, onBlur: true }, visible: true, update: true, dataValidateFunc: this.validateNodes, tip: 'Maximum number of cluster nodes' },
        { field: fields.scaleDownCPUThreshold, label: 'Scale Down CPU Threshold', formType: 'Input', placeholder: 'Enter Scale Down CPU Threshold', rules: { type: 'number', required: true, onBlur: true }, unit: '%', visible: true, update: true, dataValidateFunc: this.validateScaleThreshold, tip: 'Scale down cpu threshold (percentage 1 to 100)' },
        { field: fields.scaleUpCPUThreshold, label: 'Scale Up CPU Threshold', formType: 'Input', placeholder: 'Enter Scale Up CPU Threshold', rules: { type: 'number', required: true, onBlur: true }, unit: '%', visible: true, update: true, dataValidateFunc: this.validateScaleThreshold, tip: 'Scale up cpu threshold (percentage 1 to 100)' },
        { field: fields.triggerTime, label: 'Trigger Time', formType: 'Input', placeholder: 'Enter Trigger Time In Seconds', rules: { type: 'number', required: false }, unit: 'sec', visible: true, update: true, tip: 'Trigger time defines how long trigger threshold must be satified in seconds before acting upon it' },
    ])

    
    onCreate = async (data) => {
        if (data) {
            let mcRequest = await serverData.sendRequest(this, this.props.action === 'Update' ? updateAutoScalePolicy(data) : createAutoScalePolicy(data))
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
                    this.props.handleAlertInfo('success', `Auto Scale Policy ${data[fields.autoScalePolicyName]} ${msg} successfully`)
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
                <div className="grid_table" >
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
        if (field === fields.organizationName || field === fields.region || field === fields.autoScalePolicyName) {
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
                    form.value = data[form.field]
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
        }
        else {
            this.organizationList = await getOrganizationList(this)
            this.loadData(forms)
        }

        this.setState({
            forms: forms
        })

    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode( policySteps.stepsNewPolicyPrivacy )
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoScalePolicyReg));
