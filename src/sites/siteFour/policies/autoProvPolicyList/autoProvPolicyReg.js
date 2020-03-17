import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item, Step } from 'semantic-ui-react';
import MexForms from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import * as serviceMC from '../../../../services/model/serviceMC';
import * as serverData from '../../../../services/model/serverData';
import { fields } from '../../../../services/model/format';

import { showOrganizations } from '../../../../services/model/organization';
import { showCloudlets } from '../../../../services/model/cloudlet';
import { CREATE_AUTO_PROV_POLICY, ADD_AUTO_PROV_POLICY_CLOUDLET, REMOVE_AUTO_PROV_POLICY_CLOUDLET } from '../../../../services/model/endPointTypes';


const stepData = [
    {
        step: "Step 1",
        description: "Create Policy"
    },
    {
        step: "Step 2",
        description: "Add Cloudlets"
    }
]

class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
    }

    onValueChange = (currentForm, data) => {
    }

    getRegionData = () => {
        if (this.regions && this.regions.length > 0)
            return this.regions.map(region => {
                return { key: region, value: region, text: region }
            })
    }

    getOrganizationData = (form, dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let organizationName = data[fields.organizationName];
                if (data.isDefault) {
                    organizationName = data[fields.organizationName];
                    form.value = organizationName;
                    let rules = form.rules ? form.rules : {}
                    rules.disabled = true;
                    form.rules = rules;
                }
                return { key: organizationName, value: organizationName, text: organizationName }
            })
    }

    getCloudletData = (dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let cloudletName = data[fields.cloudletName];
                return { value: JSON.stringify(data), label: cloudletName }
            })
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
                            if (this.props.action === 'Add') {
                                this.cloudletList.splice(j, 1)
                            }
                            else if (this.props.action === 'Delete') {
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


    selectCloudlet = async (region, organization, autoPolicyName) => {
        let mcRequest = await serverData.sendRequest(this, showCloudlets({ region: region }))
        if (mcRequest && mcRequest.response) {
            this.cloudletList = mcRequest.response.data

            if (this.cloudletList.length > 0) {
                let action = 'Add'
                if (this.props.action === 'Add') {
                }
                else if (this.props.action === 'Delete') {
                    action = 'Delete'
                }
                this.filterCloudlets();
                let step2 = [
                    { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { disabled: true }, visible: true, options: [{ key: region, value: region, text: region }], value: region },
                    { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { disabled: true }, visible: true, options: [{ key: organization, value: organization, text: organization }], value: organization },
                    { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible: true, value: autoPolicyName },
                    { field: fields.cloudlets, label: 'Clouldets', formType: 'DualList', rules: { required: true }, visible: true, options: this.getCloudletData(this.cloudletList) },
                    { label: `${action} Cloudlets`, formType: 'Button', onClick: this.onAddCloudlets },
                    { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
                ]
                this.loadData(step2)
                this.setState({
                    step: 1,
                    forms: step2
                })
            }
        }

    }

    addCloudletResponse = (mcRequestList) => {
        let valid = true;
        if (mcRequestList && mcRequestList.length > 0) {

            for (let i = 0; i < mcRequestList.length; i++) {
                let mcRequest = mcRequestList[i];
                if (mcRequest.response.status !== 200) {
                    valid = false;
                }
            }
        }

        if (valid) {
            let msg = this.props.action === 'Delete' ? 'removed' : 'added'
            this.props.handleAlertInfo('success', `Cloudlets ${msg} successfully`)
            this.props.onClose(true)
        }
    }



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

    onCreateAutoProvPolicy = async () => {
        let data = this.formattedData()
        let AutoProvPolicy = {
            deploy_client_count: data[fields.deployClientCount] ? parseInt(data[fields.deployClientCount]) : undefined,
            deploy_interval_count: data[fields.deployIntervalCount] ? parseInt(data[fields.deployIntervalCount]) : undefined,
            key: { developer: data[fields.organizationName], name: data[fields.autoPolicyName] }
        }

        let requestData = {
            Region: data[fields.region],
            AutoProvPolicy: AutoProvPolicy
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let token = store.userToken;
        if (token) {
            let method = CREATE_AUTO_PROV_POLICY;
            let mcRequest = await serverData.sendRequest(this, { method: method, data: requestData })
            if (mcRequest && mcRequest.response) {
                let response = mcRequest.response;
                if (response.status === 200) {
                    let data = mcRequest.request.data;
                    let region = data.Region
                    let organization = data.AutoProvPolicy.key.developer;
                    let autoPolicyName = data.AutoProvPolicy.key.name;
                    this.props.handleAlertInfo('success', `Auto Provisioning Policy ${autoPolicyName} created successfully`)
                    this.selectCloudlet(region, organization, autoPolicyName)
                }
            }
        }
    }

    onAddCloudlets = () => {
        let data = this.formattedData()
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let token = store.userToken;

        let method = ADD_AUTO_PROV_POLICY_CLOUDLET;

        if (this.props.action === 'Delete') {
            method = REMOVE_AUTO_PROV_POLICY_CLOUDLET;
        }

        let requestDataList = []
        let cloudletList = data[fields.cloudlets]
        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = JSON.parse(cloudletList[i])
                let requestData = {
                    Region: data[fields.region],
                    AutoProvPolicyCloudlet: {
                        key: { developer: data[fields.organizationName], name: data[fields.autoPolicyName] },
                        cloudlet_key: { name: cloudlet[fields.cloudletName], organization: cloudlet[fields.operatorName] }
                    }
                }
                requestDataList.push({ token: token, method: method, data: requestData })
            }
        }
        serviceMC.sendMultiRequest(this, requestDataList, this.addCloudletResponse)
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
                        {this.props.action ? null :
                            <div>
                                <div className='content_title' style={{ padding: '0px 0px 10px 0' }}>Create Auto Provisioning Policy</div>

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
                                </Step.Group></div>}
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Item>
                </div>
            </div>
        )
    }



    onAddCancel = () => {
        this.props.onClose(false)
    }


    loadData(forms, data) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.formType === 'Select') {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.getOrganizationData(form, this.organizationList)
                            break;
                        case fields.region:
                            form.options = this.getRegionData();
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }

    }
    getFormData = async (data) => {
        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
            this.selectCloudlet(data[fields.region], data[fields.organizationName], data[fields.autoPolicyName])
        }
        else {
            let mcRequest = await serverData.sendRequest(this, showOrganizations())
            if (mcRequest && mcRequest.response) {
                this.organizationList = mcRequest.response.data;
            }
            let step1 = [
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
                { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible: true },
                { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { required: true }, visible: true },
                { field: fields.deployClientCount, label: 'Deploy Client Count', formType: 'Input', rules: { formType: 'number' }, visible: true },
                { field: fields.deployIntervalCount, label: 'Deploy Interval Count (s)', formType: 'Input', rules: { formType: 'number' }, visible: true },
                { label: 'Create Policy', formType: 'Button', onClick: this.onCreateAutoProvPolicy, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]
            this.loadData(step1)
            this.setState({
                forms: step1
            })
        }

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
    let _changedRegion = (state.form && state.form.createAppFormDefault && state.form.createAppFormDefault.values) ? state.form.createAppFormDefault.values.Region : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
        changedRegion: _changedRegion
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
