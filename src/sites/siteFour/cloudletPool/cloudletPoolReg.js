import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item, Step } from 'semantic-ui-react';
import MexForms from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import { fields } from '../../../services/model/format';

import { showOrganizations } from '../../../services/model/organization';
import { getCloudletList } from '../../../services/model/cloudlet';
import { createCloudletPool } from '../../../services/model/cloudletPool';
import { createCloudletPoolMember, deleteCloudletPoolMember } from '../../../services/model/cloudletPoolMember';
import { createLinkPoolOrg, deleteLinkPoolOrg } from '../../../services/model/cloudletLinkOrg';

import * as constant from '../../../constant';


const stepData = [
    {
        step: "Step 1",
        description: "Create Pool"
    },
    {
        step: "Step 2",
        description: "Add Cloudlets"
    },
    {
        step: "Step 3",
        description: "Add Organizations"
    }
]

class CloudletPoolReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: []
        }
        this.poolData = {}
        this.action = props.action
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
    }

    onValueChange = (currentForm, data) => {
    }

    /**
     * Organization Block
     * * */
    organizationAddResponse = (mcRequestList)=>
    {
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
            let msg = this.action === constant.DELETE_ORGANIZATION ? 'unlinked' : 'linked'
            this.props.handleAlertInfo('success', `Organizations ${msg} successfully`)
            this.props.onClose(true)
        }
    }

    onAddOrganizations = async () => {
        let data = this.formattedData()
        let requestDataList = []
        let organizationList = data[fields.organizations]
        if (organizationList && organizationList.length > 0) {
            for (let i = 0; i < organizationList.length; i++) {
                let newData = data
                let organization = JSON.parse(organizationList[i])
                newData[fields.organizationName] = organization[fields.organizationName]
                requestDataList.push(this.action === constant.DELETE_ORGANIZATION ? deleteLinkPoolOrg(newData) : createLinkPoolOrg(newData))
            }
        }
        serverData.sendMultiRequest(this, requestDataList, this.organizationAddResponse)
    }

    getData = (dataList, field) => {
        if (dataList && dataList.length > 0)
            return dataList.map(data => {
                return { value: JSON.stringify(data), label: data[field] }
            })
    }

    selectOrganization = async (isNew) => {
        let data = this.poolData;
        let region = data[fields.region];
        let selectedDatas = data[fields.organizations]
        if (!this.props.action || this.action === constant.ADD_ORGANIZATION) {
            let mcRequest = await serverData.sendRequest(this, showOrganizations())
            if (mcRequest && mcRequest.response) {
                this.organizationList = mcRequest.response.data
                if (!isNew) {
                    this.organizationList = constant.filterData(selectedDatas, this.organizationList, fields.organizationName);
                }
            }
        }
        else {
            this.organizationList = selectedDatas;
        }

        if (this.organizationList.length > 0) {
            let label = this.action === constant.DELETE_ORGANIZATION ? 'Unlink' : 'Link'
            let step = [
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { disabled: true }, visible: true, options: [region ], value: region },
                { field: fields.poolName, label: 'Pool Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible: true, value: data[fields.poolName] },
                { field: fields.organizations, label: 'Organizations', formType: 'DualList', rules: { required: true }, visible: true, options: this.getData(this.organizationList, fields.organizationName) },
                { label: `${label} Organizations`, formType: 'Button', onClick: this.onAddOrganizations },
                { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel }
            ]
            this.loadData(step)
            this.setState({
                step: 2,
                forms: step
            })
        }
        else
        {
            this.props.handleAlertInfo('error', 'No organizations to unlink')
            this.props.onClose(false)
        }
    }

    /**
     * Organization Block
     * * */

     /**
     * Cloudlet Block
     * * */

    onCloudletCancel = () => {
        if(this.props.action)
        {
            this.props.onClose(false)
        }
        else
        {
            this.selectOrganization(true)
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
            let msg = this.action === constant.DELETE_CLOUDLET ? 'removed' : 'added'
            this.props.handleAlertInfo('success', `Cloudlets ${msg} successfully`)
            if(this.props.action)
            {
                this.props.onClose(true)
            }
            else
            {
                let data = mcRequestList[0].request.data;
                this.selectOrganization(data, true)
            }
        }
    }

    onAddCloudlets = () => {
        let data = this.formattedData()
        let requestDataList = []
        let cloudletList = data[fields.cloudlets]
        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let newData = data
                let cloudlet = JSON.parse(cloudletList[i])
                newData[fields.cloudletName] = cloudlet[fields.cloudletName]
                newData[fields.operatorName] = cloudlet[fields.operatorName]
                requestDataList.push(this.action === constant.DELETE_CLOUDLET ? deleteCloudletPoolMember(newData) : createCloudletPoolMember(newData))
            }
        }
        serverData.sendMultiRequest(this, requestDataList, this.addCloudletResponse)
    }

   

    selectCloudlet = async (isNew) => {
        let data = this.poolData;
        let region = data[fields.region];
        let selectedDatas = data[fields.cloudlets]
        if (!this.props.action || this.action === constant.ADD_CLOUDLET) {
            this.cloudletList = await getCloudletList(this, { region: region })
            if (!isNew) {
                this.cloudletList = constant.filterData(selectedDatas, this.cloudletList, fields.cloudletName);
            }
        }
        else {
            this.cloudletList = selectedDatas;
        }

        if (this.cloudletList && this.cloudletList.length > 0) {
            let label = this.action === constant.DELETE_CLOUDLET ? 'Delete' : 'Add'

            let step2 = [
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { disabled: true }, visible: true, options: [region], value: region },
                { field: fields.poolName, label: 'Pool Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { disabled: true }, visible: true, value: data[fields.poolName] },
                { field: fields.cloudlets, label: 'Clouldets', formType: 'DualList', rules: { required: true }, visible: true, options: this.getData(this.cloudletList, fields.cloudletName) },
                { label: `${label} Cloudlets`, formType: 'Button', onClick: this.onAddCloudlets },
                { label: this.props.action ? 'Cancel' : 'Skip', formType: 'Button', onClick: this.onCloudletCancel }
            ]
            this.loadData(step2)
            this.setState({
                step: 1,
                forms: step2
            })
        }else
        {
            this.props.handleAlertInfo('error', 'No Cloudlets present')
            if(this.props.action)
            {
                this.props.onClose(true)
            }else
            {
                this.selectOrganization(data, true)
            }
        }
    }

     /**
     * Cloudlet Block
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

    onCreateCloudletPool = async () => {
        let data = this.formattedData()
        let mcRequest = await serverData.sendRequest(this, createCloudletPool(data))
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.poolData = data;
            this.props.handleAlertInfo('success', `Cloudlet Pool ${data[fields.poolName]} created successfully`)
            this.selectCloudlet(true)
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
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        {this.props.action ? null :
                            <div>
                                <div className='content_title' style={{ padding: '0px 0px 10px 0' }}>Create Cloudlet Pool</div>

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
                            form.options = this.organizationList
                            break;
                        case fields.region:
                            form.options = this.regions;
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
            this.poolData = data;
            switch (this.action) {
                case constant.ADD_CLOUDLET:
                case constant.DELETE_CLOUDLET:
                    this.selectCloudlet(false)
                    break;
                case constant.ADD_ORGANIZATION:
                case constant.DELETE_ORGANIZATION:
                    this.selectOrganization(false)
                    break;
            }
        }
        else {
            let step1 = [
                { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
                { field: fields.poolName, label: 'Pool Name', formType: 'Input', placeholder: 'Enter Auto Provisioning Policy Name', rules: { required: true }, visible: true },
                { label: 'Create Cloudlet Pool', formType: 'Button', onClick: this.onCreateCloudletPool, validate: true },
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(CloudletPoolReg)));
