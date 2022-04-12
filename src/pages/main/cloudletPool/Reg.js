import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item, Step } from 'semantic-ui-react';
import MexForms, { MAIN_HEADER, SELECT, INPUT, DUALLIST } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { service, updateFieldData } from '../../../services';
import { localFields } from '../../../services/fields';

import { getOrganizationList } from '../../../services/modules/organization';
import { cloudletKeys, fetchCloudletData, fetchCloudletField } from '../../../services/modules/cloudlet';
import { createCloudletPool, updateCloudletPool } from '../../../services/modules/cloudletPool';
import { createConfirmation, createInvitation, deleteConfirmation, deleteInvitation } from '../../../services/modules/poolAccess';

import * as constant from '../../../constant';
import { HELP_CLOUDLET_POOL_REG_3, HELP_CLOUDLET_POOL_REG_1 } from "../../../tutorial";
import { perpetual } from '../../../helper/constant';
import { redux_org } from '../../../helper/reduxData'
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog'

const stepData = [
    {
        step: "Step 1",
        description: "Create Pool"
    },
    {
        step: "Step 2",
        description: "Invite Organizations"
    }
]

class CloudletPoolReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            dialogMessageInfo: {}
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        this.action = props.action ? props.action : perpetual.ADD_ORGANIZATION
        this.isOrgDelete = this.action === perpetual.DELETE_ORGANIZATION || this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE
        this.operatorList = []
        this.organizationList = []
        this.cloudletList = []
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getCloudletList = async (forms, form, region, operator) => {
        if (region && operator) {
            this.cloudletList = await fetchCloudletData(this, { region: region, org: operator, type: perpetual.OPERATOR })
            this.cloudletList = this.cloudletList.filter((cloudlet) => {
                return cloudlet[localFields.operatorName] === operator
            })
            this.updateUI(form)
            this.updateState({ forms })
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let operator = undefined
        let cloudletForm = undefined
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.operatorName) {
                operator = form.value
            }
            else if (form.field === localFields.cloudlets) {
                cloudletForm = form
            }
        }
        this.getCloudletList(forms, cloudletForm, currentForm.value, operator)
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        let region = undefined
        let cloudletForm = undefined
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.region) {
                region = form.value
            }
            else if (form.field === localFields.cloudlets) {
                cloudletForm = form
            }
        }
        this.getCloudletList(forms, cloudletForm, region, currentForm.value)
    }

    checkForms = (form, forms, isInit, data) => {
        if (form.field === localFields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
    }

    onValueChange = (currentForm, data) => {
        let forms = this.state.forms
        this.checkForms(currentForm, forms)
    }

    /**
     * Organization Block
     * * */
    organizationAddResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            let valid = true;
            let data = undefined
            mcList.forEach(mc => {
                data = mc.request.data
                if (mc && mc.response && mc.response.status !== 200) {
                    valid = false
                }
            })
            if (valid) {
                let msg = 'created'
                if (this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM || this.action === perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT) {
                    msg = this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM ? 'accepted' : 'rejected'
                }
                this.props.handleAlertInfo('success', `${data['CloudletPoolOrg']} invitation ${msg}`)
                if (mcList.length === 1) {
                    if (redux_org.isAdmin(this)) {
                        this.props.onClose(true)
                    }
                }
                else {
                    this.props.onClose(true)
                }
            }
        }
    }

    organizationRemoveResponse = (mcList) => {
        let valid = true;
        let data = undefined
        if (mcList && mcList.length > 0) {
            mcList.forEach(mc => {
                data = mc.request.data
                if (mc.response.status !== 200) {
                    valid = false;
                }
            })
        }

        let msg = 'Invitation'
        if (this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE) {
            msg = 'Confirmation'
        }

        if (valid && data) {
            if (mcList.length === 1) {
                this.props.handleAlertInfo('success', `${msg} removed successfully from cloudlet pool ${data['CloudletPoolOrg']} for Organization ${data['Org']}`)
            }
            else {
                this.props.handleAlertInfo('success', `${msg} removed successfully from cloudlet pool ${data['CloudletPoolOrg']}`)
            }
            this.props.onClose(true)
        }
    }

    onAddOrganizations = async () => {
        let data = this.formattedData()
        let requestList = []
        let responseCallback = this.isOrgDelete ? this.organizationRemoveResponse : this.organizationAddResponse
        let organizationList = (redux_org.isAdmin(this) || this.isOrgDelete) ? data[localFields.organizations] : [{ organizationName: data[localFields.organizationName] }]
        if (organizationList?.length > 0) {
            organizationList.forEach(organization => {
                let newData = data
                organization = (redux_org.isAdmin(this) || this.isOrgDelete) ? JSON.parse(organization) : organization
                newData[localFields.organizationName] = organization[localFields.organizationName]
                newData[localFields.operatorName] = data[localFields.operatorName]
                let request = undefined
                switch (this.action) {
                    case perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE:
                        request = deleteConfirmation
                        break;
                    case perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM:
                        newData.decision = 'accept'
                        request = createConfirmation
                        break;
                    case perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT:
                        newData.decision = 'reject'
                        request = createConfirmation
                        break;
                    case perpetual.ADD_ORGANIZATION:
                        request = createInvitation
                        break;
                    case perpetual.DELETE_ORGANIZATION:
                        request = deleteInvitation
                        break;
                }
                if (request) {
                    requestList.push(request(newData))
                }
            })
        }
        service.multiAuthRequest(this, requestList, responseCallback)
    }

    getOrganizationData = (dataList, field) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                return { value: JSON.stringify(data), label: data[field] }
            })
    }

    getCloudletData = (dataList, field) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                return { value: data[field], label: data[field] }
            })
    }

    selectOrganization = async (data, isNew) => {
        let region = data[localFields.region];
        let operator = data[localFields.operatorName];
        let selectedDatas = data[localFields.organizations]
        let errorMsg = 'No org to remove'
        if (!this.props.action || this.action === perpetual.ADD_ORGANIZATION) {
            errorMsg = 'No org to invite'
            this.organizationList = await getOrganizationList(this, { type: perpetual.DEVELOPER })
            if (!isNew) {
                this.organizationList = constant.filterData(selectedDatas, this.organizationList, localFields.organizationName);
            }
        }
        else if (this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM || this.action === perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT) {
            errorMsg = `No pending invitation`

            this.organizationList = selectedDatas.filter(org => {
                return org[localFields.status] === 'Pending'
            })
        }
        else if (this.action === perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE) {
            this.organizationList = selectedDatas.filter(org => {
                return org[localFields.status] !== 'Pending'
            })
        }
        else {
            this.organizationList = selectedDatas;
        }
        if (this.organizationList.length > 0 || redux_org.isOperator(this)) {
            let label = 'Create Invitation'
            switch (this.action) {
                case perpetual.ACTION_POOL_ACCESS_ADMIN_CONFIRM:
                    label = 'Accept Invitation'
                    break;
                case perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT:
                    label = 'Reject Invitation'
                    break;
                case perpetual.ADD_ORGANIZATION:
                    label = 'Create Invitation'
                    break;
                case perpetual.ACTION_POOL_ACCESS_ADMIN_REMOVE:
                    label = 'Withdraw Confirmation'
                    break;
                case perpetual.DELETE_ORGANIZATION:
                    label = 'Withdraw Invitation'
                    break;
            }
            let step = [
                { label: 'Organizations', formType: MAIN_HEADER, visible: true },
                { field: localFields.region, label: 'Region', formType: INPUT, rules: { disabled: true }, visible: true, value: region },
                { field: localFields.poolName, label: 'Pool Name', formType: INPUT, rules: { disabled: true }, visible: true, value: data[localFields.poolName] },
                { field: localFields.operatorName, label: 'Operator', formType: INPUT, rules: { disabled: true }, visible: true, value: operator },
                { field: localFields.organizationName, label: 'Organization', placeholder: 'Enter Organization', formType: INPUT, rules: { required: true }, update: { edit: true }, visible: redux_org.isOperator(this) && !this.isOrgDelete },
                { field: localFields.organizations, label: 'Organizations', formType: DUALLIST, rules: { required: true }, visible: redux_org.isAdmin(this) || this.isOrgDelete },
                { label: `${label}`, formType: 'Button', onClick: this.onAddOrganizations },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]
            for (let i = 0; i < step.length; i++) {
                this.updateUI(step[i])
            }
            this.updateState({
                step: 1,
                forms: step
            })
            this.props.handleViewMode(HELP_CLOUDLET_POOL_REG_3)
        }
        else {
            this.props.handleAlertInfo('error', errorMsg)
            this.props.onClose(false)
        }
    }

    /**
     * Organization Block
     * * */

    formattedData = () => {
        let data = {};
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                data[form.field] = form.value;
            }
        }
        return data
    }

    onCreate = async () => {
        let forms = this.state.forms
        let data = this.formattedData()
        data[localFields.cloudlets] = data[localFields.cloudlets].map(item=>{
            return cloudletKeys({cloudletName: item, partnerOperator : fetchCloudletField(this.cloudletList, { cloudletName: item, operatorName: data[localFields.operatorName] }, localFields.partnerOperator)})
        })
        let mcRequest = undefined
        if (this.isUpdate) {
            let updateData = updateFieldData(this, forms, data, this.props.data)
            if (updateData.fields.length > 0) {
                mcRequest = await service.authSyncRequest(this, updateCloudletPool(updateData))
            }
        }
        else {
            mcRequest = await service.authSyncRequest(this, createCloudletPool(data))
        }
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Cloudlet Pool ${data[localFields.poolName]} ${this.isUpdate ? 'updated' : 'created'} successfully`)

            if (this.isUpdate) {
                this.props.onClose(true)
            }
            else {
                this.selectOrganization(data, true)
            }
        }
    }

    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    onDialogClose = (valid) => {
        valid ? this.props.onClose(false) : this.updateState({ dialogMessageInfo: {} })
    }

    render() {
        const { dialogMessageInfo } = this.state
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action ? null :
                        <Step.Group stackable='tablet' style={{ width: '100%' }}>
                            {
                                stepData.map((item, i) => (
                                    <Step active={this.state.step === i} key={i} >
                                        <Step.Content>
                                            <Step.Title>{item.step}</Step.Title>
                                            <Step.Description>{item.description}</Step.Description>
                                        </Step.Content>
                                    </Step>
                                ))
                            }
                        </Step.Group>}
                    <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                    <MexMessageDialog messageInfo={dialogMessageInfo} onClick={this.onDialogClose} /> 
                </Item>
            </div>
        )
    }

    onAddCancel = () => {
        this.updateState({
            dialogMessageInfo: {
                message: perpetual.EXIT_MESSAGE
            }
        })
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

    updateUI = (form, data) => {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === DUALLIST) {
                    switch (form.field) {
                        case localFields.region:
                            form.options = this.props.regions;
                            break;
                        case localFields.operatorName:
                            form.options = this.operatorList
                            break;
                        case localFields.cloudlets:
                            form.options = this.getCloudletData(this.cloudletList, localFields.cloudletName)
                            break;
                        case localFields.organizations:
                            form.options = this.getOrganizationData(this.organizationList, localFields.organizationName)
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (data) => {
        let operator = {}
        operator[localFields.operatorName] = data[localFields.operatorName];
        this.operatorList = [operator]

        if (this.action === perpetual.ADD_CLOUDLET) {
            this.cloudletList = await fetchCloudletData(this, { region: data[localFields.region], org: data[localFields.operatorName], type: perpetual.OPERATOR })
            data[localFields.cloudlets] = data[localFields.cloudlets].map(item=>item[localFields.cloudletName])
        }
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            let orgList = await getOrganizationList(this, { type: perpetual.OPERATOR })
            this.operatorList = orgList.map(org => {
                return org[localFields.organizationName]
            })
        }

        if (this.props.org) {
            this.selectOrganization(data, false)
        }
        else {
            let forms = [
                { label: `${this.isUpdate ? 'Update' : 'Create'} Cloudlet Pool`, formType: MAIN_HEADER, visible: true },
                { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
                { field: localFields.poolName, label: 'Pool Name', formType: INPUT, placeholder: 'Enter Cloudlet Pool Name', rules: { required: true }, visible: true, update: { key: true } },
                { field: localFields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) ? true : false }, visible: true, value: redux_org.nonAdminOrg(this), update: { key: true } },
                { field: localFields.cloudlets, label: 'Cloudlets', formType: DUALLIST, update: { id: ['3'] }, rules: { required: false }, visible: true },
                { label: `${this.isUpdate ? 'Update' : 'Create'}`, formType: 'Button', onClick: this.onCreate, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]

            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                this.updateUI(form)
                if (data) {
                    form.value = data[form.field]
                }
            }

            this.updateState({
                forms
            })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_CLOUDLET_POOL_REG_1);
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletPoolReg));