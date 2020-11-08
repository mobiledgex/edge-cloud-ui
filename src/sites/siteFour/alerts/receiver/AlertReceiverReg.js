import React from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, INPUT, MAIN_HEADER } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { fields, getOrganization } from '../../../../services/model/format';
//model
import { createAlertReceiver } from '../../../../services/model/alerts';
import { HELP_FLAVOR_REG } from "../../../../tutorial";
import { Grid } from 'semantic-ui-react';
import * as constant from '../../../../constant'
import { getOrgCloudletList } from '../../../../services/model/cloudlet';
import { getOrganizationList } from '../../../../services/model/organization';
import { getAppInstList } from '../../../../services/model/appInstance';
import { getClusterInstList } from '../../../../services/model/clusterInstance';
import uuid from 'uuid'


const RECEIVER_TYPE = [constant.RECEIVER_TYPE_EMAIL, constant.RECEIVER_TYPE_SLACK]
const RECEIVER_SEVERITY = ["Info", "Warning", "Error"]

class FlavorReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
        }
        this.isUpdate = this.props.isUpdate
        this.regions = constant.regions()
        this.requestedRegionList = [];
        this.cloudletList = [];
        this.appInstList = [];
        this.clusterInstList = []
    }

    locationForm = () => ([
        { field: fields.slackchannel, label: 'Slack Channel', formType: INPUT, placeholder: 'Enter Slack Channel to be Receiving the Alert', rules: { required: true }, width: 8, visible: true, update:true, init:true},
        { field: fields.slackwebhook, label: 'Slack URL', formType: INPUT, placeholder: 'Enter Slack Webhook URL', rules: { required: true }, width: 8, visible: true, update:true, init:true }
    ])

    formKeys = () => {
        return [
            { label: 'Create Alert', formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, visible: true, value: getOrganization() },
            { field: fields.alertname, label: 'Alert Name', formType: INPUT, placeholder: 'Enter Alert Name', rules: { required: true }, visible: true, tip: 'Unique name of this receiver' },
            { field: fields.type, label: 'Receiver Type', formType: SELECT, placeholder: 'Select Receiver Type', rules: { required: true }, visible: true, tip: 'Receiver type - email, or slack' },
            { uuid: uuid(), field: fields.slack, label: 'Slack', formType: INPUT, rules: { required: true }, visible: false, forms: this.locationForm(), tip: 'Slack channel to be receiving the alert\nSlack webhook url'},
            { field: fields.email, label: 'Email', formType: INPUT, placeholder: 'Enter Email Address', rules: { required: true }, visible: false, tip: 'Email address receiving the alert (by default email associated with the account)' },
            { field: fields.severity, label: 'Severity', formType: SELECT, placeholder: 'Select Severity', rules: { required: true }, visible: true, tip: 'Alert severity level - one of "info", "warning", "error"' },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: false }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.cloudletName, label: 'Cloudlet', formType: SELECT, placeholder: 'Select Cloudlet', rules: { required: false }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 8, field: fields.operatorName }] },
            { field: fields.clusterName, label: 'Cluster', formType: SELECT, placeholder: 'Select Clusters', rules: { required: false }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }, { index: 8, field: fields.operatorName }, { index: 9, field: fields.cloudletName }] },
            { field: fields.appName, label: 'App', formType: SELECT, placeholder: 'Select App', rules: { required: false }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }, { index: 8, field: fields.operatorName }, { index: 9, field: fields.cloudletName }, { index: 10, field: fields.clusterName }] },
            { field: fields.version, label: 'App Version', formType: SELECT, placeholder: 'Select App Version', rules: { required: false }, visible: true, dependentData: [{ index: 9, field: fields.appName }] },
        ]
    }

    typeChange = (currentForm, forms, isInit) =>{
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.email) {
                form.visible = currentForm.value === constant.RECEIVER_TYPE_EMAIL
            }
            else if(form.field === fields.slack)
            {
                form.visible = currentForm.value === constant.RECEIVER_TYPE_SLACK  
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    appNameValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.version) {
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    getAppInstInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.appInstList = [...this.appInstList, ...await getAppInstList(this, { region: region })]
        }
        this.updateUI(form)
        this.appNameValueChange(form, forms, true)
        this.setState({ forms: forms })
    }

    getClusterInstInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.clusterInstList = [...this.clusterInstList, ...await getClusterInstList(this, { region: region })]
        }
        this.updateUI(form)
        this.setState({ forms: forms })
    }


    getCloudletInfo = async (form, forms) => {
        let region = undefined;
        let organizationName = undefined;
        for (let i = 0; i < forms.length; i++) {
            let tempForm = forms[i]
            if (tempForm.field === fields.region) {
                region = tempForm.value
            }
            else if (tempForm.field === fields.organizationName) {
                organizationName = tempForm.value
            }
        }
        if (region && organizationName) {
            this.cloudletList = await getOrgCloudletList(this, { region: region, org: organizationName })
            this.updateUI(form)
            this.setState({ forms: forms })
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.appName) {
                this.updateUI(form)
                this.appNameValueChange(form, forms, true)
            }
        }
    }

    clusterValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.appName) {
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    cloudletValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.clusterName) {
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (isInit === undefined || isInit === false) {
                    this.setState({ forms: forms })
                }
                break;
            }
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        this.setState({ region: region })
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.operatorName) {
                this.operatorValueChange(form, forms, isInit)
                if (isInit === undefined || isInit === false) {
                    this.getCloudletInfo(form, forms)
                }
            }
            else if (form.field === fields.appName) {
                if (isInit === undefined || isInit === false) {
                    this.getAppInstInfo(region, form, forms)
                }
            }
            else if (form.field === fields.clusterName) {
                if (isInit === undefined || isInit === false) {
                    this.getClusterInstInfo(region, form, forms)
                }
            }
        }
        this.requestedRegionList.push(region);

    }

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
        else if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === fields.appName) {
            this.appNameValueChange(form, forms, isInit)
        }
        else if (form.field === fields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === fields.clusterName) {
            this.clusterValueChange(form, forms, isInit)
        }
        else if (form.field === fields.type) {
            this.typeChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.slack) {
                            data[fields.slackchannel] = multiFormData[fields.slackchannel]
                            data[fields.slackwebhook] = multiFormData[fields.slackwebhook]
                        }
                    }
                    data[uuid] = undefined
                }
            }
            createAlertReceiver(this, data)
        }
    }


    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    stepperClose = () => {
        this.setState({
            stepsArray: []
        })
        this.props.onClose(true)
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    resetFormValue = (form) => {
        let rules = form.rules
        if (rules) {
            let disabled = rules.disabled ? rules.disabled : false
            if (!disabled) {
                form.value = undefined;
            }
        }
    }

    updateUI(form) {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.type:
                            form.options = RECEIVER_TYPE;
                            break;
                        case fields.severity:
                            form.options = RECEIVER_SEVERITY;
                            break;
                        case fields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case fields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case fields.appName:
                            form.options = this.appInstList
                            break;
                        case fields.version:
                            form.options = this.appInstList
                            break;
                        case fields.clusterName:
                            form.options = this.clusterInstList
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (data) => {
        if (data) {

        }
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            this.organizationList = await getOrganizationList(this)
        }

        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })


        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }

        this.setState({
            forms: forms
        })

    }

    render() {
        return (
            <div className="round_panel">
                <Grid style={{ display: 'flex' }}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }

    componentDidMount() {
        this.getFormData(this.props.data);
        this.props.handleViewMode(HELP_FLAVOR_REG)
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(FlavorReg));