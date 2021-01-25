import React from 'react';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
import { connect } from 'react-redux';
import MexForms, { SELECT, INPUT, MAIN_HEADER, BUTTON, DUALLIST } from '../../../hoc/forms/MexForms';
import { Grid } from '@material-ui/core'
import { fields, getOrganization } from '../../../services/model/format';
import { BILLING_ADD_CHILD, DEVELOPER, BILLING_REMOVE_CHILD, validatePhone } from '../../../constant';
import { resetFormValue } from '../../../hoc/forms/helper/constant';
import { createBillingOrg, addBillingChild, removeBillingChild } from '../../../services/model/billingOrg';
import { getOrganizationList } from '../../../services/model/organization';
import { BILLING_TYPE_PARENT, BILLING_TYPE_SELF } from '../../../constant';
import * as serverData from '../../../services/model/serverData';

class BillingOrgReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false;
        this.isUpdate = false
        this.organizationList = []
        this.billingOrgList = []
        this.actionId = props.action
        this.orgData = this.props.data
    }

    formKeys = () => {
        return [
            { label: 'Create Billing Org', formType: MAIN_HEADER, visible: true },
            { field: fields.type, label: 'Type', formType: SELECT, placeholder: 'Select Type', rules: { required: true }, visible: true, tip: 'Billing type self or group' },
            { field: fields.name, label: 'Name', formType: INPUT, placeholder: 'Enter Billing Group Name', rules: { required: true }, visible: false, tip: 'Billing group name' },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, visible: false, value: getOrganization() },
            { field: fields.firstName, label: 'First Name', formType: INPUT, placeholder: 'Enter First Name', rules: { required: true }, visible: true, tip: 'First name' },
            { field: fields.lastName, label: 'Last Name', formType: INPUT, placeholder: 'Enter Last Name', rules: { required: true }, visible: true, tip: 'Last name' },
            { field: fields.email, label: 'Email', formType: INPUT, placeholder: 'Enter Email Address', rules: { required: true }, visible: true, tip: 'Email address' },
            { field: fields.address, label: 'Address', formType: INPUT, placeholder: 'Enter Address', rules: { required: false }, visible: true, tip: 'Address' },
            { field: fields.country, label: 'Country', formType: INPUT, placeholder: 'Enter Country', rules: { required: false }, visible: true, tip: 'Country' },
            { field: fields.state, label: 'State', formType: INPUT, placeholder: 'Enter State', rules: { required: false }, visible: true, tip: 'State' },
            { field: fields.city, label: 'City', formType: INPUT, placeholder: 'Enter City', rules: { required: false }, visible: true, tip: 'City' },
            { field: fields.postalCode, label: 'Postal Code', formType: INPUT, placeholder: 'Enter Postal Code', rules: { required: false }, visible: true, tip: 'Postal code' },
            { field: fields.phone, label: 'Phone', formType: INPUT, placeholder: 'Enter Phone Number', rules: { required: false }, visible: true, tip: 'Phone number' },
        ]
    }

    formChildKeys = () => {
        return [
            { label: `${this.actionId === BILLING_ADD_CHILD ? 'Add Child' : 'Remove Child'}`, formType: MAIN_HEADER, visible: true },
            { field: fields.name, label: 'Name', formType: INPUT, placeholder: 'Enter Billing Group Name', rules: { disabled: true }, visible: true, tip: 'Billing group' },
            { field: fields.organizations, label: 'Organization', formType: DUALLIST, placeholder: 'Select Organization', visible: true },
        ]
    }

    updateForm = (forms, isInit) => {
        if (this._isMounted && isInit === undefined || isInit === false) {
            this.setState({ forms })
        }
    }

    onTypeChange = (currentForm, forms, isInit) => {
        for (let i in forms) {
            let form = forms[i]
            if (form.field === fields.organizationName) {
                form.visible = currentForm.value === BILLING_TYPE_SELF
            }
            else if (form.field === fields.name) {
                form.visible = currentForm.value === BILLING_TYPE_PARENT
            }
        }
        this.updateForm(forms, isInit)
    }

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.type) {
            this.onTypeChange(form, forms, isInit)
        }
    }

    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    reloadForms = () => {

    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    childResponse = (mcList) => {
        let valid = true;
        if (mcList && mcList.length > 0) {

            for (let i = 0; i < mcList.length; i++) {
                let mcRequest = mcList[i];
                if (mcRequest.response.status !== 200) {
                    valid = false;
                }
            }
        }

        if (valid) {
            let msg = this.actionId === BILLING_ADD_CHILD ? 'added' : 'removed'
            this.props.handleAlertInfo('success', `Billing org ${msg} successfully`)
            this.props.onClose(true)
        }
    }

    onCreate = async (data) => {
        if (this.actionId === BILLING_ADD_CHILD || this.actionId === BILLING_REMOVE_CHILD) {
            let organizations = data[fields.organizations]
            let requestList = []
            let requestType = this.actionId === BILLING_REMOVE_CHILD ? removeBillingChild : addBillingChild
            organizations.map(children => {
                requestList.push(requestType({ name: data[fields.name], children }))
            })
            if (requestList.length > 0) {
                serverData.sendMultiRequest(this, requestList, this.childResponse)
            }
            // let mc = await addBillingChild(this, data)
        }
        else {
            let mc = await createBillingOrg(this, data)
            if (mc && mc.response && mc.response.status === 200) {
                let isParent = data[fields.type] === BILLING_TYPE_PARENT
                this.props.handleAlertInfo('success', `Billing  ${isParent ? 'group' : 'org'} ${isParent ? data[fields.name] : data[fields.organizationName]} created successfully`)
                this.props.onClose(true)
            }
        }
    }


    render() {
        const { loading, forms } = this.state
        return (
            <div>
                <div className="round_panel">
                    <Grid container>
                        <Grid item xs={12}>
                            <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }

    updateUI = (form) => {
        if (form) {
            resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === DUALLIST) {
                    switch (form.field) {
                        case fields.type:
                            form.options = [BILLING_TYPE_SELF, BILLING_TYPE_PARENT]
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.organizations:
                            form.options = this.actionId === BILLING_REMOVE_CHILD ? this.removeBillingOrgList(this.billingOrgList) : this.addBillingOrgList(this.organizationList)
                            break;
                    }
                }
            }
        }
    }

    addBillingOrgList = (dataList) => {
        let optionList = []
        if (dataList && dataList.length > 0) {
            for (let i in dataList) {
                let data = dataList[i]
                let exist = false
                for (let j in this.billingOrgList) {
                    let billingOrg = this.billingOrgList[j]
                    let children = billingOrg[fields.children]
                    if (children && children.includes(data[fields.organizationName])) {
                        exist = true
                        break;
                    }
                }
                if (!exist && data[fields.type] === DEVELOPER.toLowerCase()) {
                    optionList.push({ value: data[fields.organizationName], label: data[fields.organizationName] })
                }
            }
        }
        return optionList
    }

    removeBillingOrgList = () => {
        let optionList = []
        let children = this.orgData[fields.children]
        if (children) {
            let dataList = children.split(',')
            for (let i in dataList) {
                let data = dataList[i]
                optionList.push({ value: data, label: data })
            }
        }
        return optionList
    }

    getFormData = async (data) => {
        let forms = []
        this.organizationList = await getOrganizationList(this)

        forms = data ? this.formChildKeys() : this.formKeys()
        
        let createLabel = this.actionId ? this.actionId === BILLING_ADD_CHILD ? 'Add' : 'Remove' : this.isUpdate ? 'Update' : 'Create'
        forms.push(
            { label: createLabel, formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })

        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }
        this.setState({ forms })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.orgData);
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

export default withRouter(connect(null, mapDispatchProps)(BillingOrgReg));