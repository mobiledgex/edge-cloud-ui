/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../../actions';
import { connect } from 'react-redux';
import MexForms, { SELECT, INPUT, MAIN_HEADER, BUTTON, DUALLIST } from '../../../../hoc/forms/MexForms';
import { Grid } from '@material-ui/core'
import { localFields } from '../../../../services/fields';
import { redux_org } from '../../../../helper/reduxData'
import { perpetual } from '../../../../helper/constant';
import { resetFormValue } from '../../../../hoc/forms/helper/constant';
import { createBillingOrg, updateBillingOrg, addBillingChild, removeBillingChild } from '../../../../services/modules/billingorg';
import { getOrganizationList } from '../../../../services/modules/organization';
import { service } from '../../../../services';

class BillingOrgReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false;
        this.organizationList = []
        this.billingOrgList = []
        this.actionId = props.action
        this.isUpdate = this.actionId === perpetual.ACTION_UPDATE
        this.orgData = this.props.data
    }

    formKeys = () => {
        return [
            { label: 'Create Billing Org', formType: MAIN_HEADER, visible: true },
            { field: localFields.type, label: 'Type', formType: SELECT, placeholder: 'Select Type', rules: { required: true, firstCaps: true }, visible: true, tip: 'Billing type self or group' },
            { field: localFields.name, label: 'Name', formType: INPUT, placeholder: 'Enter Billing Group Name', rules: { required: true }, visible: false, tip: 'Billing group name' },
            { field: localFields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: redux_org.isAdmin(this) ? false : true, disabled: !redux_org.isAdmin(this) ? true : false }, visible: false, value: redux_org.nonAdminOrg(this) },
            { field: localFields.firstName, label: 'First Name', formType: INPUT, placeholder: 'Enter First Name', rules: { required: true }, update: { edit: true }, visible: true, tip: 'First name' },
            { field: localFields.lastName, label: 'Last Name', formType: INPUT, placeholder: 'Enter Last Name', rules: { required: true }, update: { edit: true }, visible: true, tip: 'Last name' },
            { field: localFields.email, label: 'Email', formType: INPUT, placeholder: 'Enter Email Address', rules: { required: true, type: 'search' }, visible: true, update: { edit: true }, tip: 'Email address' },
            { field: localFields.address, label: 'Address', formType: INPUT, placeholder: 'Enter Address', rules: { required: false, type: 'search' }, update: { edit: true }, visible: true, tip: 'Address' },
            { field: localFields.country, label: 'Country', formType: INPUT, placeholder: 'Enter Country', rules: { required: false, type: 'search' }, update: { edit: true }, visible: true, tip: 'Country' },
            { field: localFields.state, label: 'State', formType: INPUT, placeholder: 'Enter State', rules: { required: false, type: 'search' }, update: { edit: true }, visible: true, tip: 'State' },
            { field: localFields.city, label: 'City', formType: INPUT, placeholder: 'Enter City', rules: { required: false, type: 'search' }, update: { edit: true }, visible: true, tip: 'City' },
            { field: localFields.postalCode, label: 'Postal Code', formType: INPUT, placeholder: 'Enter Postal Code', rules: { required: false, type: 'search' }, visible: true, update: { edit: true }, tip: 'Postal code' },
            { field: localFields.phone, label: 'Phone', formType: INPUT, placeholder: 'Enter Phone Number', rules: { required: false }, visible: true, update: { edit: true }, tip: 'Phone number' },
        ]
    }

    formChildKeys = () => {
        return [
            { label: `${this.actionId === perpetual.ACTION_BILLING_ADD_CHILD ? 'Add Child' : 'Remove Child'}`, formType: MAIN_HEADER, visible: true },
            { field: localFields.name, label: 'Name', formType: INPUT, placeholder: 'Enter Billing Group Name', rules: { disabled: true }, visible: true, tip: 'Billing group' },
            { field: localFields.organizations, label: 'Organization', formType: DUALLIST, placeholder: 'Select Organization', visible: true },
        ]
    }

    updateForm = (forms, isInit) => {
        if (this._isMounted && !isInit) {
            this.setState({ forms })
        }
    }

    onTypeChange = (currentForm, forms, isInit) => {
        for (let i in forms) {
            let form = forms[i]
            if (form.field === localFields.organizationName) {
                form.visible = currentForm.value === perpetual.BILLING_TYPE_SELF
            }
            else if (form.field === localFields.name) {
                form.visible = currentForm.value === perpetual.BILLING_TYPE_PARENT
            }
        }
        this.updateForm(forms, isInit)
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === localFields.type) {
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
            let msg = this.actionId === perpetual.ACTION_BILLING_ADD_CHILD ? 'added' : 'removed'
            this.props.handleAlertInfo('success', `Billing org ${msg} successfully`)
            this.props.onClose(true)
        }
    }

    onCreate = async (data) => {
        if (this.actionId === perpetual.ACTION_BILLING_ADD_CHILD || this.actionId === perpetual.ACTION_BILLING_REMOVE_CHILD) {
            let organizations = data[localFields.organizations]
            let requestList = []
            let requestType = this.actionId === perpetual.ACTION_BILLING_REMOVE_CHILD ? removeBillingChild : addBillingChild
            organizations.map(children => {
                requestList.push(requestType({ name: data[localFields.name], children }))
            })
            if (requestList.length > 0) {
                service.multiAuthRequest(this, requestList, this.childResponse)
            }
        }
        else {
            let mc = this.isUpdate ? await updateBillingOrg(this, data) : await createBillingOrg(this, data)
            if (mc && mc.response && mc.response.status === 200) {
                let isParent = data[localFields.type] === perpetual.BILLING_TYPE_PARENT
                this.props.handleAlertInfo('success', `Billing  ${isParent ? 'group' : 'org'} ${isParent ? data[localFields.name] : data[localFields.organizationName]} ${this.isUpdate ? 'update' : 'created'} successfully`)
                this.props.onClose(true)
            }
        }
    }


    render() {
        const { forms } = this.state
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
                        case localFields.type:
                            form.options = [perpetual.BILLING_TYPE_SELF, perpetual.BILLING_TYPE_PARENT]
                            break;
                        case localFields.organizationName:
                            form.options = this.organizationList
                            break;
                        case localFields.organizations:
                            form.options = this.actionId === perpetual.ACTION_BILLING_REMOVE_CHILD ? this.removeBillingOrgList(this.billingOrgList) : this.addBillingOrgList(this.organizationList)
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
                    let children = billingOrg[localFields.children]
                    if (children && children.includes(data[localFields.organizationName])) {
                        exist = true
                        break;
                    }
                }
                if (!exist && data[localFields.type] === perpetual.DEVELOPER) {
                    optionList.push({ value: data[localFields.organizationName], label: data[localFields.organizationName] })
                }
            }
        }
        return optionList
    }

    removeBillingOrgList = () => {
        let optionList = []
        let children = this.orgData[localFields.children]
        if (children) {
            let dataList = children.split(',')
            for (let i in dataList) {
                let data = dataList[i]
                optionList.push({ value: data, label: data })
            }
        }
        return optionList
    }

    loadDefaultData = async (forms, data) => {
        let organization = {}
        organization[localFields.organizationName] = data[localFields.name];
        this.organizationList = [organization]
    }

    actionLabel = () => {
        let label = 'Create'
        switch (this.actionId) {
            case perpetual.ACTION_BILLING_ADD_CHILD:
                label = 'Add'
                break;
            case perpetual.ACTION_BILLING_REMOVE_CHILD:
                label = 'Remove'
                break;
            case perpetual.ACTION_UPDATE:
                label = 'Update'
                break;
            default:
                label = 'Create'
        }
        return label
    }

    getFormData = async (data) => {
        let forms = []

        if (data) {
            if (this.isUpdate) {
                forms = this.formKeys()
                await this.loadDefaultData(forms, data)
            }
            else {
                this.organizationList = await getOrganizationList(this)
                forms = this.formChildKeys()
            }
        }
        else {
            this.organizationList = await getOrganizationList(this)
            forms = this.formKeys()
        }

        forms.push(
            { label: this.actionLabel(), formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })

        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.field === localFields.organizationName) {
                    form.value = data[localFields.name]
                }
                form.value = data[form.field] ? data[form.field] : form.value
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(BillingOrgReg));