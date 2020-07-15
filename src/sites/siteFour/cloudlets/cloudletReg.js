import React, {Suspense} from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, TEXT_AREA , ICON_BUTTON, formattedData} from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/tab/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization, updateFields } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/model/organization';
import { createCloudlet, updateCloudlet, getCloudletManifest } from '../../../services/model/cloudlet';
//Map
import Map from "../../../hoc/maps/MexMap"
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import { CloudletTutor } from "../../../tutorial";
import { Card, IconButton, Box, Link, Tooltip } from '@material-ui/core';
import { syntaxHighLighter, codeHighLighter } from '../../../hoc/highLighter/highLighter'
import { downloadData } from '../../../utils/file_util'


import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';

import * as cloudletFLow from '../../../hoc/mexFlow/cloudletFlow'
const MexFlow = React.lazy(() => import('../../../hoc/mexFlow/MexFlow'));

const cloudletSteps = CloudletTutor();

class CloudletReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
            cloudletManifest: undefined,
            showCloudletManifest: false,
            showManifest: false,
            activeIndex: 0,
            flowDataList: [],
            flowInstance: undefined,
            mapCenter: [53,13]
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.infraApiAccessList = [constant.INFRA_API_ACCESS_DIRECT, constant.INFRA_API_ACCESS_RESTRICTED]
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.operatorList = [];
        this.cloudletData = undefined;
        this.canCloseStepper = true;
        this.updateFlowDataList = []
    }

    platformTypeValueChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                form.visible = currentForm.value === constant.PLATFORM_TYPE_OPEN_STACK ? true : false
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    infraAPIAccessChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.infraFlavorName || form.field === fields.infraExternalNetworkName) {
                form.rules.required = currentForm.value === constant.INFRA_API_ACCESS_RESTRICTED
            }
        }
        if (isInit === undefined || isInit === false) {
            this.setState({ forms: forms })
        }
    }

    locationChange = (currentForm, forms, isInit) => {
        if (isInit === undefined || isInit === false) {
            let parentForm = currentForm.parent.form
            let childForms = parentForm.forms
            let latitude = undefined
            let longitude = undefined
            for (let i = 0; i < childForms.length; i++) {
                let form = childForms[i]
                if (form.field === fields.latitude) {
                    latitude = form.value
                }
                else if (form.field === fields.longitude) {
                    longitude = form.value
                }
            }
            if (latitude && longitude) {
                let cloudlet = {}
                cloudlet.cloudletLocation = { latitude: latitude, longitude: longitude }
                this.setState({ mapData: [cloudlet] })
                this.setState({ mapCenter: [latitude, longitude] })
            }
            else {
                this.setState({ mapData: [] })
            }
        }
    }

    checkForms = (form, forms, isInit, data) => {
        let flowDataList = []
        if (form.field === fields.platformType) {
            this.platformTypeValueChange(form, forms, isInit)
        }
        else if (form.field === fields.latitude || form.field === fields.longitude) {
            this.locationChange(form, forms, isInit)
        }
        else if (form.field === fields.infraApiAccess) {
            this.infraAPIAccessChange(form, forms, isInit)
            let finalData = isInit ? data : formattedData(forms)
            flowDataList.push(cloudletFLow.privateFlow(finalData))
        }

        if (flowDataList.length > 0) {
            if (isInit) {
                this.updateFlowDataList = [...this.updateFlowDataList, ...flowDataList]
            }
            else {
                this.setState({ flowDataList: flowDataList, activeIndex: 1 })
            }
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = async (mcRequest) => {
        if (mcRequest) {
            let responseData = undefined;
            let request = mcRequest.request;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let orgData = request.orgData;
            let isRestricted = orgData[fields.infraApiAccess] === constant.INFRA_API_ACCESS_RESTRICTED

            this.props.handleLoadingSpinner(false)
            let labels = [{ label: 'Cloudlet', field: fields.cloudletName }]
            if (!this.isUpdate && isRestricted) {
                if (responseData && responseData.data && responseData.data.message === 'Cloudlet configured successfully. Please run `GetCloudletManifest` to bringup Platform VM(s) for cloudlet services') {
                    responseData.data.message = 'Cloudlet configured successfully, please wait requesting cloudlet manifest to bring up Platform VM(s) for cloudlet service'
                    this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
                    let cloudletManifest = await getCloudletManifest(this, orgData, false)
                    this.cloudletData = orgData
                    if (cloudletManifest && cloudletManifest.response && cloudletManifest.response.data) {
                        this.setState({ cloudletManifest: cloudletManifest.response.data, showCloudletManifest: true, stepsArray: [] })
                    }
                }
                else {
                    let isRequestFailed = responseData ? responseData.code !== 200 : false
                    if (responseData || isRequestFailed) {
                        this.canCloseStepper = isRequestFailed
                        this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
                    }
                }
            }
            else {
                this.setState({ stepsArray: updateStepper(this.state.stepsArray, labels, request.orgData, responseData) })
            }
        }
    }

    onCreate = async (data) => {
        if (data) {
            let forms = this.state.forms
            let envVars = undefined
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.cloudletLocation) {
                            multiFormData.latitude = parseInt(multiFormData.latitude)
                            multiFormData.longitude = parseInt(multiFormData.longitude)
                            data[fields.cloudletLocation] = multiFormData
                        }
                        else if (multiFormData[fields.key] && multiFormData[fields.value]) {
                            envVars = envVars ? envVars : {}
                            envVars[multiFormData[fields.key]] = multiFormData[fields.value]
                        }
                    }
                    data[uuid] = undefined
                }
            }
            if (envVars) {
                data[fields.envVars] = envVars
            }
            if (this.props.isUpdate) {
                let updateFieldList = updateFields(this, forms, data, this.props.data)
                if (updateFieldList.length > 0) {
                    this.props.handleLoadingSpinner(true)
                    data[fields.fields] = updateFieldList
                    updateCloudlet(this, data, this.onCreateResponse)
                }
            }
            else {
                this.props.handleLoadingSpinner(true)
                createCloudlet(this, data, this.onCreateResponse)
            }
        }
    }

    onMapClick = (location) => {
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletLocation && !form.rules.disabled) {
                let cloudlet = {}
                cloudlet.cloudletLocation = { latitude: location.lat, longitude: location.long }
                this.setState({ mapData: [cloudlet] })
                let childForms = form.forms;
                for (let j = 0; j < childForms.length; j++) {
                    let childForm = childForms[j]
                    if (childForm.field === fields.latitude) {
                        childForm.value = location.lat
                    }
                    else if (childForm.field === fields.longitude) {
                        childForm.value = location.long
                    }
                }
                break;
            }
        }
        this.reloadForms()
    }

    /**
     * Tab block
     */

    saveFlowInstance = (data) => {
        this.setState({ flowInstance: data })
    }

    getGraph = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <Suspense fallback={<div></div>}>
                <MexFlow flowDataList={this.state.flowDataList} saveFlowInstance={this.saveFlowInstance} flowInstance={this.state.flowInstance} flowObject={cloudletFLow} />
            </Suspense>
        </div>
    )

    getMap = () =>
        (
            <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
                <Map locData={this.state.mapData} id={'Cloudlets'} reg='cloudletAndClusterMap' onMapClick={this.onMapClick}  mapCenter={this.state.mapCenter}></Map>
            </div>
        )

    getPanes = () => ([
        { label: 'Cloudlet Location', tab: this.getMap(), onClick: () => { this.setState({ activeIndex: 0 }) } },
        { label: 'Graph', tab: this.getGraph(), onClick: () => { this.setState({ activeIndex: 1 }) } }
    ])
    /**
     * Tab block
     */

    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    stepperClose = () => {
        if (this.canCloseStepper) {
            this.setState({
                stepsArray: []
            })
        }
    }


    cloudletManifestForm = () => {
        let cloudletManifest = this.state.cloudletManifest;
        let imagePath = cloudletManifest.image_path;
        let imageFileNameWithExt = imagePath.substring(imagePath.lastIndexOf('/') + 1)
        let imageFileName = imageFileNameWithExt.substring(0, imageFileNameWithExt.lastIndexOf('.'))
        let fileName = `${this.cloudletData[fields.cloudletName]}-${this.cloudletData[fields.operatorName]}-pf`
        return (
            <Card style={{ height: '100%', backgroundColor: '#2A2C33', overflowY: 'auto' }}>
                <div style={{ margin: 20, color: 'white' }}>
                    <Box display="flex" p={1}>
                        <Box p={1} flexGrow={1}>
                            <h2><b>Cloudlet Manifest</b></h2>
                        </Box>
                        <Box p={1}>
                            <IconButton onClick={() => this.props.onClose(true)}><CloseIcon /></IconButton>
                        </Box>
                    </Box>
                    <Box display="flex" p={1}>
                        <Box p={1} flexGrow={1}><h4><b>Perform the following steps to setup cloudlet</b></h4></Box>
                    </Box>
                    <br />
                    <ul style={{listStyleType: 'decimal'}}>
                        <li>
                            <h4>Download MobiledgeX bootstrap VM image (please use your console credentials)</h4>
                            <Link href={imagePath} target='_blank'><h4 style={{ color: '#77bd06', margin: 10 }}>{imagePath}</h4></Link>
                        </li>
                        <li style={{ marginTop: 30 }}>
                            <h4>
                                Execute the following command to upload the image to your glance store &nbsp;&nbsp;&nbsp;
                            </h4>
                            {codeHighLighter(`openstack image create ${imageFileName} --disk-format qcow2 --container-format bare --file ${imageFileNameWithExt}`)}
                        </li>
                        <li style={{ marginTop: 20 }}>
                            <h4>
                                Download the following manifest template
                                <Tooltip title={'download'} aria-label="download">
                                    <IconButton onClick={() => downloadData(`${fileName}.yml`, this.state.cloudletManifest.manifest)}><GetAppIcon fontSize='small' /></IconButton>
                                </Tooltip>
                            </h4>
                            <div style={{ padding: 1, overflow: 'auto', width: '70vw', height:'50vh' }}>
                                {syntaxHighLighter('yaml', cloudletManifest.manifest, true)}
                            </div>
                        </li>
                        <li style={{ marginTop: 30 }}>
                            <h4>Execute the following command to use manifest to setup cloudlet &nbsp;&nbsp;&nbsp;
                            </h4>
                            {codeHighLighter(`openstack stack create -t ${fileName}.yml ${fileName}`)}
                        </li>
                    </ul>
                </div>
            </Card>
        )
    }

    render() {
        return (
            <div className="round_panel">
                {this.state.showCloudletManifest ?
                    this.state.cloudletManifest ? this.cloudletManifestForm() : null :
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '52%', overflow: 'auto', height: '95vh' }}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                        <div style={{ width: '45%', margin: 10, borderRadius: 5, backgroundColor: 'transparent', height: 'calc(100% - 90px)', position: 'absolute', right: 0 }}>
                            <MexTab form={{ panes: this.getPanes() }} activeIndex={this.state.activeIndex} />
                        </div>
                    </div>
                }
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.ipSupport:
                            form.options = [constant.IP_SUPPORT_DYNAMIC];
                            break;
                        case fields.platformType:
                            form.options = [constant.PLATFORM_TYPE_OPEN_STACK, constant.PLATFORM_TYPE_VSPHERE];
                            break;
                        case fields.infraApiAccess:
                            form.options = this.infraApiAccessList;
                            form.value = constant.INFRA_API_ACCESS_DIRECT;
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (forms, data) => {
        if (data) {
            let operator = {}
            operator[fields.operatorName] = data[fields.operatorName];
            this.operatorList = [operator]
            this.setState({ mapData: [data] })

            let multiFormCount = 0
            if (data[fields.envVars]) {
                let envVarsArray = data[fields.envVars]
                Object.keys(envVarsArray).map(item=>{
                    let envForms = this.envForm()
                    let key = item
                    let value = envVarsArray[item]
                    for (let j = 0; j < envForms.length; j++) {
                        let envForm = envForms[j]
                        if (envForm.field === fields.key) {
                            envForm.value = key
                        }
                        else if (envForm.field === fields.value) {
                            envForm.value = value
                        }
                    }
                    forms.splice(17 + multiFormCount, 0, this.getEnvForm(envForms))
                    multiFormCount += 1
                })
            }
        }
    }

    locationForm = () => ([
        { field: fields.latitude, label: 'Latitude', formType: INPUT, placeholder: '-90 ~ 90', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update:true },
        { field: fields.longitude, label: 'Longitude', formType: INPUT, placeholder: '-180 ~ 180', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update:true }
    ])

    cloudletManifest = () => {
        return [
            { field: fields.manifest, serverField: 'manifest', label: 'Manifest', dataType: constant.TYPE_YAML },
        ]
    }

    /*Multi Form*/
    envForm = () => ([
        { field: fields.key, label: 'Key', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        { field: fields.value, label: 'Value', formType: INPUT, rules: { required: true }, width: 6, visible: true },
        this.isUpdate ? {} :
            { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 4, onClick: this.removeMultiForm }
    ])

    getEnvForm = (form) => {
        return ({ uuid: uuid(), field: fields.annotations, formType: 'MultiForm', forms: form ? form : this.envForm(), width: 3, visible: true })
    }
    
    removeMultiForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.setState({
                forms: updateForms
            })
        }
    }

    addMultiForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.multiForm());
        this.setState({ forms: forms })
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Cloudlet`, formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to deploy.' },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: INPUT, placeholder: 'Enter cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.' },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: getOrganization() ? true : false }, visible: true, value: getOrganization(), tip: 'Organization of the cloudlet site' },
            { uuid: uuid(), field: fields.cloudletLocation, label: 'Cloudlet Location', formType: INPUT, rules: { required: true }, visible: true, forms: this.locationForm(), tip: 'GPS Location', update:true, updateId: ['5', '5.1', '5.2'] },
            { field: fields.ipSupport, label: 'IP Support', formType: SELECT, placeholder: 'Select IP Support', rules: { required: true }, visible: true, tip: 'Static IP support indicates a set of static public IPs are available for use, and managed by the Controller. Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.' },
            { field: fields.numDynamicIPs, label: 'Number of Dynamic IPs', formType: INPUT, placeholder: 'Enter Number of Dynamic IPs', rules: { required: true, type: 'number' }, visible: true, tip: 'Number of dynamic IPs available for dynamic IP support.' },
            { field: fields.physicalName, label: 'Physical Name', formType: INPUT, placeholder: 'Enter Physical Name', rules: { required: true }, visible: true, tip: 'Physical infrastructure cloudlet name.' },
            { field: fields.containerVersion, label: 'Container Version', formType: INPUT, placeholder: 'Enter Container Version', rules: { required: false }, visible: true, tip: 'Cloudlet container version' },
            { field: fields.vmImageVersion, label: 'VM Image Version', formType: INPUT, placeholder: 'Enter VM Image Version', rules: { required: false }, visible: true, tip: 'MobiledgeX baseimage version where CRM services reside' },
            { field: fields.platformType, label: 'Platform Type', formType: SELECT, placeholder: 'Select Platform Type', rules: { required: true }, visible: true, tip: 'Supported list of cloudlet types.' },
            { field: fields.openRCData, label: 'OpenRC Data', formType: TEXT_AREA, placeholder: 'Enter OpenRC Data', rules: { required: false }, visible: false, tip: 'key-value pair of access variables delimitted by newline.\nSample Input:\nOS_AUTH_URL=...\nOS_PROJECT_ID=...\nOS_PROJECT_NAME=...' },
            { field: fields.caCertdata, label: 'CACert Data', formType: TEXT_AREA, placeholder: 'Enter CACert Data', rules: { required: false }, visible: false, tip: 'CAcert data for HTTPS based verfication of auth URL' },
            { field: fields.infraApiAccess, label: 'Infra API Access', formType: SELECT, placeholder: 'Select Infra API Access', rules: { required: true }, visible: true, tip: 'Infra Access Type is the type of access available to Infra API Endpoint\n* Direct: Infra API endpoint is accessible from public network\n* Restricted: Infra API endpoint is not accessible from public network' },
            { field: fields.infraFlavorName, label: 'Infra Flavor Name', formType: 'Input', placeholder: 'Enter Infra Flavor Name', rules: { required: false }, visible: true, tip: 'Infra specific flavor name' },
            { field: fields.infraExternalNetworkName, label: 'Infra External Network Name', formType: 'Input', placeholder: 'Enter Infra External Network Name', rules: { required: false }, visible: true, tip: 'Infra specific external network name' },
            { field: fields.envVars, label: 'Environment Variable', formType: 'Header', forms: this.isUpdate ? [] : [{ formType: ICON_BUTTON, label: 'Add Env Vars', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getEnvForm }], visible: true, tip: 'Single Key-Value pair of env var to be passed to CRM' }   
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.forms && form.formType !== 'Header' && form.formType !== 'MultiForm') {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true, data)
                }
            }
            //Todo if more such functions required must be moved to mexforms
            if (this.isUpdate) {
                if (form.field === fields.openRCData || form.field === fields.caCertdata) {
                    form.visible = false
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        if (data) {
            if (this.props.isManifest) {
                this.setState({ showCloudletManifest: true })
                let cloudletManifest = await getCloudletManifest(this, data)
                this.cloudletData = data
                if (cloudletManifest && cloudletManifest.response && cloudletManifest.response.data) {
                    this.setState({ cloudletManifest: cloudletManifest.response.data })
                }
            }
            else {
                await this.loadDefaultData(forms, data)
            }
        }
        else {
            let organizationList = await getOrganizationList(this)
            this.operatorList = []
            for (let i = 0; i < organizationList.length; i++) {
                let organization = organizationList[i]
                if (organization[fields.type] === 'operator' || getOrganization()) {
                    this.operatorList.push(organization[fields.organizationName])
                }
            }
        }
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


        this.updateFormData(forms, data)

        this.setState({
            forms: forms
        })

        if (this.isUpdate) {
            this.setState({
                showGraph: true,
                flowDataList: this.updateFlowDataList
            })
        }

    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode(cloudletSteps.stepsCloudletReg)
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
        region: region
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletReg));
