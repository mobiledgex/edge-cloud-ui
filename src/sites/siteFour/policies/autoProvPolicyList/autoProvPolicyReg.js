import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import MexForms, { SELECT, DUALLIST, INPUT, BUTTON, HEADER, MULTI_FORM } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import * as serverData from '../../../../services/model/serverData';
import { fields, getOrganization } from '../../../../services/model/format';

import * as constant from '../../../../constant'
import { getOrganizationList } from '../../../../services/model/organization';
import { getOrgCloudletList } from '../../../../services/model/cloudlet';
import { createAutoProvPolicy, updateAutoProvPolicy, addAutoProvCloudletKey, deleteAutoProvCloudletKey } from '../../../../services/model/autoProvisioningPolicy';
import {PolicyTutor} from "../../../../tutorial";


const policySteps = PolicyTutor();

class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
    }

    getCloudletData = (dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let dualFormat = {}
                let cloudletName = data[fields.cloudletName];
                dualFormat[fields.cloudletName] = cloudletName
                dualFormat[fields.operatorName] = data[fields.operatorName]
                dualFormat[fields.cloudletLocation] = data[fields.cloudletLocation]
                return { value: JSON.stringify(dualFormat), label: cloudletName }
            })
    }

    getCloudletInfo = async (form, forms) => {
        let region = undefined;
        let organization = undefined;
        for (let i = 0; i < form.dependentData.length; i++) {
            let dependentForm = forms[form.dependentData[i].index]
            if(dependentForm.field === fields.region)
            {
                region = dependentForm.value
            }
            else if(dependentForm.field === fields.organizationName)
            {
                organization = dependentForm.value 
            }
        }
        if (region && organization && !this.isUpdate) {
            this.cloudletList = await getOrgCloudletList(this, { region: region, org: organization })
            this.updateUI(form)
            this.setState({ forms: forms })
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudlets) {
                this.getCloudletInfo(form, forms)
            }
        }
    }

    organizationValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudlets) {
                this.getCloudletInfo(form, forms)
                break;
            }
        }
    }

    checkForms = (form, forms, isInit, data) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.organizationName) {
            this.organizationValueChange(form, forms, isInit)
        }
    }

    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    filterCloudlets = () => {
        let newCloudletList = []
        if (this.props.data) {
            let selectedCloudlets = this.props.data[fields.cloudlets]
            if (selectedCloudlets && selectedCloudlets.length > 0) {
                for (let i = 0; i < selectedCloudlets.length; i++) {
                    let selectedCloudlet = selectedCloudlets[i];
                    for (let j = 0; j < this.cloudletList.length; j++) {
                        let cloudlet = this.cloudletList[j]
                        if (selectedCloudlet[fields.cloudletName] === cloudlet[fields.cloudletName]) {
                            if (this.props.action === constant.ADD_CLOUDLET) {
                                this.cloudletList.splice(j, 1)
                            }
                            else if (this.props.action === constant.DELETE_CLOUDLET) {
                                newCloudletList.push(cloudlet)
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.cloudletList = newCloudletList.length > 0 ? newCloudletList : this.cloudletList
    }


    selectCloudlet = async (data) => {
        let region = data[fields.region]
        let organization = data[fields.organizationName]
        let autoPolicyName = data[fields.autoPolicyName]
        if (this.cloudletList && this.cloudletList.length > 0) {
            let action = 'Add'
            if (this.props.action === constant.DELETE_CLOUDLET) {
                action = 'Delete'
            }
            this.filterCloudlets();
            let forms = [
                { label: `${action} Cloudlets`, formType: HEADER, visible: true },
                { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { disabled: true }, visible: true, options: [{ key: region, value: region, text: region }], value: region },
                { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { disabled: true }, visible: true, options: [{ key: organization, value: organization, text: organization }], value: organization },
                { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: INPUT, placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible: true, value: autoPolicyName },
                { field: fields.cloudlets, label: 'Cloudlets', formType: DUALLIST, rules: { required: true }, visible: true },
                { label: `${action}`, formType: BUTTON, onClick: this.onAddCloudlets },
                { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel }
            ]
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                this.updateUI(form)
            }
            this.setState({
                forms: forms
            })
            this.props.handleViewMode( policySteps.stepsNewPolicy2 );
        }
        else
        {
            this.props.handleAlertInfo('error', 'No Cloudlets present')
            this.props.onClose(true)
        }

    }

    addCloudletResponse = (mcRequestList) => {
        let valid = false;
        if (mcRequestList && mcRequestList.length > 0) {

            for (let i = 0; i < mcRequestList.length; i++) {
                let mcRequest = mcRequestList[i];
                if (mcRequest.response.status === 200) {
                    valid = true;
                }
            }
        }

        if (valid) {
            let msg = this.props.action === constant.DELETE_CLOUDLET ? 'removed' : 'added'
            this.props.handleAlertInfo('success', `Cloudlets ${msg} successfully`)
            this.props.onClose(true)
        }
    }

    onCreateAutoProvPolicy = async (data) => {
        if (data[fields.deployClientCount] || data[fields.minActiveInstances]) {
            let mcRequest = await serverData.sendRequest(this, this.isUpdate ? updateAutoProvPolicy(this.state.forms, data, this.props.data) : createAutoProvPolicy(data))
            if (mcRequest && mcRequest.response) {
                let response = mcRequest.response;
                if (response.status === 200) {
                    this.props.handleAlertInfo('success', `Auto Provisioning Policy ${data[fields.autoPolicyName]} ${this.isUpdate ? 'update' : 'created'} successfully`)
                    this.props.onClose(true)
                }
            }
        }
        else {
            this.props.handleAlertInfo('error', `Please define either deploy request count or minimum active instances`)
        }
    }

    onAddCloudlets = (data) => {
        let requestDataList = []
        let cloudletList = data[fields.cloudlets]
        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = JSON.parse(cloudletList[i])
                data.cloudletName = cloudlet[fields.cloudletName]
                data.operatorName = cloudlet[fields.operatorName]
                if (this.props.action === constant.DELETE_CLOUDLET) {
                    requestDataList.push(deleteAutoProvCloudletKey(data))
                }
                else {
                    requestDataList.push(addAutoProvCloudletKey(data))
                }
            }
        }
        serverData.sendMultiRequest(this, requestDataList, this.addCloudletResponse)
    }

    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    render() {
        return (
            <div className="round_panel" >
                <div className="grid_table" >
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                    </Item>
                </div>
            </div>
        )
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
                if (form.formType === SELECT || form.formType === DUALLIST) {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.cloudlets:
                            form.options = this.getCloudletData(this.cloudletList);
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    validatedeployClientCount = (form)=>
    {
        if (form.value && form.value.length > 0) {
            let value = parseInt(form.value)
            if(value <= 0)
            {
                form.error = 'Deploy Request Count must be greater than zero' 
                return false; 
            }
        }
        form.error = undefined;
        return true;
    }

    validateMinInst = (currentForm)=>
    {
        let forms = this.state.forms
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            for(let i=0;i<forms.length;i++)
            {
                let form = forms[i]
                if(form.field === fields.cloudlets)
                {
                    if(!form.value || (value > form.value.length))
                    {
                        currentForm.error = 'Minimum active instances cannot be greater the number of Cloudlets'
                        return false
                    }
                    break;
                }
            }
        }
        currentForm.error = undefined;
        return true;
    }

    validateMaxInst = (currentForm)=>
    {
        let forms = this.state.forms
        if (currentForm.value && currentForm.value.length > 0) {
            let value = parseInt(currentForm.value)
            for(let i=0;i<forms.length;i++)
            {
                let form = forms[i]
                if(form.field === fields.minActiveInstances)
                {
                    if(value < parseInt(form.value))
                    {
                        currentForm.error = 'Maximum active instances cannot be lesser than minimum instances'
                        return false
                    }
                    break;
                }
            }
        }
        currentForm.error = undefined;
        return true;
    }

    formKeys = () => {
        return [
            { label: 'Create Auto Provisioning Policy', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: getOrganization() ? false : true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true, tip: 'Name of the organization for the cluster that this policy will apply to' },
            { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { required: true }, visible: true, tip: 'Policy name' },
            { field: fields.deployClientCount, label: 'Deploy Request Count', formType: 'Input', rules: { type: 'number', required: false }, visible: true, update: true, dataValidateFunc: this.validatedeployClientCount, updateId: '3', tip: 'Minimum number of clients within the auto deploy interval to trigger deployment' },
            { field: fields.deployIntervalCount, label: 'Deploy Interval Count (s)', formType: 'Input', rules: { type: 'number' }, visible: true, update: true, updateId: '4', tip: 'Number of intervals to check before triggering deployment' },
            { field: fields.cloudlets, label: 'Cloudlets', formType: 'DualList', rules: { required: false }, visible: true, update: true, updateId: ['5', '5.1', '5.1.1', '5.1.2'], dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.organizationName }] },
            { field: fields.minActiveInstances, label: 'Min Active Instances', formType: 'Input', rules: { type: 'number', required: false }, visible: true, updateId: '6', update: true, dataValidateFunc: this.validateMinInst, tip: 'Minimum number of active instances for High-Availability' },
            { field: fields.maxInstances, label: 'Max Instances', formType: 'Input', rules: { type: 'number', required: false }, visible: true, updateId: '7', update: true, dataValidateFunc: this.validateMaxInst, tip: 'Maximum number of instances (active or not)' },
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.forms && form.formType !== HEADER && form.formType !== MULTI_FORM) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    if (form.formType === DUALLIST) {
                        form.value = data[form.field].map(item => {
                            return JSON.stringify(item)
                        })
                    }
                    else {
                        form.value = data[form.field]
                        this.checkForms(form, forms, true)
                    }
                }
            }
        }

    }

    loadDefaultData = async (data) => {
        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            this.cloudletList = await getOrgCloudletList(this, { region: data[fields.region], org: data[fields.organizationName] })
        }
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else
        {
            this.organizationList = await getOrganizationList(this);  
        }

        if (this.props.action === constant.ADD_CLOUDLET || this.props.action === constant.DELETE_CLOUDLET) {
            this.selectCloudlet(data)
        }
        else {
            let forms = this.formKeys()

            forms.push(
                { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreateAutoProvPolicy, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

            this.updateFormData(forms, data)

            this.setState({
                forms: forms
            })
        }
    }

    componentDidMount() {
        this.getFormData(this.props.data);
        this.props.handleViewMode( policySteps.stepsNewPolicy )
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
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
