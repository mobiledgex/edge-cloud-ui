import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item, Step } from 'semantic-ui-react';
import * as constant from '../../../../constant';
import MexForms, { SELECT, DUALLIST } from '../../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import * as serverData from '../../../../services/model/serverData';
import { fields, getOrganization } from '../../../../services/model/format';

import { getOrganizationList } from '../../../../services/model/organization';
import { getOrgCloudletList } from '../../../../services/model/cloudlet';
import { createAutoProvPolicy, addAutoProvCloudletKey, deleteAutoProvCloudletKey } from '../../../../services/model/autoProvisioningPolicy';


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

    getCloudletData = (dataList) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                let cloudletName = data[fields.cloudletName];
                return { value: JSON.stringify(data), label: cloudletName }
            })
    }

    onValueChange = (form) => {
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


    selectCloudlet = async (data) => {

        let region = data[fields.region]
        let organization = data[fields.organizationName]
        let autoPolicyName = data[fields.autoPolicyName]

        this.cloudletList = await getOrgCloudletList(this, { region: region, org:organization })
        if (this.cloudletList && this.cloudletList.length > 0) {
            let action = 'Add'
            if (this.props.action === 'Add') {
            }
            else if (this.props.action === 'Delete') {
                action = 'Delete'
            }
            this.filterCloudlets();
            let forms = [
                { label: `${action} Cloudlets`, formType: 'Header', visible: true },
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { disabled: true }, visible: true, options: [{ key: region, value: region, text: region }], value: region },
                { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { disabled: true }, visible: true, options: [{ key: organization, value: organization, text: organization }], value: organization },
                { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible: true, value: autoPolicyName },
                { field: fields.cloudlets, label: 'Clouldets', formType: 'DualList', rules: { required: true }, visible: true },
                { label: `${action}`, formType: 'Button', onClick: this.onAddCloudlets },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]
            this.updateUI(forms)
            this.setState({
                step: 1,
                forms: forms
            })
            this.props.handleChangeStep('02');
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
            let msg = this.props.action === 'Delete' ? 'removed' : 'added'
            this.props.handleAlertInfo('success', `Cloudlets ${msg} successfully`)
            this.props.onClose(true)
        }
    }

    onCreateAutoProvPolicy = async (data) => {
        let mcRequest = await serverData.sendRequest(this, createAutoProvPolicy(data))
        if (mcRequest && mcRequest.response) {
            let response = mcRequest.response;
            if (response.status === 200) {
                this.props.handleAlertInfo('success', `Auto Provisioning Policy ${data[fields.autoPolicyName]} created successfully`)
                this.selectCloudlet(data)
            }
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
                if (this.props.action === 'Delete') {
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
                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                    </Item>
                </div>
            </div>
        )
    }



    onAddCancel = () => {
        this.props.onClose(false)
    }


    updateUI(forms) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
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

    loadDefaultData = async (data) => {
        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
        }
    }

    validatedeployClientCount = (form)=>
    {
        if (form.value && form.value.length > 0) {
            let value = parseInt(form.value)
            if(value <= 0)
            {
                form.error = 'Deploy Client Count must be greater than zero' 
                return false; 
            }
        }
        form.error = undefined;
        return true;
    }

    getFormData = async (data) => {
        if (data) {
            this.loadDefaultData(data)
            this.selectCloudlet(data)
        }
        else {
            this.organizationList = await getOrganizationList(this);
            let forms = [
                { label: 'Create Auto Provisioning Policy', formType: 'Header', visible: true },
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
                { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: true, disabled: getOrganization() ? true : false }, value: getOrganization(), visible: true },
                { field: fields.autoPolicyName, label: 'Auto Policy Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { required: true }, visible: true },
                { field: fields.deployClientCount, label: 'Deploy Client Count', formType: 'Input', rules: { type: 'number', required: true }, visible: true, dataValidateFunc: this.validatedeployClientCount },
                { field: fields.deployIntervalCount, label: 'Deploy Interval Count (s)', formType: 'Input', rules: { type: 'number' }, visible: true },
                { label: 'Create', formType: 'Button', onClick: this.onCreateAutoProvPolicy, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]
            this.updateUI(forms)
            this.setState({
                forms: forms
            })
        }

    }

    componentDidMount() {
        this.getFormData(this.props.data)
    }

    componentWillUnmount() {
        this.props.handleViewMode( false );
        this.props.handleChangeStep( null )
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
        handleChangeStep: (data) => { dispatch(actions.changeStep(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
