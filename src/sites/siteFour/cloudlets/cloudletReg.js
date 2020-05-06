import React from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, TEXT_AREA } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, getOrganization } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/model/organization';
import { createCloudlet, updateCloudlet } from '../../../services/model/cloudlet';
//Map
import Map from '../../../libs/simpleMaps/with-react-motion/index_clusters';
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'
import {CloudletTutor} from "../../../tutorial";

const cloudletSteps = CloudletTutor();

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.operatorList = []
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

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.platformType) {
            this.platformTypeValueChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = (mcRequest) => {
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let data = undefined;
            let request = mcRequest.request;
            let cloudletName = request.data.cloudlet.name;
            if (mcRequest.response && mcRequest.response.data) {
                data = mcRequest.response.data;
            }
            this.setState({ stepsArray: updateStepper(this.state.stepsArray, cloudletName, data, cloudletName) })
        }
    }

    onCreate = async (data) => {
        let forms = this.state.forms
        if (data) {
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === fields.cloudletLocation) {
                            multiFormData.timestamp = {}
                            multiFormData.latitude = parseInt(multiFormData.latitude)
                            multiFormData.longitude = parseInt(multiFormData.longitude)
                            data[fields.cloudletLocation] = multiFormData
                        }
                    }
                    data[uuid] = undefined
                }
            }
            this.props.handleLoadingSpinner(true)
            if (this.props.isUpdate) {
                updateCloudlet(this, data, this.onCreateResponse)
            }
            else {
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
                cloudlet.cloudletLocation = {latitude:location.lat, longitude:location.long}
                this.setState({mapData:[cloudlet]})
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
    getMap = () =>
        (
            <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
                <Map locData={this.state.mapData} id={'Cloudlets'} reg='cloudletAndClusterMap' zoomControl={{ center: [0, 0], zoom: 1.5 }} onMapClick={this.onMapClick}></Map>
            </div>
        )

    getPanes = () => ([
        { label: 'Cloudlets', tab: this.getMap() }
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
        this.setState({
            stepsArray: []
        })
        this.props.onClose(true)
    }



    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <MexTab form={{ panes: this.getPanes() }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }



    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            return dataList.map(data => {
                let info = form ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
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
                            form.options = [constant.PLATFORM_TYPE_OPEN_STACK];
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
            let operator = {}
            operator[fields.operatorName] = data[fields.operatorName];
            this.operatorList = [operator]
            this.setState({mapData:[data]})
        }
    }

    locationForm = () => ([
        { field: fields.latitude, label: 'Latitude', formType: INPUT, placeholder: '-90 ~ 90', rules: { required: true, type:'number'}, width: 8, visible: true },
        { field: fields.longitude, label: 'Longitude', formType: INPUT, placeholder: '-180 ~ 180', rules: { required: true, type:'number'}, width: 8, visible: true }
    ])

    formKeys = () => {
        return [
            { label: 'Create Cloudlet', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to deploy.' },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: INPUT, placeholder: 'Enter cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.' },
            { field: fields.operatorName, label: 'Operator', formType: SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: getOrganization() ? true : false}, visible: true, value: getOrganization(), tip: 'Name of the organization you are currently managing.' },
            { uuid: uuid(), field: fields.cloudletLocation, label: 'Cloudlet Location', formType: INPUT, rules: { required: true }, visible: true, forms: this.locationForm(), tip: 'Cloudlet Location' },
            { field: fields.ipSupport, label: 'IP Support', formType: SELECT, placeholder: 'Select IP Support', rules: { required: true }, visible: true, tip: 'Ip Support indicates the type of public IP support provided by the Cloudlet. Static IP support indicates a set of static public IPs are available for use, and managed by the Controller. Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.' },
            { field: fields.numDynamicIPs, label: 'Number of Dynamic IPs', formType: INPUT, placeholder: 'Enter Number of Dynamic IPs', rules: { required: true, type: 'number' }, visible: true, tip: 'Number of dynamic IPs available for dynamic IP support.' },
            { field: fields.physicalName, label: 'Physical Name', formType: INPUT, placeholder: 'Enter Physical Name', rules: { required: true }, visible: true, tip: 'Physical infrastructure cloudlet name.' },
            { field: fields.containerVersion, label: 'Container Version', formType: INPUT, placeholder: 'Enter Container Version', rules: { required: false }, visible: true, update: true },
            { field: fields.platformType, label: 'Platform Type', formType: SELECT, placeholder: 'Select Platform Type', rules: { required: true }, visible: true, tip: 'Supported list of cloudlet types.' },
            { field: fields.openRCData, label: 'OpenRC Data', formType: TEXT_AREA, placeholder: 'Enter OpenRC Data', rules: { required: false }, visible: false, tip: 'key-value pair of access variables delimitted by newline.\nSample Input:\nOS_AUTH_URL=...\nOS_PROJECT_ID=...\nOS_PROJECT_NAME=...' },
            { field: fields.caCertdata, label: 'CACert Data', formType: TEXT_AREA, placeholder: 'Enter CACert Data', rules: { required: false }, visible: false, tip: 'CAcert data for HTTPS based verfication of auth URL' },


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
                    this.checkForms(form, forms, true)
                }
            }
            //Todo if more such functions required try to move it to mexforms
            if(this.isUpdate)
            {
                if(form.field === fields.openRCData || form.field === fields.caCertdata)
                {
                    form.visible = false
                }
            }
        }

    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
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
        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


        this.updateFormData(forms, data)

        this.setState({
            forms: forms
        })

    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode( cloudletSteps.stepsCloudletReg )
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));
