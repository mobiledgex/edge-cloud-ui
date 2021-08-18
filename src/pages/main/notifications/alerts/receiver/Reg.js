import React from 'react';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid'
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, INPUT, MAIN_HEADER } from '../../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { fields } from '../../../../../services/model/format';
import {redux_org} from '../../../../../helper/reduxData'
//model
import { createAlertReceiver } from '../../../../../services/modules/alerts';
import { sendRequests } from '../../../../../services/model/serverWorker'
import * as constant from '../../../../../constant'
import { showOrganizations } from '../../../../../services/modules/organization';
import { showCloudlets } from '../../../../../services/modules/cloudlet';
import { showAppInsts } from '../../../../../services/modules/appInst';
import { showClusterInsts } from '../../../../../services/modules/clusterInst';
import cloneDeep from 'lodash/cloneDeep';
import { Grid, LinearProgress } from '@material-ui/core'
import { resetFormValue } from '../../../../../hoc/forms/helper/constant';
import { endpoint, perpetual } from '../../../../../helper/constant';

const RECEIVER_TYPE = [perpetual.RECEIVER_TYPE_EMAIL, perpetual.RECEIVER_TYPE_SLACK, perpetual.RECEIVER_TYPE_PAGER_DUTY]
const RECEIVER_SEVERITY = [perpetual.INFO, perpetual.WARNING, perpetual.ERROR]

const selector = (self) => {
    let selector = []
    if (redux_org.isAdmin(self) || redux_org.isDeveloper(self)) {
        selector.push({ selector: 'App Instance', key: 'appname' })
        selector.push({ selector: 'Cluster', key: 'cluster' })
    }
    if (redux_org.isAdmin(self) || redux_org.isOperator(self)) {
        selector.push({ selector: 'Cloudlet', key: 'cloudlet' })
    }
    return selector
}
class FlavorReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            loading: true
        }
        this.isUpdate = this.props.isUpdate
        this.regions = constant.regions()
        this.organizationList = []
        this.cloudletList = [];
        this.appInstList = [];
        this.clusterInstList = []
    }

    validatePageDutyVersion = (form) => {
        if (form.value.length !== 32) {
            form.error = 'PagerDuty Integration Key must contain 32 characters'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }
    }

    slackForm = () => ([
        { field: fields.slackchannel, label: 'Slack Channel', formType: INPUT, placeholder: 'Enter Slack Channel to be Receiving the Alert', rules: { required: true }, width: 8, visible: true },
        { field: fields.slackwebhook, label: 'Slack URL', formType: INPUT, placeholder: 'Enter Slack Webhook URL', rules: { required: true }, width: 8, visible: true }
    ])


    formKeys = () => {
        return [
            { label: 'Create Alert Receiver', formType: MAIN_HEADER, visible: true },
            { field: fields.alertname, label: 'Alert Name', formType: INPUT, placeholder: 'Enter Alert Name', rules: { required: true }, visible: true, tip: 'Unique name of this receiver' },
            { field: fields.type, label: 'Receiver Type', formType: SELECT, placeholder: 'Select Receiver Type', rules: { required: true }, visible: true, tip: 'Email\\Slack\\Pagerduty' },
            { uuid: uuid(), field: fields.slack, label: 'Slack', formType: INPUT, rules: { required: true }, visible: false, forms: this.slackForm(), tip: 'Slack channel to be receiving the alert\nSlack webhook url' },
            { field: fields.pagerDutyIntegrationKey, label: 'PagerDuty Integration Key', formType: INPUT, placeholder: 'Enter PagerDuty integration key', rules: { required: true }, visible: false, dataValidateFunc: this.validatePageDutyVersion },
            { field: fields.email, label: 'Email', formType: INPUT, placeholder: 'Enter Email Address', rules: { required: true, type: 'search' }, visible: false, tip: 'Email address receiving the alert (by default email associated with the account)' },
            { field: fields.severity, label: 'Severity', formType: SELECT, placeholder: 'Select Severity', rules: { required: true, firstCaps:true }, visible: true, tip: 'Alert severity level - one of "info", "warning", "error"' },
            { field: fields.selector, label: 'Selector', formType: SELECT, placeholder: 'Select Selector', rules: { required: true, disabled: true }, visible: true, tip: 'Selector for which you want to receive alerts' },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: false }, visible: false },
            { field: fields.organizationName, label: 'Developer', formType: SELECT, placeholder: 'Select Developer', rules: { required: false, disabled: !redux_org.isAdmin(this) ? true : false }, value: redux_org.nonAdminOrg(this), visible: false, tip: 'Cluster or App Developer' },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: false }, visible: false, dependentData: [{ index: 7, field: fields.region, strictDependency: false }] },
            { field: fields.cloudletName, label: 'Cloudlet', formType: SELECT, placeholder: 'Select Cloudlet', rules: { required: false }, visible: false, dependentData: [{ index: 9, field: fields.operatorName }], strictDependency: false },
            { field: fields.clusterName, label: 'Cluster', formType: SELECT, placeholder: 'Select Cluster', rules: { required: false }, visible: false, dependentData: [{ index: 7, field: fields.region, strictDependency: false }, { index: 8, field: fields.organizationName }, { index: 9, field: fields.operatorName, strictDependency: false }, { index: 10, field: fields.cloudletName, strictDependency: false }] },
            { field: fields.appName, label: 'App Instance', formType: SELECT, placeholder: 'Select App Instance', rules: { required: false }, visible: false, dependentData: [{ index: 7, field: fields.region, strictDependency: false }, { index: 8, field: fields.organizationName }, { index: 9, field: fields.operatorName }, { index: 10, field: fields.cloudletName }, { index: 11, field: fields.clusterName }], strictDependency: false },
            { field: fields.version, label: 'App Version', formType: SELECT, placeholder: 'Select App Version', rules: { required: false }, visible: false, dependentData: [{ index: 7, field: fields.region, strictDependency: false }, { index: 8, field: fields.organizationName }, { index: 9, field: fields.operatorName }, { index: 10, field: fields.cloudletName }, { index: 11, field: fields.clusterName }, { index: 12, field: fields.appName }], strictDependency: false }
        ]
    }

    typeChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.email) {
                form.visible = currentForm.value === perpetual.RECEIVER_TYPE_EMAIL
                form.value = this.email
            }
            else if (form.field === fields.slack) {
                form.visible = currentForm.value === perpetual.RECEIVER_TYPE_SLACK
            }
            else if (form.field === fields.pagerDutyIntegrationKey) {
                form.visible = currentForm.value === perpetual.RECEIVER_TYPE_PAGER_DUTY
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
                form.value = undefined
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletName || form.field === fields.appName || form.field === fields.version || form.field === fields.clusterName) {
                form.value = undefined
                this.updateUI(form)
            }
            else if (form.field === fields.operatorName) {
                form.value = redux_org.isOperator(this) ? redux_org.orgName(this) : undefined
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.appName || form.field === fields.version || form.field === fields.clusterName) {
                form.value = undefined
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    clusterValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.appName || form.field === fields.version) {
                form.value = undefined
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
            if (form.field === fields.appName || form.field === fields.version || form.field === fields.clusterName) {
                form.value = undefined
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
            if (form.field === fields.appName || form.field === fields.version || form.field === fields.clusterName || form.field === fields.cloudletName) {
                form.value = undefined
                this.updateUI(form)
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    selectorValueChange = (currentForm, forms, isInit) => {
        const isCloudlet = currentForm.value === 'Cloudlet'
        const isAppInst = currentForm.value === 'App Instance'
        const isCluster = currentForm.value === 'Cluster'
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            switch (form.field) {
                case fields.organizationName:
                    let valid = isAppInst || isCluster
                    form.rules.required = valid
                    form.visible = valid
                    break;
                case fields.region:
                    form.visible = isCloudlet || isAppInst || isCluster
                    break;
                case fields.appName:
                    form.visible = isAppInst
                    break;
                case fields.version:
                    form.visible = isAppInst
                    break;
                case fields.clusterName:
                    form.visible = isAppInst || isCluster
                    break;
                case fields.cloudletName:
                    form.visible = isCloudlet || isAppInst || isCluster
                    break;
                case fields.operatorName:
                    form.rules.required = isCloudlet
                    form.visible = isCloudlet || isAppInst || isCluster
                    form.value = isCloudlet ? redux_org.nonAdminOrg(this) : undefined
                    form.rules.disabled = isCloudlet && !redux_org.isAdmin(this)
                    break;
            }
        }   
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }



    checkForms = (form, forms, isInit) => {
        if (form.field === fields.type) {
            this.typeChange(form, forms, isInit)
        }
        else if (form.field === fields.selector) {
            this.selectorValueChange(form, forms, isInit)
        }
        else if (form.field === fields.region) {
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
            let mcRequest = await createAlertReceiver(this, data)
            if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                this.props.handleAlertInfo('success', `Alert Receiver ${data[fields.alertname]} created successfully`)
                this.props.onClose(true)
            }
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

    updateUI(form) {
        if (form) {
            resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.region:
                            form.options = this.regions
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.type:
                            form.options = RECEIVER_TYPE;
                            break;
                        case fields.severity:
                            form.options = RECEIVER_SEVERITY;
                            break;
                        case fields.selector:
                            form.options = selector(this);
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
            this.email = this.props.userInfo.Email
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
        const { loading } = this.state
        return (
            <div>
                {loading ? <LinearProgress /> : null}
                <div className="round_panel">
                    <Grid container>
                        <Grid item xs={12}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }

    checkOrgExist = () => {
        let org  = redux_org.orgName(this)
        if (redux_org.isOperator(this) && org) {
            let exist = false
            for (let i = 0; i < this.cloudletList.length; i++) {
                let cloudlet = this.cloudletList[i]
                if (cloudlet[fields.operatorName] === org) {
                    exist = true
                    break;
                }
            }
            if (!exist) {
                this.regions.map(region => {
                    let cloudlet = {}
                    cloudlet[fields.operatorName] = org
                    cloudlet[fields.region] = region
                    this.cloudletList.push(cloudlet)
                })
                let forms = cloneDeep(this.state.forms)
                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i]
                    if (form.field === fields.cloudletName) {
                        form.rules.disabled = true
                        break;
                    }
                }
                this.setState({ forms })
            }
        }
    }

    serverResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            mcList.map(mc => {
                if (mc && mc.response && mc.response.status === 200) {
                    let request = mc.request
                    let data = mc.response.data
                    if (request.method === endpoint.SHOW_CLOUDLET || request.method === endpoint.SHOW_ORG_CLOUDLET) {
                        this.cloudletList = [...this.cloudletList, ...data]
                        this.checkOrgExist()
                    }
                    else if (request.method === endpoint.SHOW_APP_INST) {
                        this.appInstList = [...this.appInstList, ...data]
                    }
                    else if (request.method === endpoint.SHOW_CLUSTER_INST) {
                        this.clusterInstList = [...this.clusterInstList, ...data]
                    }
                    else if (request.method === endpoint.SHOW_ORG) {
                        this.organizationList = [...this.organizationList, ...data]
                    }
                }
            })

            let forms = cloneDeep(this.state.forms)
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.selector) {
                    form.rules.disabled = false
                }
                this.updateUI(form)
            }

            this.setState({
                forms: forms,
                loading: false
            })
        }
    }

    fetchData = () => {
        let requestList = []
        requestList.push(showOrganizations())
        this.regions.map(region => {
            requestList.push(showCloudlets(this, { region }))
            if (redux_org.isAdmin(this) || redux_org.isDeveloper(this)) {
                requestList.push(showAppInsts(this, { region }))
                requestList.push(showClusterInsts(this, { region }))
            }
        })
        sendRequests(this, requestList, this.serverResponse)
    }

    componentDidMount() {
        this.getFormData(this.props.data);
        this.fetchData()
    }
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo.data,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FlavorReg));