import React from 'react';
import { withRouter } from 'react-router-dom';
import MexForms, { MAIN_HEADER } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { fields, updateFieldData } from '../../../../services/model/format';
import { redux_org} from '../../../../helper/reduxData'
//model
import { getOrganizationList } from '../../../../services/modules/organization';
import { updateAutoScalePolicy, createAutoScalePolicy } from '../../../../services/model/autoScalePolicy';
import { HELP_SCALE_POLICY_REG } from "../../../../tutorial";
import { Grid } from '@material-ui/core';
import { service } from '../../../../services';
import { perpetual } from '../../../../helper/constant';

class AutoScalePolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false
        this.isUpdate = this.props.action === 'Update'
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.organizationList = []
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    validateNodes = (currentForm) => {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            if (value <= 0) {
                currentForm.error = 'Node must be greater than 0'
                return false;
            }
            else if (currentForm.field === fields.maximumNodes) {
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

    validateScaleThreshold = (currentForm) => {
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            if (value <= 0 || value > 100) {
                currentForm.error = 'Scale threshold must be between 1 and 100'
                return false;
            }
            else if (currentForm.field === fields.scaleUpCPUThreshold) {
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
        { label: `${this.isUpdate ? 'Update' : 'Create'} Auto Scale Policy`, formType: MAIN_HEADER, visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true, serverField: 'region', tip: 'Select region where you want to create policy', update: { key: true } },
        { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Developer', rules: { required: redux_org.isAdmin(this), disabled: !redux_org.isAdmin(this) }, value: redux_org.nonAdminOrg(this), visible: true, tip: 'Name of the Organization that this policy belongs to', update: { key: true } },
        { field: fields.autoScalePolicyName, label: 'Auto Scale Policy Name', formType: 'Input', placeholder: 'Enter Auto Scale Policy Name', rules: { required: true }, visible: true, tip: 'Policy name', update: { key: true } },
        { field: fields.minimumNodes, label: 'Minimum Nodes', formType: 'Input', placeholder: 'Enter Minimum Nodes', rules: { type: 'number', required: true, onBlur: true }, visible: true, update: { id: ['3'] }, dataValidateFunc: this.validateNodes, tip: 'Minimum number of cluster nodes' },
        { field: fields.maximumNodes, label: 'Maximum Nodes', formType: 'Input', placeholder: 'Enter Maximum Nodes', rules: { type: 'number', required: true, onBlur: true }, visible: true, update: { id: ['4'] }, dataValidateFunc: this.validateNodes, tip: 'Maximum number of cluster nodes' },
        { field: fields.scaleDownCPUThreshold, label: 'Scale Down CPU Threshold', formType: 'Input', placeholder: 'Enter Scale Down CPU Threshold', rules: { type: 'number', required: true, onBlur: true }, unit: '%', visible: true, update: { id: ['6'] }, dataValidateFunc: this.validateScaleThreshold, tip: 'Scale down cpu threshold (percentage 1 to 100)' },
        { field: fields.scaleUpCPUThreshold, label: 'Scale Up CPU Threshold', formType: 'Input', placeholder: 'Enter Scale Up CPU Threshold', rules: { type: 'number', required: true, onBlur: true }, unit: '%', visible: true, update: { id: ['5'] }, dataValidateFunc: this.validateScaleThreshold, tip: 'Scale up cpu threshold (percentage 1 to 100)' },
        { field: fields.triggerTime, label: 'Trigger Time', formType: 'Input', placeholder: 'Enter Trigger Time In Seconds', rules: { type: 'number', required: true }, unit: 'sec', visible: true, update: { id: ['7'] }, tip: 'The time that the sampled CPU threshold must be continuously met before triggering the auto-scale action. This is to prevent possible anomalies of CPU activity (or lack thereof) from triggering unwanted scale up/down actions, in the event that the anomaly activity occurs right when the CPU usage is sampled' },
    ])


    onCreate = async (data) => {
        if (data) {
            let mcRequest = undefined
            if (this.isUpdate) {
                let updateData = updateFieldData(this, this.state.forms, data, this.props.data)
                if (updateData.fields.length > 0) {
                    mcRequest = await service.authSyncRequest(this, updateAutoScalePolicy(updateData))
                }
            }
            else {
                mcRequest = await service.authSyncRequest(this, createAutoScalePolicy(data))
            }
            if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                let msg = this.isUpdate ? 'updated' : 'created'
                this.props.handleAlertInfo('success', `Auto Scale Policy ${data[fields.autoScalePolicyName]} ${msg} successfully`)
                this.props.onClose(true)
            }
        }
    }

    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }


    render() {
        return (
            <div className="round_panel">
                <Grid container>
                    <Grid item xs={12}>
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Grid>
                </Grid>
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
            else if (form.label) {
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
            { label: `${this.isUpdate ? 'Update' : 'Create'} Policy`, formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName]
            this.organizationList = [organization]

            this.loadData(forms, data)
        }
        else {
            this.organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
            this.loadData(forms)
        }

        this.updateState({ forms })

    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_SCALE_POLICY_REG)
    }

    componentWillUnmount(){
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
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